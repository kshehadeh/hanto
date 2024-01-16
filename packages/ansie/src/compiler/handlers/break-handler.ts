import { z } from 'zod';
import { type NodeHandler } from '..';
import { type BaseNode } from '../base';
import { type CompilerFormat } from '../base';

export const BreakNodeSchema = z.object({
    node: z.literal('break'),
});

export type BreakNode = z.infer<typeof BreakNodeSchema>;

export const BreakNodeHandler: NodeHandler<BreakNode> = {
    handleEnter(node: BreakNode, stack: BaseNode[], format: CompilerFormat = 'ansi') {
        if (format === 'ansi') {
            return '\n';
        } else if (format === 'markup') {
            return '<br/>';
        }
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleExit(node: BreakNode, stack: BaseNode[], format: CompilerFormat = 'ansi') {
        return '';
    },

    isType(node: unknown): node is BreakNode {
        return (node as BreakNode).node === 'break';
    },

    schema: BreakNodeSchema,
};
