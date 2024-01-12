import * as yargs from 'yargs';
import { existsSync } from 'fs';
import { projectView } from '../tui/components/project';
import { createProject } from '@hanto/core';
import { build } from '../tui/composer';
import { renderMarkdown } from '../tui/renderer';

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
    let projectDir = dir || process.cwd();

    if (!existsSync(projectDir)) {
        throw new Error(`Directory ${projectDir} does not exist`);
    }

    const prj = await createProject(projectDir);

    const markdown = build()
        .h1(`Project: ${prj.config?.name}`)
        .h2(prj.config?.description)
        .append(projectView(prj))
        .render();

    console.log(renderMarkdown(markdown));
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
