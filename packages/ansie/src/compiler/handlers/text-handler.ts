import { z } from 'zod';
import { type NodeHandler } from '..';
import { type BaseNode } from '../base';

export const TextNodeSchema = z.object({
    node: z.literal('text'),
    value: z.string(),
});

export type TextNode = z.infer<typeof TextNodeSchema>;

export const TextNodeHandler: NodeHandler<TextNode> = {
    handleEnter(node: z.infer<typeof TextNodeSchema>, stack: BaseNode[]) {
        return node.value;
    },

    handleExit(node: z.infer<typeof TextNodeSchema>, stack: BaseNode[]) {
        return '';
    },

    isType(node: unknown): node is z.infer<typeof TextNodeSchema> {
        return (node as TextNode).node === 'text';
    },

    schema: TextNodeSchema,
};
