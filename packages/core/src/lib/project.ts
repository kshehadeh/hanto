import { v5 as uuidV5 } from 'uuid';
import fs from 'fs';
import path from 'path';
import orchestrator from '@/lib/orchestrator';
import { Loader } from './loader';
import { ProjectConfig } from './helpers/config';
import { Issue } from '@/interfaces';
import { Validator } from './validator';

/**
 * A project is a collection of files that are related to each other in some way.  For example, a project
 * could be a typescript project, a javascript project, a python project, etc.  The project is responsible
 * for loading all of the files that are part of the project and making them available to the rest of the
 * system.
 *
 * A project has multiple loaders.  These are context-aware mods that allow you to define certain rules
 * for generating metadata about each project that is specific to a given project type.  For example, a
 * typescript project will have a typescript loader that knows how to load all of the typescript files
 * in the project and generate metadata about them.
 *
 * Loaders can depend on other loaders to get additional information.  This means that the order in which
 * you add loaders to a project is important.  For example, the typescript loader depends on the npm loader
 * to find the starting file for the project.  If you add the typescript loader before the npm loader then
 * the typescript loader will not be able to find the starting file and will fail to load.
 */
export class Project {
    private _id: string;
    private _loaders: Loader[] = [];
    private _validator: Validator = new Validator();
    private _config: ProjectConfig | undefined = undefined;
    private _errors: Issue[] = [];
    private _warnings: Issue[] = [];

    constructor(path: string) {
        // make sure we have a unique id for the project
        this._id = uuidV5('https://www.w3.org/', uuidV5.URL);

        if (path) {
            this._config = new ProjectConfig(path);
            if (this._config.errors.length > 0) {
                throw new Error(`Could not load project at ${path}: \n\t${this._config.errors.map(e => e.message).join('\n\t')}`);
            }
        }        
    }

    public get id() {
        return this._id;
    }

    public get config() {
        return this._config?.ob;
    }

    public get dir() {
        return this._config?.root
    }

    public async add<T extends Loader>(loader: T) {
        if (this._loaders.find(l => l.name === loader.name)) {
            throw new Error(`Loader ${loader.name} already exists`);
        }

        if (loader.initialize(this.id)) {
            this._loaders.push(loader);
        }
    }

    public get validator() {
        return this._validator;
    }

    public loader(name: string) {
        return this._loaders.find(l => l.name === name);
    }

    public get loaders() {
        return this._loaders;
    }

    public async load() {
        const loaders = this._config?.ob?.loaders

        if (loaders) {
            for (const l of loaders) { 
                try {
                    const {default: api} = await import(l);
                    if (api) {
                        this.add(api.loader);

                        if (api.rules) {
                            for (const rule of api.rules) {
                                this._validator.add(rule);
                            }
                        }
                    }        
                                
                } catch (err) {
                    this.errors.push({
                        message: `Could not load loader ${l}: ${err}`,
                        path: [l],                        
                    })
                }
            }
        }

        for (const loader of this._loaders) {
            await loader.load();
        }
    }

    public get errors() {
        return this._errors;
    }

    public get warnings() {
        return this._warnings;
    }

    /**
     * Finds a file with the given name by descending into the given file path.  You can
     * specify how far to descend into the folder structure by specifying the depth.
     *
     * A depth of 0 means that we will only look in the given path.
     * A depth of 1 means that we will look in the given path and all of its immediate children. A depth of 2 will
     *  look in the given path, all of its immediate children, and all of their immediate children, etc.
     * A depth of -1 means that we will look in the given path and all of its children, no matter how deep.
     *
     * @param pathToSearch
     * @param fileName
     * @param depth
     * @returns
     */
    public findFile(
        pathToSearch: string,
        fileName: string,
        depth = 0,
    ): string | null {
        const entries = fs.readdirSync(pathToSearch, {
            withFileTypes: true,
        });

        for (const entry of entries) {
            const entryPath = path.join(pathToSearch, entry.name);
            if (entry.isDirectory()) {
                if (depth !== 0) {
                    const nestedPath = this.findFile(
                        entryPath,
                        fileName,
                        depth - 1,
                    );
                    if (nestedPath) {
                        return nestedPath;
                    }
                }
            } else if (entry.name === fileName) {
                return entryPath;
            }
        }

        return null;
    }
}

/**
 * Creates a new project at the given path and loads it using the given loaders.
 * @param path The path to the project directory (usually where the config for hanto lives)
 * @param loaders An array of strings that are the same as the loader project names.  For example, if you want to
 *      load the npm loader, you would pass in `['loader-npm']`.
 * @returns 
 */
export async function createProject(path: string) {

    const project = new Project(path);

    // MUST ADD PROJECT TO ORCHESTRATOR BEFORE LOAD 
    //  This is to ensure that loaders have access to other loaders 
    //  during the initialization process.
    orchestrator.add(project)

    // This will iterate through the loaders in order and initialize them
    //  with the project id.  This is important because some loaders depend
    //  on other loaders to be initialized first.
    await project.load();

    return project;
}