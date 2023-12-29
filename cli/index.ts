import yargs from "yargs";
import hooksCommand from "./commands/analyze";
import visualizeCommand from "./commands/visualize";
import dumpCommand from "./commands/dump";
import projectCommand from "./commands/project";

const argv = yargs(process.argv.slice(2))
    .scriptName("scribbler")
    .usage("$0 <cmd> [args]")
    .command(hooksCommand)
    .command(visualizeCommand)
    .command(dumpCommand)
    .command(projectCommand)
    .demandCommand(1, "You need at least one command before moving on")
    .help().argv;
