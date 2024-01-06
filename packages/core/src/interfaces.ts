import { ZodSchema } from 'zod';

export interface Issue {
    message: string;
    path?: (string | number)[];
    lineStart?: number;
    lineEnd?: number;
    columnStart?: number;
    columnEnd?: number;
}

export type PropertyFunction<T = unknown> = (...args: T[]) => PropertyValue;

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
    valueSchema?: ZodSchema;
    optionsSchema?: ZodSchema;
}

export type PropertyMap = Record<string, Property>;

export type Property = PropertyDefinition & { value: PropertyValue };
