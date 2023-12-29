import * as yargs from 'yargs';
import { existsSync, writeFile } from 'fs';
import { ast } from 'scribbler-lib';

interface CommandArguments {
    file: string,
    outfile: string,
}

interface CommandBuilderParameters {
    file: yargs.Options,
    outfile: yargs.Options,
}

/**
 * Parse a file and output information about it
 * @param {string} file 
 */
function dump(file: string, outfile: string) {    
    if (!existsSync(file)) {        
        throw new Error(`File ${file} does not exist`);
    }

    const node = ast.parseFile(file);
    
    const json = JSON.stringify(node, null, 2)

    // Write JSON to file     
    writeFile(outfile, json, function(err) {
        if (err) {
            throw err;
        }
    });
}

const command: yargs.CommandModule<CommandBuilderParameters, CommandArguments> = {
    command: 'dump [file]',
    describe: 'Parse and output the AST as a JSON object to a file',
    builder: {
        file: {
            alias: 'f',
            require: true,
            describe: 'The file to parse',
            type: 'string',
        },
        outfile: {
            alias: 'o',
            require: true,
            describe: 'The file to output to',
            type: 'string',
        }
    },
    handler: (argv) => {dump(argv.file, argv.outfile)},
} 

export default command;