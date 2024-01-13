
// A command parser for the composer CLI that takes the following arguments:
//       --help     Show help                                             [boolean]
//       --version  Show version number                                   [boolean]
//   -i, --input    Specify the input file                                 [string]
//   -m, --markup   Specify the markup text (instead of a file)            [string]
//   -o, --output   Specify the output file                                [string]
//   -a, --ast      Output the AST instead of the compiled text           [boolean]

import yargs from 'yargs';
import fs from 'fs';
import { hideBin } from 'yargs/helpers';
import { compile } from './src/compiler';
import pkg from './package.json';
import { parseString } from './src/parser';

const y = yargs(hideBin(process.argv))    
    .scriptName('ansie')
    .version(pkg.version)
    .usage('Usage: ansie -i/-m <inputfile/markup>')
    .option('input', {
        alias: 'i',
        type: 'string',
        description: 'Specify the input file',
    })
    .option('markup', {
        alias: 'm',
        type: 'string',
        description: 'Specify the markup text (instead of a file)',
    })
    .option('output', {
        alias: 'o',
        type: 'string',
        description: 'Specify the output file',
    })
    .option('ast', {
        alias: 'a',
        type: 'boolean',
        description: 'Output the AST instead of the compiled text',
    })
    .check((argv) => {
        if (argv.input && argv.markup) {
            throw(new Error('You must specify either --input or --markup, not both'));
        }

        if (!argv.input && !argv.markup) {
            throw(new Error('You must specify either --input or --markup so that the compiler knows what to compile'));
        }

        if (argv.input) {
            if (!fs.existsSync(argv.input)) {
                throw(new Error(`The input file ${argv.input} does not exist`));
            }
        }

        return true
    })


const argv = await y.argv;
if (argv.help) {
    y.showHelp();
} else if (argv.version) {
    console.log(pkg.version);
} else {    
    let input = ''
    if (argv.input) {
        // Read the input file into the string `input`
        input = fs.readFileSync(argv.input, 'utf8');
    } else if (argv.markup) {
        input = argv.markup;
    } 

    if (input) {
        let output = '';
        if (argv.ast) {
            output = JSON.stringify(parseString(input), null, 4);
        } else {
            output = compile(input);
        }

        if (output) {
            if (argv.output) {
                fs.writeFileSync(argv.output, output);
            } else {
                console.log(output);
            }    
        } else {
            throw(new Error('No output was generated'));
        }
    }
}

