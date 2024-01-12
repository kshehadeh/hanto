import path from 'path';
import { readFileSync, writeFileSync } from 'fs';
import peggy from 'peggy';

const currentDir = import.meta.dir;

const grammar = readFileSync(path.resolve(currentDir, 'terminal-markup.peggy'), 'utf8');
const parserSource: string = peggy.generate(grammar, {
    output: 'source',
    format: 'commonjs',
    // plugins: [tspeggy],
});
writeFileSync(path.resolve(currentDir, 'generated-parser.js'), parserSource, 'utf8')