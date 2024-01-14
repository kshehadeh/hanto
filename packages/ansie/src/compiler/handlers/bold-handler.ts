import { z } from 'zod';
import { type NodeHandler } from '..';
import { escapeCodeFromName } from '../utilities/escape-code-from-name';

export const BoldNodeSchema = z.object({
    node: z.literal('bold'),
});

export type BoldNode = z.infer<typeof BoldNodeSchema>;

export const BoldNodeHandler: NodeHandler<z.infer<typeof BoldNodeSchema>> = {
    handleEnter(node: z.infer<typeof BoldNodeSchema>, stack: BoldNode[]) {
        return escapeCodeFromName('bold');
    },

    handleExit(node: z.infer<typeof BoldNodeSchema>, stack: BoldNode[]) {
        return escapeCodeFromName('boldOff');
    },

    isType(node: unknown): node is z.infer<typeof BoldNodeSchema> {
        return (node as BoldNode).node === 'bold';
    },

    schema: BoldNodeSchema,
};
