import { z } from "zod";

export const BaseNodeSchema = z.object({
    node: z.string()
})

export type BaseNode = z.infer<typeof BaseNodeSchema>;

export class CompilerError implements Error {
    name: string = 'CompilerError';
    message: string;
    fatal: boolean;

    markupNode: BaseNode;
    markupStack: BaseNode[];

    constructor(message: string, markupNode: BaseNode, markupStack: BaseNode[], fatal: boolean = false) {
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