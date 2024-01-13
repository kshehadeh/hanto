import { z } from 'zod';
import { type NodeHandler } from '..';
import { escapeCodeFromName } from '../utilities/escape-code-from-name';
import type { BaseNode } from '../base';

export const ItalicsNodeSchema = z.object({
    node: z.literal('italics'),
});

export type ItalicsNode = z.infer<typeof ItalicsNodeSchema>;

export const ItalicsNodeHandler: NodeHandler<ItalicsNode> = {
    handleEnter(node: z.infer<typeof ItalicsNodeSchema>, stack: BaseNode[]) {
        return escapeCodeFromName('italic');
    },

    handleExit(node: ItalicsNode, stack: BaseNode[]) {
        return escapeCodeFromName('italicOff');
    },

    isType(node: unknown): node is ItalicsNode {
        return (node as ItalicsNode).node === 'italics';
    },

    schema: ItalicsNodeSchema,
};
