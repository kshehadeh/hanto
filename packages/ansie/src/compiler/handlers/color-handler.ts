import { z } from 'zod';
import { type NodeHandler } from '..';
import { getLastNodeOfTypeFromStack } from '../utilities/get-last-node-of-type-in-stack';
import { escapeCodeFromName } from '../utilities/escape-code-from-name';
import { toTitleCase } from '../utilities/to-title-case';
import { CompilerError, type BaseNode } from '../base';
import { condStr } from '../../util';
import { type CompilerFormat } from '../base';

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
    handleEnter(
        node: ColorNode,
        stack: BaseNode[],
        format?: 'ansi' | 'markup',
    ) {
        if (format === 'markup') {
            return `<color ${condStr(!!node.fg, `fg="${node.fg}"`)} ${condStr(
                !!node.bg,
                `fg="${node.bg}"`,
            )}>`;
        } else if (format === 'ansi'){
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
        }
    },

    handleExit(node: ColorNode, stack: BaseNode[], format: CompilerFormat = 'ansi') {
        if (format === 'markup') {
            return '</color>';
        } else if (format === 'ansi') {
            let result = '';
            const nodeRaw = getLastNodeOfTypeFromStack('color', stack)
            const lastColorNode = nodeRaw ? ColorNodeSchema.safeParse(nodeRaw) : undefined;
            if (lastColorNode?.success) {
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
                        format,
                    );
                }
            } else {
                result = escapeCodeFromName(['fgDefault', 'bgDefault']);
            }
    
            return result;
            }
    },

    isType(node: unknown): node is ColorNode {
        return (node as ColorNode).node === 'color';
    },

    tagName: 'color',

    selfTerminated: false,

    attributes: [
        {
            name: 'fg',
            type: 'string',
            required: false,
        },
        {
            name: 'bg',
            type: 'string',
            required: false,
        },
    ],

    schema: ColorNodeSchema,
};
