import { z } from 'zod';
import { type NodeHandler } from '..';
import type { BaseNode } from '../base';
import { escapeCodeFromName } from '../utilities/escape-code-from-name';
import { condStr } from '../../util';
import { type CompilerFormat } from '../base';

export const UnderlineNodeSchema = z.object({
    node: z.literal('underline'),
    type: z.union([z.literal('single'), z.literal('double')]),
});

export type UnderlineNode = z.infer<typeof UnderlineNodeSchema>;

export const UnderlineNodeHandler: NodeHandler<UnderlineNode> = {
    handleEnter(node: UnderlineNode, stack: BaseNode[], format: CompilerFormat = 'ansi') {
        if (format === 'markup') {
            return `<underline ${condStr(!!node.type, `type="${node.type}"`)}>`;
        } else if (format === 'ansi') {
            if (node.type === 'single') {
                return escapeCodeFromName('underline');
            } else {
                return escapeCodeFromName('doubleunderline');
            }
            }
    },

    handleExit(node: UnderlineNode, stack: BaseNode[], format: CompilerFormat = 'ansi') {
        if (format === 'markup') {
            return '</underline>';
        } else {
            return escapeCodeFromName('underlineOff');
        }
    },

    isType(node: unknown): node is UnderlineNode {
        return (node as UnderlineNode).node === 'underline';
    },

    tagName: 'underline',

    selfTerminated: false,

    attributes: [
        {
            name: 'type',
            type: 'enum',
            required: true,
            values: ['single', 'double'],
        },
    ],

    schema: UnderlineNodeSchema,
};
