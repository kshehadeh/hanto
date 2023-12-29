import path from 'path';
import { IProject, Loader, resolveImportedFile } from 'scribbler-core';
import { TypescriptFile } from './lib/file';

class TypescriptLoader extends Loader {
    private _startingFile: TypescriptFile | null;

    get name() {
        return 'typescript';
    }

    get description() {
        return 'Reads and understands typescript projects';
    }

    public constructor() {
        super([]);
        this._startingFile = null;
    }

    public initialize(project: IProject): boolean {
        super.initialize(project);

        const npmLoader = project.getLoader('npm');
        if (!npmLoader) {
            this._errors.push({
                message: 'npm loader is required for typescript loader',
            });

            return false;
        }

        return true;
    }

    public async load() {
        if (!this._project) throw new Error('Loader not initialized');

        const npmLoader = this._project.getLoader('npm');
        if (!npmLoader) {
            throw new Error('npm loader is required for typescript loader');
        }

        if (this.errors.length > 0) {
            throw new Error("Can't load typescript loader with errors");
        }

        let startingFileName = npmLoader.getString('startingFile') ?? null;

        if (!startingFileName) {
            this.errors.push({
                message: 'npm loader must have found a starting file',
            });
        } else {
            if (
                !path.isAbsolute(startingFileName) &&
                !startingFileName.startsWith('.')
            ) {
                // if the starting file is not absolute and doesn't start with a . then we should
                //  assuyme that it is relative to the project root
                startingFileName = `./${startingFileName}`;
            }

            const startingFilePath = resolveImportedFile(
                this._project.path,
                this._project.path,
                startingFileName,
            );

            if (!startingFilePath) {
                this.errors.push({
                    message: `Unable to resolve starting file ${startingFileName}`,
                });
            } else {
                this._startingFile = new TypescriptFile(
                    startingFilePath,
                    this,
                    -1,
                );
            }
        }

        return this.errors.length > 0;
    }
}

export default new TypescriptLoader();
