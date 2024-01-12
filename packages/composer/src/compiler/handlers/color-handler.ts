import { z } from "zod";
import { type NodeHandler } from "..";
import { getLastNodeOfTypeFromStack } from "../utilities/get-last-node-of-type-in-stack";
import { BaseNodeSchema } from "../types";
import { EscapeCodeFromName } from "../utilities/escape-code-from-name";

export const ColorNodeSchema = BaseNodeSchema.extend({
    node: z.literal('color'),
    name: z.string()
})

export const ColorNodeHandler: NodeHandler<z.infer<typeof ColorNodeSchema>> = {
    handleEnter(node: z.infer<typeof ColorNodeSchema>, stack: z.infer<typeof BaseNodeSchema>[]) {
        switch (node.name) {
            case 'red': return EscapeCodeFromName('fgRed');
            case 'green': return EscapeCodeFromName('fgGreen');
            case 'blue': return EscapeCodeFromName('fgBlue');
            case 'yellow': return EscapeCodeFromName('fgYellow');
            case 'magenta': return EscapeCodeFromName('fgMagenta');
            case 'cyan': return EscapeCodeFromName('fgCyan');
            case 'white': return EscapeCodeFromName('fgWhite');
            case 'black': return EscapeCodeFromName('fgBlack');
            case 'gray': return EscapeCodeFromName('fgGray');

            default: return '';
        }
    },

    handleExit(node: z.infer<typeof ColorNodeSchema>, stack: z.infer<typeof BaseNodeSchema>[]) {
        const lastColorNode = getLastNodeOfTypeFromStack<'color'>('color', stack);
        if (lastColorNode) {
            return ColorNodeHandler.handleEnter(lastColorNode, stack);
        } else {
            return EscapeCodeFromName('fgDefault');
        }
    },

    isType(node: z.infer<typeof BaseNodeSchema>): node is z.infer<typeof ColorNodeSchema> {
        return node.node === 'color';
    },
    
    schema: ColorNodeSchema,
};
