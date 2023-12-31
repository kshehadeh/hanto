import * as fs from 'fs';
import z from 'zod';
import PackageJsonSchema from './schemas/package.schema';
import { Loader } from 'hanto-core';

function runNpm(cmd: string, cwd: string) {
    return new Promise<string>((resolve, reject) => {
        const child = require('child_process').spawn('npm', [cmd], {
            cwd,
        });

        let output = '';

        child.stdout.on('data', (data: string) => {
            output += data;
        });

        child.stderr.on('data', (data: string) => {
            output += data;
        });

        child.on('close', (code: number) => {
            if (code !== 0) {
                reject(new Error(output));
            } else {
                resolve(output);
            }
        });
    });
}

class NpmLoader extends Loader {
    private _packageJson: z.infer<typeof PackageJsonSchema> | null = null;

    public constructor() {
        super([
            {
                name: 'startingFile',
                description: 'Starting file for the project',
                valueSchema: z.string(),
            },
            {
                name: 'numberOfTopLevelDependencies',
                description: 'Number of top level dependencies',
                valueSchema: z.number(),
            },
            {
                name: 'numberOfTopLevelDevDependencies',
                description: 'Number of top level dev dependencies',
                valueSchema: z.number(),

            },
            {
                name: 'getDependencyVersion',
                description: 'Gets the version of a dependency',
                type: 'function',
                optionsSchema: z.object({
                    name: z.string(),
                }),
            },
            {
                name: 'resolveDependencyFolder',
                description: 'Returns the folder of a given dependency for this project',
                type: 'function',
                optionsSchema: z.object({
                    name: z.string(),
                }),
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

    private loadPackageJson() {
        const project = this.project;
        if (!project) throw new Error('Loader not initialized');
        if (!project.dir) throw new Error('Project directory not set');

        // first, see if we can find a package.json file.  This will help inform where
        //  to start looking for files.
        const packageJson = project.findFile(
            project.dir,
            'package.json',
            0,
        );
        if (packageJson) {
            // We can also use this file to determine what the starting file is.
            // no-dd-sa
            const packageJsonContents = fs.readFileSync(
                packageJson, { encoding: 'utf-8' },
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

    public getDependencyVersion(dependencyName: string) {
        if (typeof dependencyName !== 'string') throw new Error('Invalid name');

        if (this._packageJson?.dependencies?.[dependencyName]) {
            return this._packageJson.dependencies[dependencyName];
        } else if (this._packageJson?.devDependencies?.[dependencyName]) {
            return this._packageJson.devDependencies[dependencyName];
        } else {
            return null;
        }
    }

    public resolveDependencyFolder(dependencyName: string) {
        const project = this.project;
        if (!project) throw new Error('Loader not initialized');
        if (!project.dir) throw new Error('Project directory not set');

        if (typeof dependencyName !== 'string') throw new Error('Invalid name');
        const root = runNpm('root', project!.dir);


    }

    public async load() {
        this._packageJson = this.loadPackageJson();
        if (this._packageJson) {
            this.set('getDependencyVersion', this.getDependencyVersion);
            this.set('resolveDependencyFolder', this.resolveDependencyFolder);

            this.processDependencies(this._packageJson);
            this.processStartingFile(this._packageJson);
        }

        return this.errors.length === 0;
    }
}

export default new NpmLoader();
