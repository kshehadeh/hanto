import yargs, { CommandModule } from 'yargs';
import projectCommand from './commands/project';

yargs(process.argv.slice(2))
    .scriptName('scribbler')
    .usage('$0 <cmd> [args]')
    .command(projectCommand as CommandModule)
    .demandCommand(1, 'You need at least one command before moving on')
    .help().argv;
