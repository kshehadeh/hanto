import { z } from "zod";
import { type NodeHandler } from "..";
import type { BaseNodeSchema } from "../types";
import { EscapeCodeFromName } from "../utilities/escape-code-from-name";

export const UnderlineNodeSchema = z.object({
    node: z.literal('underline'),
    type: z.union([
        z.literal('single'),
        z.literal('double'),
    ])
})

export const UnderlineNodeHandler: NodeHandler<z.infer<typeof UnderlineNodeSchema>> = {
    handleEnter(node: z.infer<typeof UnderlineNodeSchema>, stack: z.infer<typeof BaseNodeSchema>[]) {
        if (node.type === 'single') {
            return EscapeCodeFromName('underline');
        } else {
            return EscapeCodeFromName('double');
        }
    },

    handleExit(node: z.infer<typeof UnderlineNodeSchema>, stack: z.infer<typeof BaseNodeSchema>[]) {
        return EscapeCodeFromName('underlineOff');
    },

    isType(node: z.infer<typeof BaseNodeSchema>): node is z.infer<typeof UnderlineNodeSchema> {
        return node.node === 'underline';
    },

    schema: UnderlineNodeSchema,
};
