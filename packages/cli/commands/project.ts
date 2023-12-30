import * as yargs from 'yargs';
import { existsSync } from 'fs';
import { Project } from 'scribbler-core';
import npmLoader from 'scribbler-plugin-npm';
import nextJsLoader from 'scribbler-plugin-nextjs';
import { createProject } from 'scribbler-core/src/lib/project';

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

    const prj = await createProject(dir, [npmLoader, nextJsLoader]);
    
    prj.loaders.forEach((loader) => {
        console.log(loader.name);
        console.log(loader.errors);
        console.log(loader.warnings);
        console.log(loader.properties);
    });
    
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