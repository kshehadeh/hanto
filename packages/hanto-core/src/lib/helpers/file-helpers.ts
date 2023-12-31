import * as fs from 'fs';
import * as path from 'path';

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