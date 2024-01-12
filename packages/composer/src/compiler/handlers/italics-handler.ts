import { z } from "zod";
import { BaseNodeSchema } from "../types";
import { type NodeHandler } from "..";
import { EscapeCodeFromName } from "../utilities/escape-code-from-name";


export const ItalicsNodeSchema = z.object({
    node: z.literal('italics'),
})

export const ItalicsNodeHandler: NodeHandler<z.infer<typeof ItalicsNodeSchema>> = {
    handleEnter(node: z.infer<typeof ItalicsNodeSchema>, stack: z.infer<typeof BaseNodeSchema>[]) {
        return EscapeCodeFromName('italic');
    },

    handleExit(node: z.infer<typeof ItalicsNodeSchema>, stack: z.infer<typeof BaseNodeSchema>[]) {
        return EscapeCodeFromName('italicOff');
    },

    isType(node: z.infer<typeof BaseNodeSchema>): node is z.infer<typeof ItalicsNodeSchema> {
        return node.node === 'italics';
    },

    schema: ItalicsNodeSchema,
};
