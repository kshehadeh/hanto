import * as yargs from 'yargs';
import { containers, ast } from 'scribbler-lib';
import { existsSync } from 'fs';
import { ModuleAnalyzerRenderer } from '../renderers/ModuleAnalyzerRenderer/ModuleAnalyzerRenderer';

interface CommandArguments {
    file: string;
}

interface CommandBuilderParameters {
    file: yargs.Options;
}

/**
 * Parse a file and output information about it
 * @param {string} file
 */
function analyze(file: string) {
    if (!existsSync(file)) {
        throw new Error(`File ${file} does not exist`);
    }

    const node = ast.parseFile(file);
    const module = new containers.ModuleContainer(node);

    const renderer = new ModuleAnalyzerRenderer(module);
    renderer.render();
}

const command: yargs.CommandModule<CommandBuilderParameters, CommandArguments> =
    {
        command: 'analyze [file]',
        describe: 'Parse and output analytics information in the file',
        builder: {
            file: {
                alias: 'f',
                require: true,
                describe: 'The file to parse',
                type: 'string',
            },
        },
        handler: argv => {
            analyze(argv.file);
        },
    };

export default command;