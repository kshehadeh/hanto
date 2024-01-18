import { z } from 'zod';
import type { AnsieNode } from './types';

export const BaseNodeSchema = z.object({
    node: z.string(),
});

/**
 * Represents a compiler error.
 */
export class CompilerError implements Error {
    name: string = 'CompilerError';
    message: string;
    fatal: boolean;

    markupNode: AnsieNode;
    markupStack: AnsieNode[];

    /**
     * Creates a new instance of CompilerError.
     * @param message The error message.
     * @param markupNode The markup node associated with the error.
     * @param markupStack The stack of markup nodes leading to the error.
     * @param fatal Indicates whether the error is fatal or not. Default is false.
     */
    constructor(
        message: string,
        markupNode: AnsieNode,
        markupStack: AnsieNode[],
        fatal: boolean = false,
    ) {
        this.message = message;
        this.markupNode = markupNode;
        this.markupStack = markupStack;
        this.fatal = fatal;
    }

    /**
     * Returns a string representation of the CompilerError.
     * @returns The string representation of the CompilerError.
     */
    toString() {
        return `${this.name}: ${this.message} (${this.markupNode.node}, ${this.markupStack.map(node => node.node).join(', ')})`;
    }

    /**
     * Determines whether the error can be continued or not.
     * @returns True if the error can be continued, false otherwise.
     */
    continue() {
        return !this.fatal;
    }
}
export type CompilerFormat = 'ansi' | 'markup';

