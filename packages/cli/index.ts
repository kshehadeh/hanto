import yargs, { CommandModule } from 'yargs';
import infoCommand from './src/commands/info';
import checkCommand from './src/commands/check';

import '@hanto/plugin-git';
import '@hanto/plugin-npm';
import '@hanto/plugin-nextjs';

yargs(process.argv.slice(2))
    .scriptName('hanto')
    .usage('$0 <cmd> [args]')
    .command(infoCommand as CommandModule)
    .command(checkCommand as CommandModule)
    .demandCommand(1, 'You need at least one command before moving on')
    .help().argv;
