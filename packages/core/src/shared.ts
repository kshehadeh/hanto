export interface Issue {
    message: string;
    path?: (string | number)[];
    lineStart?: number;
    lineEnd?: number;
    columnStart?: number;
    columnEnd?: number;
}

export type PropertyFunction = (...args: unknown[]) => PropertyValue;

export type PropertyValue =
    | string
    | number
    | boolean
    | string[]
    | number[]
    | null
    | PropertyFunction;

export interface PropertyDefinition {
    name: string;
    description: string;
    type: 'string' | 'number' | 'boolean' | 'array' | 'function';
}

export interface IProject {
    readonly id: string;
    readonly path: string;
    readonly loaders: ILoader[];

    getLoader(name: string): ILoader | undefined;
    addLoader(loader: ILoader): void;
    load(): Promise<void>;
    findFile(
        pathToSearch: string,
        fileName: string,
        depth?: number,
    ): Promise<string | null>;    
}

/**
 * The loader interface is defined here so we don't have cyclic dependencies.  The loader interface
 * is implemented by the Loader class in lib/src/project/loaders/index.ts. Plugins further derive from
 * the Loader class to implement specific processing for different types of projects.
 */
export interface ILoader {
    name: string;
    description: string;
    project: IProject | null;
    initialize(project: IProject): boolean;
    load(): Promise<boolean>;
    get(key: string): PropertyValue | undefined;
    getString(key: string): string | undefined;
    errors: Issue[];
    warnings: Issue[];
    properties: Record<string, PropertyDefinition & { value: PropertyValue }>;
}
