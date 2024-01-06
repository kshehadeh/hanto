import path from 'path';
import fs from 'fs';

export function nearestProjectRoot(directory: string): string | undefined {
    if (fs.existsSync(path.join(directory, 'package.json'))) {
        return directory;
    } else {
        const parentDirectory = path.dirname(directory);
        if (parentDirectory === directory) {
            return undefined;
        } else {
            return nearestProjectRoot(parentDirectory);
        }
    }
}
