import * as yargs from 'yargs';
import { existsSync } from 'fs';
import { createProject } from '@hanto/core';
import { projectHeader } from '@/tui/components/project';
import { compile } from 'ansie';

export interface CommandArguments {
    directory: string;
}

export interface CommandBuilderParameters {
    directory: yargs.Options;
}

/**
 * Parse a file and output information about it
 * @param {string} dir
 */
async function infoCommand(dir?: string) {
    const projectDir = dir || process.cwd();

    if (!existsSync(projectDir)) {
        throw new Error(`Directory ${projectDir} does not exist`);
    }

    const prj = await createProject(projectDir);
    console.log(compile(projectHeader(prj).toString()));
}

const command: yargs.CommandModule<CommandBuilderParameters, CommandArguments> =
    {
        command: 'info [directory]',
        describe: 'Process information about the given project directory',
        builder: {
            directory: {
                alias: 'd',
                demandOption: false,
                describe:
                    'The directory to examine (defaults to current directory)',
                type: 'string',
            },
        },

        handler: async argv => {
            await infoCommand(argv.directory);
        },
    };

export default command;
