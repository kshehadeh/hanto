import { z } from 'zod';
import { type NodeHandler } from '..';
import { type CompilerFormat } from '../base';
import type { AnsieNode } from '../types';

//// Break Node - This is a node that represents a line break

export const BreakNodeSchema = z.object({
    node: z.literal('break'),
});

export type BreakNode = z.infer<typeof BreakNodeSchema>;

export const BreakNodeHandler: NodeHandler<BreakNode> = {
    handleEnter(node: BreakNode, stack: AnsieNode[], format: CompilerFormat = 'ansi') {
        if (format === 'ansi') {
            return '\n';
        } else if (format === 'markup') {
            return '<br/>';
        }
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleExit(node: BreakNode, stack: AnsieNode[], format: CompilerFormat = 'ansi') {
        return '';
    },

    isType(node: unknown): node is BreakNode {
        return (node as BreakNode).node === 'break';
    },

    schema: BreakNodeSchema,
};
