import * as yargs from 'yargs';
import { existsSync } from 'fs';
import { render } from 'ink';
import { ProjectView } from '../components/ProjectView';
import { createProject } from '@hanto/core';

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
async function projectCommand(dir: string) {    
    if (!existsSync(dir)) {        
        throw new Error(`Directory ${dir} does not exist`);
    }

    const prj = await createProject(dir);
    
    render(<ProjectView project={prj}/>);
    
}

const command: yargs.CommandModule<CommandBuilderParameters, CommandArguments> = {
    command: 'project [directory]',
    describe: 'Process information about the given project directory',
    builder: {
        directory: {
            alias: 'd',
            demandOption: true,
            describe: 'The directory to examine',
            type: 'string',
        }
    },

    handler: async (argv) => {await projectCommand(argv.directory)},
}

export default command;