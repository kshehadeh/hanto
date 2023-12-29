import path from 'path';
import fs from 'fs';

const builtInNodeModules = [
    'fs',
    'http',
    'https',
    'url',
    'path',
    'os',
    'events',
    'util',
    'stream',
    'querystring',
    'crypto',
    'zlib',
    'buffer',
    'child_process',
    'net',
    'dns',
    'readline',
    'cluster',
    'http2',
];

export function isValidFile(file: string) {
    return fs.existsSync(file) && fs.statSync(file).isFile();
}

export function isRelativePath(file: string) {
    return !path.isAbsolute(file) && file.startsWith('.');
}

export function isValidDirectory(dir: string) {
    return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
}

export function isExternalFile(file: string) {
    return file.includes('node_modules');
}

export function isBuiltInNodeModule(importedName: string) {
    return builtInNodeModules.includes(importedName);
}

export function resolveImportedFile(
    projectDirectory: string,
    referenceFileDirectory: string,
    file: string,
    possibleExtensions: string[] = ['ts', 'js', 'mjs', 'cjs', 'tsx', 'jsx'],
    alternativeRootDirectories: string[] = ['node_modules'],
) {
    // First see if it's a relative path.  If it is, then
    //  try to use the source files directory to resolve it.
    if (isRelativePath(file)) {
        return resolveImportedFile(
            projectDirectory,
            referenceFileDirectory,
            path.resolve(referenceFileDirectory, file),
            possibleExtensions,
            alternativeRootDirectories,
        );
    } else if (path.isAbsolute(file)) {
        // If the file is absolute, then just try to resolve it directly
        if (isValidFile(file)) {
            return file;
        } else if (isValidDirectory(file)) {
            // If this is a directory, then try to resolve it as an index file
            return resolveImportedFile(
                projectDirectory,
                file,
                path.join(file, 'index'),
                possibleExtensions,
                alternativeRootDirectories,
            );
        } else if (path.extname(file) === '') {
            // If it's not a valid file and it's not a directory then we can assume that
            //  it's a file without an extension.  In that case, we can use the list of
            //  possible extensions to experiment to see if we can find a file with one of
            //  those extensions.

            const foundExtension = possibleExtensions.find(ext =>
                isValidFile(`${file}.${ext}`),
            );

            if (foundExtension) {
                // Found a file with the given extension
                return `${file}.${foundExtension}`;
            }
        }
    } else {
        // If there's no relative path, then try to resolve it as one of the alternative root directories
        //  (e.g. node_modules).  For example, if the file is "lodash" then we'll try to resolve it as
        //  "node_modules/lodash".
        for (const rootDirectory of alternativeRootDirectories) {
            return resolveImportedFile(
                projectDirectory,
                referenceFileDirectory,
                path.resolve(projectDirectory, rootDirectory, file),
                possibleExtensions,
                alternativeRootDirectories,
            );
        }
    }

    // Next, try to resolve it as a node module

    return undefined;
}
