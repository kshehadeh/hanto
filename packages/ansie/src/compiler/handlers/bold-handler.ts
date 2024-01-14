import { z } from 'zod';
import { type NodeHandler } from '..';
import { escapeCodeFromName } from '../utilities/escape-code-from-name';
import { type CompilerFormat } from '../base';

export const BoldNodeSchema = z.object({
    node: z.literal('bold'),
});

export type BoldNode = z.infer<typeof BoldNodeSchema>;

export const BoldNodeHandler: NodeHandler<z.infer<typeof BoldNodeSchema>> = {
    handleEnter(node: z.infer<typeof BoldNodeSchema>, stack: BoldNode[], format: CompilerFormat = 'ansi') {
        if (format === 'ansi') {
            return escapeCodeFromName('bold')
        } else if (format === 'markup') {
            return '<bold>'
        }
    },

    handleExit(node: z.infer<typeof BoldNodeSchema>, stack: BoldNode[], format: CompilerFormat = 'ansi') {
        if (format === 'ansi') {
            return escapeCodeFromName('boldOff');
        } else if (format === 'markup') {
            return '</bold>'
        }
    },

    isType(node: unknown): node is z.infer<typeof BoldNodeSchema> {
        return (node as BoldNode).node === 'bold';
    },

    tagName: 'bold',

    attributes: [],

    schema: BoldNodeSchema,
};
