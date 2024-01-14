import { z } from 'zod';
import { type NodeHandler } from '..';
import { escapeCodeFromName } from '../utilities/escape-code-from-name';
import type { BaseNode } from '../base';
import { type CompilerFormat } from '../base';

export const ItalicsNodeSchema = z.object({
    node: z.literal('italics'),
});

export type ItalicsNode = z.infer<typeof ItalicsNodeSchema>;

export const ItalicsNodeHandler: NodeHandler<ItalicsNode> = {
    handleEnter(node: z.infer<typeof ItalicsNodeSchema>, stack: BaseNode[], format: CompilerFormat = 'ansi') {
        if (format === 'markup') {
            return '<italics>';
        } else if (format === 'ansi') {
            return escapeCodeFromName('italic');
        }        
    },

    handleExit(node: ItalicsNode, stack: BaseNode[], format: CompilerFormat = 'ansi') {
        if (format === 'markup') {
            return '</italics>';
        } else if (format === 'ansi') {
            return escapeCodeFromName('italicOff');
        }
    },

    isType(node: unknown): node is ItalicsNode {
        return (node as ItalicsNode).node === 'italics';
    },

    tagName: 'italics',

    selfTerminated: false,

    attributes: [],

    schema: ItalicsNodeSchema,
};
