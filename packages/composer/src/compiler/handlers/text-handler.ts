import { z } from "zod";
import { type NodeHandler } from "..";
import type { BaseNodeSchema } from "../types";

export const TextNodeSchema = z.object({
    node: z.literal('text'),
    value: z.string(),
})

export const TextNodeHandler: NodeHandler<z.infer<typeof TextNodeSchema>> = {
    handleEnter(node: z.infer<typeof TextNodeSchema>, stack: z.infer<typeof BaseNodeSchema>[]) {
        return node.value;
    },

    handleExit(node: z.infer<typeof TextNodeSchema>, stack: z.infer<typeof BaseNodeSchema>[]) {
        return '';
    },

    isType(node: z.infer<typeof BaseNodeSchema>): node is z.infer<typeof TextNodeSchema> {
        return node.node === 'text';
    },

    schema: TextNodeSchema,
};
