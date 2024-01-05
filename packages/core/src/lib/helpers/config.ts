import z from 'zod'
import { existsSync, readFileSync } from 'fs'
import { dirname, extname, basename, resolve } from 'path'
import { parse as parseToml } from 'toml'
import { parse as parseYaml } from 'yaml'
import { isValidDirectory, isValidFile } from './file-helpers'
import { Issue } from '../../..'

const parseJson = JSON.parse

const configParsers = [
    {
        name: 'JS/TS Parser',
        extensions: ['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx'],
        parser: async (file: string) => {
            return await import(file)
        }
    },
    {
        name: 'JSON Parser',
        extensions: ['.json', '.json5'],
        parser: (file: string) => {
            return parseJson(readFileSync(file, 'utf8'))
        }
    },
    {
        name: 'TOML Parser',
        extensions: ['.toml'],
        parser: (file: string) => {
            return parseToml(readFileSync(file, 'utf8'))
        }
    },
    {
        name: 'YAML Parser',
        extensions: ['.yaml', '.yml'],
        parser: (file: string) => {
            return parseYaml(readFileSync(file, 'utf8'))
        }
    },
]

const configBaseNames = [
    '.hanto.config',
    'hanto.config',
    'hanto',
    '.hanto',
]

const CongigSchema = z.object({
    name: z.string(),
    version: z.string().optional(),
    description: z.string().optional(),
    root: z.string().optional(),
    loaders: z.array(z.string()).optional(),
});

/**
 * The ProjectConfig class is responsible for loading and parsing the hanto.config file
 * for a project.  It will search for the config file in the current directory and any
 * parent directories.  If it cannot find a config file, then it will search for a config
 * file in the config directory of the current directory.  If it cannot find a config file
 * in either of those locations, then it will add an error to the object.
 */
export class ProjectConfig {
    _path: string | undefined = undefined;
    _config: z.infer<typeof CongigSchema> | undefined  = undefined;
    warnings: Issue[] = [];
    errors: Issue[] = [];

    constructor(root: string) {
        let configPath: string | undefined = undefined
        if (isValidFile(root)) {
            configPath = root
        } else if (isValidDirectory(root)) {
            // Try to find in the current directory and any parent directories
            let configFiles = this.findInUpwardsDirectory(root)

            if (configFiles.length === 0) {
                // Try to find in the config directory if one exists
                configFiles = this.findInConfigDirectory(root) 
            }

            if (configFiles.length > 0) {
                if (configFiles.length > 1) {
                    this.warnings.push({
                        message: `Found multiple config files in ${root}. Using ${configFiles[0]}`,                        
                    })                    
                }

                configPath = configFiles[0]                
            }
        } else {
            this.errors.push({
                message: `Could not find config file in ${root}`,
            })
        }

        if (configPath) {
            this._config = this.parse(configPath)
            if (this._config) {
                this._path = configPath
            }
        }
    }

    findInUpwardsDirectory(dir: string): string[] {
        const configFiles = this.findInDirectory(dir)
        if (configFiles.length > 0) {
            return configFiles
        } else {
            const parentDir = resolve(dir, '..')
            if (parentDir !== dir) {
                return this.findInUpwardsDirectory(parentDir)
            }
        }

        return []
    }

    /**
     * The path to the config file (not necessarily the project root - see `root`)
     */
    get path () {
        return this._path
    }

    get ob () {
        return this._config
    }   

    /**
     * The root directory for the project as an absolute file path.  This is the directory that contains the config file or
     * if the config file specifies a root prop, it will return the absolute path to that directory.
     */
    get root() {
        if (this._config?.root) {
            return this._config.root;
        } else {
            return this.path ? dirname(this.path) : resolve('.')
        }
    }

    findInConfigDirectory(dir: string): string[] {
        const configFiles = this.findInDirectory(resolve(dir, 'config'))
        if (configFiles.length > 0) {
            return configFiles
        } else {
            return []
        }
    }
    findInDirectory(dir: string): string[] {
        const extensions = this.allowedExtensions()
        const configFiles = configBaseNames.map(baseName => {
            const foundExtension = extensions.find(ext => {
                const fileName = resolve(dir, `${baseName}${ext}`)
                if (existsSync(fileName)) {
                    return true
                }            
            })

            if (foundExtension) {
                return resolve(dir, `${baseName}${foundExtension}`)
            }
        }).filter((f): f is string => f !== undefined)

        return configFiles
    }

    allowedExtensions() {
        return configParsers.flatMap(p => p.extensions)
    }

    /**
     * Determines if the given file is a valid config file
     * @param fileName 
     * @returns 
     */
    parse(fileName: string) {
        try {
            const baseName = basename(fileName)
            if (configBaseNames.find(b => baseName.startsWith(b))) {
                const ext = extname(fileName)
                const parser = configParsers.find(parser => {
                    return parser.extensions.includes(ext)
                })
                const ob = parser?.parser(fileName)            
                const result = CongigSchema.safeParse(ob)
                if (result.success) {
                    return result.data
                } else {
                    result.error.issues.forEach(e => {
                        this.errors.push({
                            message: e.message,
                            path: e.path
                        })
                    })
                }
            }    
        } catch (error) {
            this.errors.push({
                message: `Could not parse config file ${fileName}: ${error}`,
                path: [fileName],
            })
        }
        return undefined;
    }    
}