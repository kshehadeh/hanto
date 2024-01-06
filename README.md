# Hanto

Hanto is a toy I created to see if I could create a pluggable static analysis tool that had awareness of groups of files (or projects) to help identify systemic issues and be able to be more selective about the issues that it identified at a file level.

## Organization

This a monorepo organized into the core library, a cli and several plugins

1. core - The scribbler core which houses the majority of the functionality
2. cli - The scribbler cli for accessing the functionality in the core.
3. plugin-npm - The NPM plugin
4. plugin-nextjs - The Typescript plugin

## Getting Started

```bash
# at the root
bun install
```

To run the cli:

```bash
# at the root
bun packages/cli/index.ts project -d ./samples/app1
```

## How It Works

Hanto uses the concept of a project to organize the files that it analyzes. A project is a directory that contains a `hanto.json` file. This file contains the configuration for the project and the plugins that should be used to analyze the project.

A "Loader" is a plugin that is responsible for ingesting project files and creating a representation of the project that can be used by "Validators" which are responsible for reporting any warnings or errors. Unlike typical linters, Hanto is more interested in the overall project and the relationship between different files, file names, git representations, etc. For example, while a linter will tell you whether you are using syntax correctly or not following best practices for a language, Hanto can be used to tell you if you are using the same variable name in multiple files or if you are using a variable name that is not consistent with the rest of the project.

## Plugins

Plugins are the mechanism that Hanto uses to extend its functionality. Plugins are responsible for loading files and creating a representation of the project that can be used by validators. Plugins can also provide validators that can be used to report warnings or errors.

## Projects

A project is a representation of an application or library's source code. A project is a directory that contains a `hanto.json` file. This file contains the configuration for the project and the plugins that should be used to analyze the project. As it stands today, hanto is specifically tuned for Javascript and Typescript projects but there's nothing about the architecture that would suggest this is required other than the fact that Hanto itself is written in Typescript.

## Configuration

The Hanto config file should be located either:

1. At the root of the directory (e.g. \<root\>/hanto.json)
2. One of its parent directories (e.g. \<root\>/../hanto.json)
3. A `config` folder at the root (e.g. \<root\>/config/hanto.json)

Configuration supports the following base names:

1. `.hanto.config`,
2. `hanto.config`,
3. `hanto`,
4. `.hanto`,

And the following formats:

1. `.json`
2. `.js`
3. `.ts`
4. `.yaml`
5. `.yml`
6. `.toml`

The configuration file is a JSON file that contains the following properties:

```json
{
    "name": "<string>",
    "description": "<string>",
    "loaders": ["@hanto/plugin-npm", "@hanto/plugin-nextjs", "<string>"]
}
```

Note that the `loaders` property is an array of imported plugins.

## Loaders

Loaders process directories and collect information about them that are specific to a type of project. For example, NPM projects, NextJS, Vite, Rollup, SvelteKit, etc. Note that loaders are not concerned as much with the language in use nor the characteristics of individual files.

To create a Loader plugin you will need to create a new package that exports an instance of a class that implements the `Loader` interface. The `Loader` interface is defined as follows:

```typescript
export interface Loader {
    public get name(): string;
    public get description(): string;
    public get dependencies(): string[];
    public load(): Promise<boolean>;
}
```

```typescript
class MyLoader extends Loader() {
    constructor() {
        super([
            /* No properties */
        ]);
    }

    public get name(): string {
        return 'my-loader';
    }

    public get description(): string {
        return 'My loader description';
    }

    public get dependencies(): string[] {
        return [];
    }

    public async load(): Promise<boolean> {
        // do something
        return true;
    }
}
```

The default export for the plugin would look like this:

```typescript
export default {
    loader: new MyLoader()
    ...
}
```

For an example of a loader, see the `@hanto/plugin-npm` package.

Once a loader is initialized, it becomes available to other plugins to use. This means that the order in which loaders are listed is important as one might require exposed properties in another to fully initialize. Loaders expose data through `Properties` which are described below.

### Loader Properties

Loaders can expose properties that can be used by other plugins. For example, the `@hanto/plugin-npm` exposes information about the number of dependencies there are. Properties are strongly typed using zod schemas. Each property must include information about the type using Zod schemas in the `PropertyDefinition`. This allows Hanto to be more clear about problems that are encountered when one plugin fails to communicate with another.

But loader properties can also be functions. This is a powerful way to expose dynamic information about the project. For example, the `@hanto/plugin-npm` exposes a way to get version information about a given dependency. Like other properties, the input to the function is strong typed using Zod schemas. Validation on the input is done before the function is called making it easier to debug problems.

## Validators [WIP]

Validators are plugins that are responsible for analyzing the project and reporting warnings or errors. Validators are not concerned with individual files as much as they are with best practices as they relate to the project as a whole. For example, a validator might report if there are too many files in a project, the folder structure is not what's expected, or if the configuration is not what's expected.

Validators are often related to loaders in that they use the information that is exposed by the loaders to perform their analysis. For example, a validator might report if there are too many dependencies in a project. This information is exposed by the `@hanto/plugin-npm` loader.

To create a Validator plugin you will need to create a new package that exports a class that implements the `Validator` interface. The `Validator` interface is defined as follows:

```typescript
export interface Validator {
    public get name(): string;
    public get description(): string;
    public validate(): Promise<boolean>;
}
```

## Plugin Orchestration [WIP]

Because plugins need to be aware of each other, there is an orchestration layer than manages the relationships between these plugins. As a plugin writer, if you want to reference another plugin, you can do so like this:

```typescript

export interface Validator {
    ...
    public load(): Promise<boolean> {
        ...
        const deps = this.project().loader("npm").prop("numDependencies");
        ...

        const version = this.project().loader("npm").call("getDependencyVersion", {
            name: "typescript"
        });

        ...
    }
}
```
