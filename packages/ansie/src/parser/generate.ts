import path from 'path';
import { readFileSync, writeFileSync } from 'fs';
import peggy from 'peggy';

const currentDir = import.meta.dir;
const inFile = path.resolve(currentDir, 'terminal-markup.peggy');

console.log('Reading grammar from ', inFile);

const grammar = readFileSync(inFile, 'utf8');
const parserSource: string = peggy.generate(grammar, {
    output: 'source',
    format: 'commonjs',
    // plugins: [tspeggy],
});

const outFile = path.resolve(currentDir, 'generated-parser.js');

console.log('Writing parser to ', outFile);
writeFileSync(outFile, parserSource, 'utf8');
