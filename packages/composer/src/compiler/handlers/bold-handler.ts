import { z } from "zod";
import { type NodeHandler } from "..";
import type { BaseNodeSchema } from "../types";
import { EscapeCodeFromName } from "../utilities/escape-code-from-name";

export const BoldNodeSchema = z.object({
    node: z.literal('bold'),
})

export const BoldNodeHandler: NodeHandler<z.infer<typeof BoldNodeSchema>> = {
    handleEnter(node: z.infer<typeof BoldNodeSchema>, stack: z.infer<typeof BaseNodeSchema>[]) {
        return EscapeCodeFromName('bold');
    },

    handleExit(node: z.infer<typeof BoldNodeSchema>, stack: z.infer<typeof BaseNodeSchema>[]) {
        return EscapeCodeFromName('boldOff');
    },

    isType(node: z.infer<typeof BaseNodeSchema>): node is z.infer<typeof BoldNodeSchema> {
        return node.node === 'bold';
    },

    schema: BoldNodeSchema,
};
