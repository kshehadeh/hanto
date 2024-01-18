import { z } from "zod";
import type { CompilerFormat } from "../base";
import { getTextEscapeCodesFromProperties } from "../utilities/get-text-escape-codes-from-properties";
import type { NodeHandler } from "..";
import { getSpacingFromProperties } from "../utilities/get-spacing-from-properties";
import type { AnsieNode } from "../types";

//// ATTRIBUTE SETS - We organize attributes into types for ease of use and to restrict certain tags to only have certain attributes
/////////

////// Space Attributes - These are the attributes that can be associated with semantic elements that have a concept of spacing such as <div> and <p>
export const spaceAttributesSchema = z.object({
    margin: z.number().optional(),
    marginTop: z.number().optional(),
    marginBottom: z.number().optional(),
    marginLeft: z.number().optional(),
    marginRight: z.number().optional(),
});
export type SpaceAttributes = z.infer<typeof spaceAttributesSchema>;

///// Text Attributes - These are the attributes that can be associated with text-based semantic elements such as <span> and <p>
export const textAttributesSchema = z.object({    
    fg: z.string().optional(),
    bg: z.string().optional(),
    bold: z.boolean().optional(),
    underline: z.union([z.boolean(), z.enum(['single', 'double', 'none']).optional()]),
    italics: z.boolean().optional(),
});
export type TextAttributes = z.infer<typeof textAttributesSchema>;

// NOTE: Add new attribute sets here
const AvailableAttributes = Object.keys({
    ...spaceAttributesSchema.shape,
    ...textAttributesSchema.shape
})


/**
 * This will build the beginning of a node as rendered to the target compiler format (ansi or markup)
 * @param node 
 * @param format 
 * @returns 
 */
function buildStart(node: Record<string, unknown>, format: CompilerFormat) {
    if (format === 'ansi') {
        return `${renderSpaceAttributesStart(node, format)}${renderTextAttributesStart(node, format)}`
    } else if (format === 'markup') {
        const attribs = Object.entries(node)
            .filter(([key]) => AvailableAttributes.includes(key))
            .map(([key, value]) => `${key}="${value}"`).join(' ')

        return `<${node.node}${attribs ? ` ${attribs}` : ''}>`
    }
}

/**
 * This will build the ending of a node as rendered to the target compiler format (ansi or markup)
 * @param node 
 * @param format 
 * @returns 
 */
function buildEnd(node: Record<string, unknown>, format: CompilerFormat) {
    if (format === 'ansi') {
        return `${renderTextAttributesEnd(node, format)}${renderSpaceAttributesEnd(node, format)}`
    } else if (format === 'markup') {
        return `</${node.node}>`
    }
}

/**
 * Renders the space attributes for a node prepending the appropriate spacing escape codes.
 * @param attributes 
 * @param format 
 * @returns 
 */
function renderSpaceAttributesStart(attributes: SpaceAttributes, format: CompilerFormat = 'ansi') {
    if (format === 'ansi') {
        return getSpacingFromProperties(attributes).on
    } else if (format === 'markup') {
        return Object.entries(attributes).map(([key, value]) => `${key}="${value}"`).join(' ')
    }
}

/**
 * Renders the space attributes for a node appending the appropriate spacing escape codes.
 * @param attributes 
 * @param format 
 * @returns 
 */
function renderSpaceAttributesEnd(attributes: SpaceAttributes, format: CompilerFormat = 'ansi') {
    if (format === 'ansi') {
        return getSpacingFromProperties(attributes).off
    } else if (format === 'markup') {
        return ''
    }
}

/**
 * Renders the text attributes for a node prepending the appropriate text escape codes.
 * @param attributes 
 * @param format 
 * @returns 
 */
function renderTextAttributesStart(attributes: TextAttributes, format: CompilerFormat = 'ansi') {
    if (format === 'ansi') {
        return getTextEscapeCodesFromProperties(attributes).on
    } else if (format === 'markup') {
        return Object.entries(attributes).map(([key, value]) => `${key}="${value}"`).join(' ')
    }
}

/**
 * Renders the text attributes for a node appending the appropriate text escape codes.
 * @param attributes 
 * @param format 
 * @returns 
 */
function renderTextAttributesEnd(attributes: TextAttributes, format: CompilerFormat = 'ansi') {
    if (format === 'ansi') {
        return getTextEscapeCodesFromProperties(attributes).off
    } else if (format === 'markup') {
        return ''
    }
}

/**
 * Builds a node handler for a node setting the schema and the isType function.
 * @param tagName 
 * @param schema 
 * @returns 
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildFormattedTextHandler<T extends TextAttributes|SpaceAttributes>(tagName: string, schema: z.ZodObject<any,any>) {
    return { 
        handleEnter: () => { throw new Error('Not implemented') },
        handleExit: () => { throw new Error('Not implemented') },
        isType: (node: unknown): node is T => (node as AnsieNode).node === tagName,    
        schema
    } satisfies NodeHandler<T>
}

////// Node Handlers - These are the handlers for the various semantic elements that can be used in the markup

////// H1 Node - This is the handler for the <h1> element
export const H1NodeSchema = z.object({node: z.literal('h1')}).merge(textAttributesSchema).merge(spaceAttributesSchema);

export type H1Node = z.infer<typeof H1NodeSchema>;
export const H1NodeHandler: NodeHandler<H1Node> = {
    ...buildFormattedTextHandler<H1Node>('h1', H1NodeSchema),
    handleEnter: (node: H1Node, stack: AnsieNode[], format: CompilerFormat = 'ansi') => buildStart(node, format),
    handleExit: (node: H1Node, stack: AnsieNode[], format: CompilerFormat = 'ansi') => buildEnd(node, format)
}

////// H2 Node - This is the handler for the <h2> element
export const H2NodeSchema = z.object({node: z.literal('h2')}).merge(textAttributesSchema).merge(spaceAttributesSchema);
export type H2Node = z.infer<typeof H2NodeSchema>;
export const H2NodeHandler: NodeHandler<H2Node> = {
    ...buildFormattedTextHandler<H2Node>('h2', H2NodeSchema),
    handleEnter: (node: H2Node, stack: AnsieNode[], format: CompilerFormat = 'ansi') => buildStart(node, format),
    handleExit: (node: H2Node, stack: AnsieNode[], format: CompilerFormat = 'ansi') => buildEnd(node, format)
}

////// H3 Node - This is the handler for the <h3> element
export const H3NodeSchema = z.object({node: z.literal('h3')}).merge(textAttributesSchema).merge(spaceAttributesSchema);
export type H3Node = z.infer<typeof H3NodeSchema>;
export const H3NodeHandler: NodeHandler<H3Node> = {
    ...buildFormattedTextHandler<H3Node>('h3', H3NodeSchema),
    handleEnter: (node: H3Node, stack: AnsieNode[], format: CompilerFormat = 'ansi') => buildStart(node, format),
    handleExit: (node: H3Node, stack: AnsieNode[], format: CompilerFormat = 'ansi') => buildEnd(node, format)
}

////// Body Node - This is the handler for the <body> element
export const BodyNodeSchema = z.object({node: z.literal('body')}).merge(textAttributesSchema).merge(spaceAttributesSchema);
export type BodyNode = z.infer<typeof BodyNodeSchema>;
export const BodyNodeHandler: NodeHandler<BodyNode> = {
    ...buildFormattedTextHandler<BodyNode>('body', BodyNodeSchema),
    handleEnter: (node: BodyNode, stack: AnsieNode[], format: CompilerFormat = 'ansi') => buildStart(node, format),
    handleExit: (node: BodyNode, stack: AnsieNode[], format: CompilerFormat = 'ansi') => buildEnd(node, format)
}

////// Span Node - This is the handler for the <span> element which does not have any semantic meaning but is used for altering the formatting of text
export const SpanNodeSchema = z.object({node: z.literal('span')}).merge(textAttributesSchema)
export type SpanNode = z.infer<typeof SpanNodeSchema>;
export const SpanNodeHandler: NodeHandler<SpanNode> = {
    ...buildFormattedTextHandler<SpanNode>('span', SpanNodeSchema),
    handleEnter: (node: SpanNode, stack: AnsieNode[], format: CompilerFormat = 'ansi') => buildStart(node, format),
    handleExit: (node: SpanNode, stack: AnsieNode[], format: CompilerFormat = 'ansi') => buildEnd(node, format)
}

////// P Node - This is the handler for the <p> element which is used for paragraph separation
export const ParagraphNodeSchema = z.object({node: z.literal('p')}).merge(textAttributesSchema).merge(spaceAttributesSchema);
export type ParagraphNode = z.infer<typeof ParagraphNodeSchema>;
export const ParagraphNodeHandler: NodeHandler<ParagraphNode> = {
    ...buildFormattedTextHandler<ParagraphNode>('p', ParagraphNodeSchema),
    handleEnter: (node: ParagraphNode, stack: AnsieNode[], format: CompilerFormat = 'ansi') => buildStart(node, format),
    handleExit: (node: ParagraphNode, stack: AnsieNode[], format: CompilerFormat = 'ansi') => buildEnd(node, format)
}

////// Div Node - This is the handler for the <div> element which is used for grouping content
export const DivNodeSchema = z.object({node: z.literal('div')}).merge(textAttributesSchema).merge(spaceAttributesSchema);
export type DivNode = z.infer<typeof DivNodeSchema>;
export const DivNodeHandler: NodeHandler<DivNode> = {
    ...buildFormattedTextHandler<DivNode>('div', DivNodeSchema),
    handleEnter: (node: DivNode, stack: AnsieNode[], format: CompilerFormat = 'ansi') => buildStart(node, format),
    handleExit: (node: DivNode, stack: AnsieNode[], format: CompilerFormat = 'ansi') => buildEnd(node, format)
}

export const _testableFunctions = {
    buildStart,
    buildEnd,
    renderSpaceAttributesStart,
    renderSpaceAttributesEnd,
    renderTextAttributesStart,
    renderTextAttributesEnd
}