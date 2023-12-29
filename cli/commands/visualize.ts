import * as yargs from 'yargs';
import { ast } from "scribbler-lib";

interface CommandArguments {
    file: string,
}

interface CommandBuilderParameters {
    file: yargs.Options,
}

function visualizer(file: string) {
    const node = ast.parseFile(file);
    ast.printTree(node);
}

const command: yargs.CommandModule<CommandBuilderParameters, CommandArguments> = {
    command: 'visualize',
    describe: '',
    builder: {
        file: {
            alias: 'f',
            require: true,
            describe: 'The file to parse',
            type: 'string',
        }
    },
    handler: (argv) => visualizer(argv.file),
}

export default command;