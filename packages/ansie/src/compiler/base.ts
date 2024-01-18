import { z } from 'zod';
import type { AnsieNode } from './types';

export const BaseNodeSchema = z.object({
    node: z.string(),
});

export class CompilerError implements Error {
    name: string = 'CompilerError';
    message: string;
    fatal: boolean;

    markupNode: AnsieNode;
    markupStack: AnsieNode[];

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

    toString() {
        return `${this.name}: ${this.message} (${this.markupNode.node}, ${this.markupStack.map(node => node.node).join(', ')})`;
    }

    continue() {
        return !this.fatal;
    }
}
export type CompilerFormat = 'ansi' | 'markup';

