import {
    ILoader,
    Issue,
    IProject,
    PropertyDefinition,
    PropertyValue,
} from '@/shared';

/**
 * The loader abstarct class is implemented by plugins to provide additional
 * functionality for specific types of projects.  For example, the typescript
 * loader is a plugin that knows how to load typescript projects.
 *
 * The loader is responsible for processing all of the files that are part of the
 * project and making metadata about those files available to the rest of the system.
 */
export abstract class Loader implements ILoader {
    protected _project: IProject | null;
    protected _valid: boolean;
    protected _errors: Issue[];
    protected _warnings: Issue[];
    protected _properties: Record<string, PropertyValue>;
    protected _propertyDefinitions: PropertyDefinition[];

    public constructor(propertyDefinitions: PropertyDefinition[]) {
        this._project = null;
        this._valid = false;
        this._errors = [];
        this._warnings = [];
        this._properties = {};
        this._propertyDefinitions = propertyDefinitions;
    }

    public initialize(project: IProject) {
        this._project = project;
        return true;
    }

    abstract get name(): string;
    abstract get description(): string;
    abstract load(): Promise<boolean>;

    public get project() {
        return this._project;
    }

    public get valid() {
        return this._valid;
    }

    public get errors() {
        return this._errors;
    }

    public get warnings() {
        return this._warnings;
    }

    /**
     * Returns a list of all of the properties that are supported by this loader.
     * This combines both the property definition with the current value of the
     * property and returns them as a single object keyed by the property name.
     */
    public get properties() {
        return this._propertyDefinitions.reduce<ILoader['properties']>(
            (final, p) => {
                final[p.name] = {
                    ...p,
                    value: this._properties[p.name],
                };

                return final;
            },
            {},
        );
    }

    /**
     * Sets the value of the given property.  If the property is not found for the loader, an error is thrown.
     * If the value type is not valid for the property then a different error is thrown.
     *
     * @param name
     * @param value
     */
    public set(name: string, value: PropertyValue) {
        const def = this._propertyDefinitions.find(p => p.name === name);
        if (!def) {
            throw new Error(`Property ${name} invalid`);
        }

        if (def.type === 'array' && !Array.isArray(value)) {
            throw new Error(`Property ${name} must be an array`);
        }

        if (def.type === 'string' && typeof value !== 'string') {
            throw new Error(`Property ${name} must be a string`);
        }

        if (def.type === 'number' && typeof value !== 'number') {
            throw new Error(`Property ${name} must be a number`);
        }

        if (def.type === 'boolean' && typeof value !== 'boolean') {
            throw new Error(`Property ${name} must be a boolean`);
        }

        if (def.type === 'function' && typeof value !== 'function') {
            throw new Error(`Property ${name} must be a function`);
        }

        this._properties[name] = value;
    }

    /**
     * Returns the value of the given property.  If the property is not valid for the loader, an error is thrown.
     * @param name
     * @returns
     */
    public get(name: string): PropertyValue | undefined {
        const def = this._propertyDefinitions.find(p => p.name === name);
        if (!def) {
            throw new Error(`Property ${name} invalid`);
        }

        return this._properties[name];
    }

    /**
     * Returns the value of the given property as a string.  If the property is not valid for the loader, an error is thrown.
     * @param name
     * @returns
     */
    public getString(name: string): string | undefined {
        const val = this.get(name);
        return val?.toString();
    }
}
