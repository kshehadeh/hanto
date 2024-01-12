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
async function checkCommand(dir?: string) {
    let projectDir = dir || process.cwd();

    if (!existsSync(projectDir)) {
        throw new Error(`Directory ${projectDir} does not exist`);
    }

    const prj = await createProject(projectDir);

    const composer = build().h1(`Project: ${prj.config?.name}`).h2(prj.config?.description)

    await prj.validator.validate();

    if (prj.validator.errors.length > 0) {
        composer.h2(':fire:Errors')
        prj.validator.errors.forEach(e => {
            composer.listItem(e.message);
        })
    }

    if (prj.validator.warnings.length > 0) {        
        composer.h2(':warning: Warnings')
        prj.validator.warnings.forEach(w => {
            composer.listItem(w.message);
        })        
    } 
    
    if (prj.validator.errors.length === 0 && prj.validator.warnings.length === 0) {
        composer.p('No errors or warnings found')
    }

    console.log(renderMarkdown(composer.render()));
}

const command: yargs.CommandModule<CommandBuilderParameters, CommandArguments> =
{
    command: 'check [directory]',
    describe: 'Run checks against the given project directory',
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
        await checkCommand(argv.directory);
    },
};

export default command;
