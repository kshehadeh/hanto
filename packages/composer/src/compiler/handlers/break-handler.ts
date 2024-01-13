import { z } from "zod";
import { type NodeHandler } from "..";

export const BreakNodeSchema = z.object({
    node: z.literal('break'),
})

export type BreakNode = z.infer<typeof BreakNodeSchema>;

export const BreakNodeHandler: NodeHandler<BreakNode> = {
    handleEnter(node: BreakNode, stack: BreakNode[]) {
        return '\n'
    },

    handleExit(node: BreakNode, stack: BreakNode[]) {
        return ''
    },

    isType(node: unknown): node is BreakNode {
        return (node as BreakNode).node === 'break';
    },

    schema: BreakNodeSchema,
};
