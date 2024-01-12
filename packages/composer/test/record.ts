import { compile } from "../src/compiler";
import { parse } from "../src/parser/generated-parser";
import fixtures from "./test-strings";

export function record (input: string): { ast: any, input: string, output: string } {
    console.log("Recording: ", input)
    const ast = parse(input);
    const output = compile(input);
    return {
        input,
        ast,
        output,
    };
}

const results = fixtures.map(f => record(f));

// Write recorded results to a file
import { writeFileSync } from "fs";
import { resolve } from "path";
const currentDir = import.meta.url.replace('file://', '').replace('/record.ts', '');
writeFileSync(resolve(currentDir, 'fixtures.json'), JSON.stringify(results, null, 2), 'utf8');
