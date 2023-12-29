import { getImportDeclarations, parseFile } from '@/lib/ast';
import {
    isBuiltInNodeModule,
    isExternalFile,
    resolveImportedFile,
} from '@/lib/files';
import { ILoader, IProject } from '@/shared';
import path from 'path';

export class TypescriptFile {
    private _absolutePath: string;
    private _project: IProject | null = null;
    private _loader: ILoader;
    private _importedFiles: string[] = [];
    private _importedFileObjects: TypescriptFile[] = [];
    private _importedBuiltInNodeModules: string[] = [];
    private _evaluationDepth: number;

    constructor(
        readonly absolutePath: string,
        loader: ILoader,
        evaluationDepth: number,
    ) {
        this._absolutePath = absolutePath;
        this._loader = loader;
        this._project = loader.project;
        this._evaluationDepth = evaluationDepth;

        this.initialize();
    }

    public get importedFiles() {
        return this._importedFiles;
    }

    protected processImportedFiles() {
        const rootNode = parseFile(this._absolutePath);
        const imports = getImportDeclarations(rootNode);
        this._importedFiles = imports
            .map(i => {
                if (!i.source?.value) return undefined;

                const source = i.source.value.toString();
                if (isBuiltInNodeModule(source)) {
                    this._importedBuiltInNodeModules.push(source);
                    return source;
                }
                const resolvedFile = resolveImportedFile(
                    this._project?.path || '',
                    path.dirname(this._absolutePath),
                    source,
                );
                if (!resolvedFile) {
                    this._loader.errors.push({
                        message: `Unable to resolve file ${source} in ${this._absolutePath}`,
                    });
                }
                return resolvedFile;
            })
            .filter(f => f !== undefined) as string[];

        if (isExternalFile(this._absolutePath)) {
            // Don't descend into node_modules
            this._importedFiles = [];
        } else if (this._evaluationDepth > 0 || this._evaluationDepth === -1) {
            // If we're not at the bottom of the evaluation depth, then
            //  we need to create the imported file objects
            this._importedFileObjects = this._importedFiles.map(
                f =>
                    new TypescriptFile(
                        f,
                        this._loader,
                        this._evaluationDepth - 1,
                    ),
            );
        }
    }

    public initialize() {
        this.processImportedFiles();
    }
}
