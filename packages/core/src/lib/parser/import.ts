import { ImportDeclaration } from '@babel/types';
import { Base } from './base';
import path from 'path';
import { nearestProjectRoot } from '../helpers/nearest-project-root';
import { isRelativePath, isValidFile, isValidDirectory } from '../helpers/file-helpers';


export function resolveImportedFile({
    projectDirectory,
    referenceFileDirectory,
    importedSourceName,
    possibleExtensions = ['ts', 'js', 'mjs', 'cjs', 'tsx', 'jsx'],
    alternativeRootDirectories = ['node_modules'],
}: {
    projectDirectory?: string;
    referenceFileDirectory: string;
    importedSourceName: string;
    possibleExtensions?: string[];
    alternativeRootDirectories?: string[];
}) {
    // First see if it's a relative path.  If it is, then
    //  try to use the source files directory to resolve it.
    if (isRelativePath(importedSourceName)) {
        return resolveImportedFile({
            projectDirectory,
            referenceFileDirectory,
            importedSourceName: path.resolve(referenceFileDirectory, importedSourceName),
            possibleExtensions,
            alternativeRootDirectories,
        });
    } else if (path.isAbsolute(importedSourceName)) {
        // If the file is absolute, then just try to resolve it directly
        if (isValidFile(importedSourceName)) {
            return importedSourceName;
        } else if (isValidDirectory(importedSourceName)) {
            // If this is a directory, then try to resolve it as an index file
            return resolveImportedFile({
                projectDirectory,
                referenceFileDirectory: importedSourceName,
                importedSourceName: path.join(importedSourceName, 'index'),
                possibleExtensions,
                alternativeRootDirectories,
            });
        } else if (path.extname(importedSourceName) === '') {
            // If it's not a valid file and it's not a directory then we can assume that
            //  it's a file without an extension.  In that case, we can use the list of
            //  possible extensions to experiment to see if we can find a file with one of
            //  those extensions.

            const foundExtension = possibleExtensions.find(ext =>
                isValidFile(`${importedSourceName}.${ext}`),
            );

            if (foundExtension) {
                // Found a file with the given extension
                return `${importedSourceName}.${foundExtension}`;
            }
        }
    } else {
        // If there's no relative path, then try to resolve it as one of the alternative root directories
        //  (e.g. node_modules).  For example, if the file is "lodash" then we'll try to resolve it as
        //  "node_modules/lodash".
        for (const rootDirectory of alternativeRootDirectories) {
            const projectDir = projectDirectory || nearestProjectRoot(referenceFileDirectory);
            if (!projectDir) continue;

            return resolveImportedFile({
                projectDirectory: projectDir,
                referenceFileDirectory,
                importedSourceName: path.resolve(projectDir, rootDirectory, importedSourceName),
                possibleExtensions,
                alternativeRootDirectories,
            });
        }
    }

    // Next, try to resolve it as a node module

    return undefined;
}

export class ImportStatement extends Base<ImportDeclaration> {
    public get source() {
        return this._top?.source.value ?? '';
    }

    public get specifiers() {
        return this._top?.specifiers ?? [];
    }

    /**
     * Attempts to find the file that this import statement is importing.
     */
    public resolve({
        projectRoot,
        filePath
    }: {
        projectRoot?: string;
        filePath: string;
    }) {
        if (!this._top?.source?.value) return undefined;

        return resolveImportedFile({
            projectDirectory: projectRoot,
            referenceFileDirectory: path.dirname(filePath),
            importedSourceName: this._top.source.value,
            alternativeRootDirectories: ['node_modules'],
        });
    }
}
