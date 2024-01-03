import {
    Issue,
    PropertyDefinition,
    PropertyMap,
    PropertyValue,
} from '@/interfaces';
import orchestrator from './orchestrator';

/**
 * The loader abstarct class is implemented by plugins to provide additional
 * functionality for specific types of projects.  For example, the typescript
 * loader is a plugin that knows how to load typescript projects.
 *
 * The loader is responsible for processing all of the files that are part of the
 * project and making metadata about those files available to the rest of the system.
 */
export abstract class Loader {
    protected _projectId: string;
    protected _valid: boolean;
    protected _errors: Issue[];
    protected _warnings: Issue[];
    protected _properties: Record<string, PropertyValue>;
    protected _propertyDefinitions: PropertyDefinition[];

    public constructor(propertyDefinitions: PropertyDefinition[]) {
        this._projectId = '';
        this._valid = false;
        this._errors = [];
        this._warnings = [];
        this._properties = {};
        this._propertyDefinitions = propertyDefinitions;
    }

    public initialize(projectId: string): boolean {
        this._projectId = projectId;
        return true;
    }

    abstract get name(): string;
    abstract get description(): string;
    abstract load(): Promise<boolean>;

    public get project() {
        return orchestrator.project(this._projectId);
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
    public get properties(): PropertyMap {
        return this._propertyDefinitions.reduce<PropertyMap>((final, p) => {
            final[p.name] = {
                ...p,
                value: this._properties[p.name],
            };

            return final;
        }, {});
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

        if (def.valueSchema && typeof value !== 'function') {
            const parseResult = def.valueSchema.safeParse(value)
            if (!parseResult.success) {
                throw new Error(`Property ${name} has an invalid type: ${parseResult.error.issues.map(i => i.message).join(', ')}`);
            }
        }

        this._properties[name] = value;
    }

    /**
     * Returns the value of the given property as a string.  If the property is not valid for the loader, an error is thrown.
     * @param name
     * @returns
     */
    public str(name: string): string | undefined {
        const val = this.prop(name)?.value;
        return val?.toString();
    }

    /**
     * Returns the value of the given property as a number.  If the property is not valid for the loader, an error is thrown.
     * @param name
     * @returns
     */
    public num(name: string): number | undefined {
        const val = this.prop(name)?.value;
        if (typeof val === 'number') {
            return val;
        }
    }

    public prop(name: string) {
        const p = this._propertyDefinitions.find(p => p.name === name);

        if (p) {
            return {
                ...p,
                value: this._properties[p.name],
            };
        }

        return undefined;
    }

    /**
     * Calls the given property as a function.  If the property is not valid for the loader, an error is thrown.
     * @param name
     * @param args
     * @returns
     */
    public call<T = Record<string, unknown>>(
        name: string,
        options: T,
    ): PropertyValue | undefined {
        const prop = this.prop(name);
        if (typeof prop?.value === 'function') {
            const optionsParsed = prop.optionsSchema?.safeParse(options);
            if (optionsParsed?.success) {
                const val = prop?.value(optionsParsed.data);
                if (prop.valueSchema) {
                    const parseResult = prop.valueSchema.safeParse(val);
                    if (!parseResult.success) {
                        throw new Error(`Function ${name} returned an invalid type: ${parseResult.error.issues.map(i => i.message).join(', ')}`);
                    }
                }
                return val
            } else {
                throw new Error(`Invalid options given to call function ${name}`)
            }
        } else {
            throw new Error(`Property ${name} is not a function or doesn't exist`);
        }
    }
}
