import { z } from "zod";
import { type NodeHandler } from "..";
import type { BaseNodeSchema } from "../types";

export const BreakNodeSchema = z.object({
    node: z.literal('break'),
})

export const BreakNodeHandler: NodeHandler<z.infer<typeof BreakNodeSchema>> = {
    handleEnter(node: z.infer<typeof BreakNodeSchema>, stack: z.infer<typeof BaseNodeSchema>[]) {
        return '\n'
    },

    handleExit(node: z.infer<typeof BreakNodeSchema>, stack: z.infer<typeof BaseNodeSchema>[]) {
        return ''
    },

    isType(node: z.infer<typeof BaseNodeSchema>): node is z.infer<typeof BreakNodeSchema> {
        return node.node === 'break';
    },

    schema: BreakNodeSchema,
};
