import { CompilerError, type CompilerFormat } from '../base';
import { getTextEscapeCodesFromProperties } from '../utilities/get-text-escape-codes-from-properties';
import type { NodeHandler } from '..';
import { getSpacingFromProperties } from '../utilities/get-spacing-from-properties';
import {
    type AnsieNode,
    type H1Node,
    type H2Node,
    type H3Node,
    type BodyNode,
    type SpanNode,
    type ParagraphNode,
    type DivNode,
    type SpaceNode,
    isAttribute
} from '../types';

//// ATTRIBUTE SETS - We organize attributes into types for ease of use and to restrict certain tags to only have certain attributes
/////////

/**
 * This will build the beginning of a node as rendered to the target compiler format (ansi or markup)
 * @param node
 * @param format
 * @returns
 */
function buildStart(
    node: AnsieNode,
    stack: AnsieNode[],
    format: CompilerFormat,
) {
    if (format === 'ansi') {
        return `${renderSpaceAttributesStart(node, format)}${renderTextAttributesStart(node, format)}`;
    } else if (format === 'markup') {
        const attribs = Object.entries(node)
            .filter(([key]) => isAttribute(key))
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');

        return `<${node.node}${attribs ? ` ${attribs}` : ''}>`;
    }

    throw new CompilerError(`Invalid format: ${format}`, node, stack, false);
}

/**
 * This will build the ending of a node as rendered to the target compiler format (ansi or markup)
 * @param node
 * @param format
 * @returns
 */
function buildEnd(node: AnsieNode, stack: AnsieNode[], format: CompilerFormat) {
    if (format === 'ansi') {
        return `${renderTextAttributesEnd(node, format)}${renderSpaceAttributesEnd(node, format)}`;
    } else if (format === 'markup') {
        return `</${node.node}>`;
    }

    throw new CompilerError(`Invalid format: ${format}`, node, stack, false);
}

/**
 * Renders the space attributes for a node prepending the appropriate spacing escape codes.
 * @param attributes
 * @param format
 * @returns
 */
function renderSpaceAttributesStart(
    node: SpaceNode,
    format: CompilerFormat = 'ansi',
) {
    if (format === 'ansi') {
        return getSpacingFromProperties(node).on;
    } else if (format === 'markup') {
        return Object.entries(node)
            .filter(([key]) => isAttribute(key))
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');
    }
}

/**
 * Renders the space attributes for a node appending the appropriate spacing escape codes.
 * @param attributes
 * @param format
 * @returns
 */
function renderSpaceAttributesEnd(
    attributes: AnsieNode,
    format: CompilerFormat = 'ansi',
) {
    if (format === 'ansi') {
        return getSpacingFromProperties(attributes).off;
    } else if (format === 'markup') {
        return '';
    }
}

/**
 * Renders the text attributes for a node prepending the appropriate text escape codes.
 * @param attributes
 * @param format
 * @returns
 */
function renderTextAttributesStart(
    attributes: AnsieNode,
    format: CompilerFormat = 'ansi',
) {
    if (format === 'ansi') {
        return getTextEscapeCodesFromProperties(attributes).on;
    } else if (format === 'markup') {
        return Object.entries(attributes)
            .filter(([key]) => isAttribute(key))
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');
    }
}

/**
 * Renders the text attributes for a node appending the appropriate text escape codes.
 * @param attributes
 * @param format
 * @returns
 */
function renderTextAttributesEnd(
    attributes: AnsieNode,
    format: CompilerFormat = 'ansi',
) {
    if (format === 'ansi') {
        return getTextEscapeCodesFromProperties(attributes).off;
    } else if (format === 'markup') {
        return '';
    }
}

/**
 * Builds a node handler for a node setting the schema and the isType function.
 * @param tagName
 * @param schema
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildFormattedTextHandler<T extends AnsieNode>(
    tagName: string,
) {
    return {
        handleEnter: () => {
            throw new Error('Not implemented');
        },
        handleExit: () => {
            throw new Error('Not implemented');
        },
        isType: (node: unknown): node is T =>
            (node as AnsieNode).node === tagName,
    } satisfies NodeHandler<T>;
}

////// Node Handlers - These are the handlers for the various semantic elements that can be used in the markup

////// H1 Node - This is the handler for the <h1> element
export const H1NodeHandler: NodeHandler<H1Node> = {
    ...buildFormattedTextHandler<H1Node>('h1'),
    handleEnter: (
        node: H1Node,
        stack: AnsieNode[],
        format: CompilerFormat = 'ansi',
    ) => buildStart(node, stack, format),
    handleExit: (
        node: H1Node,
        stack: AnsieNode[],
        format: CompilerFormat = 'ansi',
    ) => buildEnd(node, stack, format),
};

////// H2 Node - This is the handler for the <h2> element
export const H2NodeHandler: NodeHandler<H2Node> = {
    ...buildFormattedTextHandler<H2Node>('h2'),
    handleEnter: (
        node: H2Node,
        stack: AnsieNode[],
        format: CompilerFormat = 'ansi',
    ) => buildStart(node, stack, format),
    handleExit: (
        node: H2Node,
        stack: AnsieNode[],
        format: CompilerFormat = 'ansi',
    ) => buildEnd(node, stack, format),
};

////// H3 Node - This is the handler for the <h3> element
export const H3NodeHandler: NodeHandler<H3Node> = {
    ...buildFormattedTextHandler<H3Node>('h3'),
    handleEnter: (
        node: H3Node,
        stack: AnsieNode[],
        format: CompilerFormat = 'ansi',
    ) => buildStart(node, stack, format),
    handleExit: (
        node: H3Node,
        stack: AnsieNode[],
        format: CompilerFormat = 'ansi',
    ) => buildEnd(node, stack, format),
};

////// Body Node - This is the handler for the <body> element
export const BodyNodeHandler: NodeHandler<BodyNode> = {
    ...buildFormattedTextHandler<BodyNode>('body'),
    handleEnter: (
        node: BodyNode,
        stack: AnsieNode[],
        format: CompilerFormat = 'ansi',
    ) => buildStart(node, stack, format),
    handleExit: (
        node: BodyNode,
        stack: AnsieNode[],
        format: CompilerFormat = 'ansi',
    ) => buildEnd(node, stack, format),
};

////// Span Node - This is the handler for the <span> element which does not have any semantic meaning but is used for altering the formatting of text
export const SpanNodeHandler: NodeHandler<SpanNode> = {
    ...buildFormattedTextHandler<SpanNode>('span'),
    handleEnter: (
        node: SpanNode,
        stack: AnsieNode[],
        format: CompilerFormat = 'ansi',
    ) => buildStart(node, stack, format),
    handleExit: (
        node: SpanNode,
        stack: AnsieNode[],
        format: CompilerFormat = 'ansi',
    ) => buildEnd(node, stack, format),
};

////// P Node - This is the handler for the <p> element which is used for paragraph separation
export const ParagraphNodeHandler: NodeHandler<ParagraphNode> = {
    ...buildFormattedTextHandler<ParagraphNode>('p'),
    handleEnter: (
        node: ParagraphNode,
        stack: AnsieNode[],
        format: CompilerFormat = 'ansi',
    ) => buildStart(node, stack, format),
    handleExit: (
        node: ParagraphNode,
        stack: AnsieNode[],
        format: CompilerFormat = 'ansi',
    ) => buildEnd(node, stack, format),
};

////// Div Node - This is the handler for the <div> element which is used for grouping content
export const DivNodeHandler: NodeHandler<DivNode> = {
    ...buildFormattedTextHandler<DivNode>('div'),
    handleEnter: (
        node: DivNode,
        stack: AnsieNode[],
        format: CompilerFormat = 'ansi',
    ) => buildStart(node, stack, format),
    handleExit: (
        node: DivNode,
        stack: AnsieNode[],
        format: CompilerFormat = 'ansi',
    ) => buildEnd(node, stack, format),
};

export const _testableFunctions = {
    buildStart,
    buildEnd,
    renderSpaceAttributesStart,
    renderSpaceAttributesEnd,
    renderTextAttributesStart,
    renderTextAttributesEnd,
};
