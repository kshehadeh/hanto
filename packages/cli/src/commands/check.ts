import * as yargs from 'yargs';
import { existsSync } from 'fs';
import { createProject } from '@hanto/core';
import { projectHeader } from '@/tui/components/project';
import { br, compile, compose, p, text } from 'ansie';
import { issue } from '@/tui/components/issue';

export interface CommandArguments {
    directory: string;
}

/**
 * Parse a file and output information about it
 * @param {string} dir
 */
async function checkCommand(dir?: string) {
    const projectDir = dir || process.cwd();

    if (!existsSync(projectDir)) {
        throw new Error(`Directory ${projectDir} does not exist`);
    }

    const prj = await createProject(projectDir);

    const composer = compose([projectHeader(prj)])

    await prj.validator.validate();

    if (prj.validator.errors.length > 0) {
        composer.add([br(), text(':fire: Errors'), br()])
        prj.validator.errors.forEach(e => {
            composer.add([issue(e)]);
        })
    }

    if (prj.validator.warnings.length > 0) {        
        composer.add(text(':warning: Warnings'))
        prj.validator.warnings.forEach(w => {
            composer.add(issue(w));
        })        
    } 
    
    if (prj.validator.errors.length === 0 && prj.validator.warnings.length === 0) {
        composer.add(p('No errors or warnings found'))
    }

    console.log(compile(composer.toString()));
}

const command: yargs.CommandModule<undefined, CommandArguments> = {
    command: 'check [directory]',
    describe: 'Run checks against the given project directory',
    builder: async (yargs) => {
        return yargs.positional('directory', {
            describe: 'The directory to examine (defaults to current directory)',
            type: 'string',
            default: '.'
        })
    },

    handler: async argv => {
        await checkCommand(argv.directory);
    },
};

export default command;
