import * as yargs from 'yargs';
import { project } from "scribbler-lib";
import { existsSync } from 'fs';

interface CommandArguments {
  directory: string,
}

interface CommandBuilderParameters {
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

    const prj = await project.loadProject(dir, [project.npmLoader, project.typescriptLoader]);    
    

    prj.loaders.forEach(loader => {
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