import { z } from 'zod';
import { type NodeHandler } from '..';
import { type CompilerFormat } from '../base';

export const BreakNodeSchema = z.object({
    node: z.literal('break'),
});

export type BreakNode = z.infer<typeof BreakNodeSchema>;

export const BreakNodeHandler: NodeHandler<BreakNode> = {
    handleEnter(node: BreakNode, stack: BreakNode[], format: CompilerFormat = 'ansi') {
        if (format === 'ansi') {
            return '\n';
        } else if (format === 'markup') {
            return '<br/>';
        }
    },

    handleExit(node: BreakNode, stack: BreakNode[], format: CompilerFormat = 'ansi') {
        return '';
    },

    isType(node: unknown): node is BreakNode {
        return (node as BreakNode).node === 'break';
    },

    tagName: 'br',

    selfTerminated: true,

    attributes: [],

    schema: BreakNodeSchema,
};
