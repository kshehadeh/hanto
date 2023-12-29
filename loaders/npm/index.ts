import fs from 'fs';
import z from 'zod';
import PackageJsonSchema from './schemas/package.schema';
import { Loader } from 'scribbler-core';

class NpmLoader extends Loader {
    private _packageJson: z.infer<typeof PackageJsonSchema> | null = null;

    public constructor() {
        super([
            {
                name: 'startingFile',
                description: 'Starting file for the project',
                type: 'string',
            },
            {
                name: 'numberOfTopLevelDependencies',
                description: 'Number of top level dependencies',
                type: 'number',
            },
            {
                name: 'numberOfTopLevelDevDependencies',
                description: 'Number of top level dev dependencies',
                type: 'number',
            },
            {
                name: 'getDependencyVersion',
                description: 'Gets the version of a dependency',
                type: 'function',
            },
        ]);
    }

    get name(): string {
        return 'npm';
    }
    get description(): string {
        return 'Reads and understands npm packages';
    }

    private processStartingFile(
        packageJson: z.infer<typeof PackageJsonSchema>,
    ) {
        let startingFile = '';

        if (packageJson.main) {
            startingFile = packageJson.main;
        } else if (packageJson.module) {
            startingFile = packageJson.module;
        }

        if (startingFile) {
            this.set('startingFile', startingFile);
        }
    }

    private processDependencies(
        packageJson: z.infer<typeof PackageJsonSchema>,
    ) {
        if (packageJson.dependencies) {
            this.set(
                'numberOfTopLevelDependencies',
                Object.keys(packageJson.dependencies).length,
            );
        }

        if (packageJson.devDependencies) {
            this.set(
                'numberOfTopLevelDevDependencies',
                Object.keys(packageJson.devDependencies).length,
            );
        }
    }

    private async loadPackageJson() {
        if (!this._project) throw new Error('Project not initialized');

        // first, see if we can find a package.json file.  This will help inform where
        //  to start looking for files.
        const packageJson = await this._project.findFile(
            this._project.path,
            'package.json',
            0,
        );
        if (packageJson) {
            // We can also use this file to determine what the starting file is.
            const packageJsonContents = await fs.promises.readFile(
                packageJson,
                {
                    encoding: 'utf-8',
                },
            );

            const parseResult = PackageJsonSchema.safeParse(
                JSON.parse(packageJsonContents),
            );

            if (!parseResult.success) {
                if (parseResult.error.issues.length > 0) {
                    this.errors.push(
                        ...parseResult.error.issues.map(i => ({
                            message: i.message,
                            path: i.path,
                        })),
                    );
                } else {
                    this.errors.push({
                        message:
                            'package.json is not a valid package.json file',
                    });
                }
            } else {
                return parseResult.data;
            }
        } else {
            this.errors.push({
                message: 'No package.json file found',
            });
        }

        return null;
    }

    public async load() {
        this._packageJson = await this.loadPackageJson();
        if (this._packageJson) {
            this.set('getDependencyVersion', (name: string) => {
                if (typeof name !== 'string') throw new Error('Invalid name');

                if (this._packageJson?.dependencies?.[name]) {
                    return this._packageJson.dependencies[name];
                } else if (this._packageJson?.devDependencies?.[name]) {
                    return this._packageJson.devDependencies[name];
                } else {
                    return null;
                }
            });

            this.processDependencies(this._packageJson);
            this.processStartingFile(this._packageJson);
        }

        return this.errors.length === 0;
    }
}

export default new NpmLoader();
