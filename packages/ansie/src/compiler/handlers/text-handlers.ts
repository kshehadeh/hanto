import { z, type ZodLiteral } from "zod";
import type { BaseNode, CompilerFormat } from "../base";
import { getEscapeCodesFromProperties } from "../utilities/get-escape-code-from-properties";
import type { NodeHandler } from "..";

export function createTextSchema<T extends ZodLiteral<string>>(nodeType: T) {
    return z.object({
        node: nodeType,
    }).merge(textAttributesSchema);
}

export const textAttributesSchema = z.object({    
    fg: z.string().optional(),
    bg: z.string().optional(),
    bold: z.boolean().optional(),
    underline: z.union([z.boolean(), z.enum(['single', 'double', 'none']).optional()]),
    italics: z.boolean().optional(),
});

export type TextAttributes = z.infer<typeof textAttributesSchema>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildFormattedTextHandler<T extends TextAttributes>(tagName: string, schema: z.ZodObject<any,any>) {
    return { 
        handleEnter(node: T, stack: BaseNode[], format: CompilerFormat = 'ansi') {
            if (format === 'ansi') {
                return getEscapeCodesFromProperties(node).on
            } else if (format === 'markup') {
                return `<${tagName}>`
            }
        },
    
        handleExit(node: T, stack: BaseNode[], format: CompilerFormat = 'ansi') {
            if (format === 'ansi') {
                return getEscapeCodesFromProperties(node).off                
            } else if (format === 'markup') {
                return `</${tagName}>`
            }
        },
    
        isType(node: unknown): node is T {
            return (node as BaseNode).node === tagName;
        },
    
        schema
    } satisfies NodeHandler<T>    
}

export const H1NodeSchema = createTextSchema(z.literal('h1'))
export type H1Node = z.infer<typeof H1NodeSchema>;
export const H1NodeHandler: NodeHandler<H1Node> = buildFormattedTextHandler<H1Node>('h1', H1NodeSchema)

export const H2NodeSchema = createTextSchema(z.literal('h2'))
export type H2Node = z.infer<typeof H2NodeSchema>;
export const H2NodeHandler: NodeHandler<H2Node> = buildFormattedTextHandler<H2Node>('h2', H2NodeSchema)

export const H3NodeSchema = createTextSchema(z.literal('h3'))
export type H3Node = z.infer<typeof H3NodeSchema>;
export const H3NodeHandler: NodeHandler<H3Node> = buildFormattedTextHandler<H3Node>('h3', H3NodeSchema)

export const BodyNodeSchema = createTextSchema(z.literal('body'))
export type BodyNode = z.infer<typeof BodyNodeSchema>;
export const BodyNodeHandler: NodeHandler<BodyNode> = buildFormattedTextHandler<BodyNode>('body', BodyNodeSchema)