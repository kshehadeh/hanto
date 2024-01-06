import yargs, { CommandModule } from 'yargs';
import projectCommand from './src/commands/info';

import '@hanto/plugin-git';
import '@hanto/plugin-npm';
import '@hanto/plugin-nextjs';

yargs(process.argv.slice(2))
    .scriptName('hanto')
    .usage('$0 <cmd> [args]')
    .command(projectCommand as CommandModule)
    .demandCommand(1, 'You need at least one command before moving on')
    .help().argv;
