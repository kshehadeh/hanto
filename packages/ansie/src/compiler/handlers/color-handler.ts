import { z } from 'zod';
import { type NodeHandler } from '..';
import { getLastNodeOfTypeFromStack } from '../utilities/get-last-node-of-type-in-stack';
import { escapeCodeFromName } from '../utilities/escape-code-from-name';
import { toTitleCase } from '../utilities/to-title-case';
import { CompilerError, type BaseNode } from '../base';

export const ColorNodeSchema = z.object({
    node: z.literal('color'),
    fg: z.string().optional(),
    bg: z.string().optional(),
});

export type ColorNode = z.infer<typeof ColorNodeSchema>;

function getColorEscapeCodeName(color: string, type: 'fg' | 'bg') {
    return `${type}${toTitleCase(color)}`;
}

export const ColorNodeHandler: NodeHandler<ColorNode> = {
    handleEnter(node: ColorNode, stack: BaseNode[]) {
        const fgColor = node.fg
            ? getColorEscapeCodeName(node.fg, 'fg')
            : undefined;
        const bgColor = node.bg
            ? getColorEscapeCodeName(node.bg, 'bg')
            : undefined;

        if (!fgColor && !bgColor) {
            throw new CompilerError(
                'Color node must have at least one color',
                node,
                stack,
            );
        }

        return escapeCodeFromName([fgColor, bgColor]);
    },

    handleExit(node: ColorNode, stack: BaseNode[]) {
        let result = '';
        const lastColorNode = ColorNodeSchema.safeParse(
            getLastNodeOfTypeFromStack('color', stack),
        );
        if (lastColorNode.success) {
            if (lastColorNode.data.fg && lastColorNode.data.bg) {
                result = escapeCodeFromName([
                    getColorEscapeCodeName(lastColorNode.data.fg, 'fg'),
                    getColorEscapeCodeName(lastColorNode.data.fg, 'bg'),
                ]);
            } else if (lastColorNode.data.fg) {
                result = escapeCodeFromName([
                    'bgDefault',
                    getColorEscapeCodeName(lastColorNode.data.fg, 'fg'),
                ]);
            } else if (lastColorNode.data.bg) {
                result = escapeCodeFromName([
                    'fgDefault',
                    getColorEscapeCodeName(lastColorNode.data.fg, 'bg'),
                ]);
            } else {
                result = ColorNodeHandler.handleEnter(
                    lastColorNode.data,
                    stack,
                );
            }
        } else {
            result = escapeCodeFromName(['fgDefault', 'bgDefault']);
        }

        return result;
    },

    isType(node: unknown): node is ColorNode {
        return (node as ColorNode).node === 'color';
    },

    schema: ColorNodeSchema,
};
