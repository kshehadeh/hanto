import * as yargs from 'yargs';
import { existsSync } from 'fs';
import { render } from 'ink';
import { ProjectView } from '../components/ProjectView';
import { createProject } from '@hanto/core';
import { ValidationView } from '../components/ValidationView';

export interface CommandArguments {
  directory: string,
}

export interface CommandBuilderParameters {
  directory: yargs.Options,
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
    
    prj.validator.validate();

    render(<ValidationView project={prj}/>)
    
}

const command: yargs.CommandModule<CommandBuilderParameters, CommandArguments> = {
    command: 'check',
    describe: 'Run checks based on the configuration in the current directory or a given project directory',
    builder: {
        directory: {
            alias: 'd',
            demandOption: false,
            describe: 'The directory to examine (defaults to current directory)',
            type: 'string',
        }
    },

    handler: async (argv) => {await checkCommand(argv.directory)},
}

export default command;