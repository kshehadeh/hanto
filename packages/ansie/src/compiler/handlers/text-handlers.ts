import { CompilerError, type CompilerFormat } from '../base';
import {
    type AnsieNode,
    type H1Node,
    type H2Node,
    type H3Node,
    type BodyNode,
    type SpanNode,
    type ParagraphNode,
    type DivNode,
    type NodeHandler,
} from '../types';

import {
    renderSpaceAttributesStart,
    renderSpaceAttributesEnd,
} from '../../utilities/render-space-attributes';
import {
    renderTextAttributesStart,
    renderTextAttributesEnd,
} from '../../utilities/render-text-attributes';
import {
    renderNodeAsMarkupStart,
    renderNodeAsMarkupEnd,
} from '../../utilities/render-node-as-markup';

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
    options: {
        isBlock?: boolean
    }
): string {
    if (format === "ansi") {        
        return renderSpaceAttributesStart(node, format, options) + renderTextAttributesStart(node, format);
    } else if (format === 'markup') {
        return renderNodeAsMarkupStart(node);
    } else {
        throw new CompilerError(
            `Invalid format: ${format}`,
            node,
            stack,
            false,
        );
    }
}

/**
 * This will build the ending of a node as rendered to the target compiler format (ansi or markup)
 * @param node
 * @param format
 * @returns
 */
function buildEnd(
    node: AnsieNode,
    stack: AnsieNode[],
    format: CompilerFormat,
    options: {
        isBlock?: boolean
    }
): string {
    if (format === 'ansi') {
        return `${renderTextAttributesEnd(node, format)}${renderSpaceAttributesEnd(node, format, options)}`;
    } else if (format === 'markup') {
        return renderNodeAsMarkupEnd(node);
    } else {
        throw new CompilerError(
            `Invalid format: ${format}`,
            node,
            stack,
            false,
        );
    }
}

////// Node Handlers - These are the handlers for the various semantic elements that can be used in the markup

////// H1 Node - This is the handler for the <h1> element
export const H1NodeHandler: NodeHandler<H1Node> = {
    isType: (node: unknown): node is H1Node =>
        (node as AnsieNode).node === 'h1',
    handleEnter: (
        node: H1Node,
        stack: AnsieNode[],
        format: CompilerFormat = 'ansi',
    ) => buildStart(node, stack, format, { isBlock: true }),
    handleExit: (
        node: H1Node,
        stack: AnsieNode[],
        format: CompilerFormat = 'ansi',
    ) => buildEnd(node, stack, format, { isBlock: true }),
};

////// H2 Node - This is the handler for the <h2> element
export const H2NodeHandler: NodeHandler<H2Node> = {
    isType: (node: unknown): node is H2Node =>
        (node as AnsieNode).node === 'h2',
    handleEnter: (
        node: H2Node,
        stack: AnsieNode[],
        format: CompilerFormat = 'ansi',
    ) => buildStart(node, stack, format, { isBlock: true }),
    handleExit: (
        node: H2Node,
        stack: AnsieNode[],
        format: CompilerFormat = 'ansi',
    ) => buildEnd(node, stack, format, { isBlock: true }),
};

////// H3 Node - This is the handler for the <h3> element
export const H3NodeHandler: NodeHandler<H3Node> = {
    isType: (node: unknown): node is H3Node =>
        (node as AnsieNode).node === 'h3',
    handleEnter: (
        node: H3Node,
        stack: AnsieNode[],
        format: CompilerFormat = 'ansi',
    ) => buildStart(node, stack, format, { isBlock: true }),
    handleExit: (
        node: H3Node,
        stack: AnsieNode[],
        format: CompilerFormat = 'ansi',
    ) => buildEnd(node, stack, format, { isBlock: true }),
};

////// Body Node - This is the handler for the <body> element
export const BodyNodeHandler: NodeHandler<BodyNode> = {
    isType: (node: unknown): node is BodyNode =>
        (node as AnsieNode).node === 'body',
    handleEnter: (
        node: BodyNode,
        stack: AnsieNode[],
        format: CompilerFormat = 'ansi',
    ) => buildStart(node, stack, format, { isBlock: true }),
    handleExit: (
        node: BodyNode,
        stack: AnsieNode[],
        format: CompilerFormat = 'ansi',
    ) => buildEnd(node, stack, format, { isBlock: true }),
};

////// Span Node - This is the handler for the <span> element which does not have any semantic meaning but is used for altering the formatting of text
export const SpanNodeHandler: NodeHandler<SpanNode> = {
    isType: (node: unknown): node is SpanNode =>
        (node as AnsieNode).node === 'span',
    handleEnter: (
        node: SpanNode,
        stack: AnsieNode[],
        format: CompilerFormat = 'ansi',
    ) => buildStart(node, stack, format, { isBlock: false }),
    handleExit: (
        node: SpanNode,
        stack: AnsieNode[],
        format: CompilerFormat = 'ansi',
    ) => buildEnd(node, stack, format, { isBlock: false }),
};

////// P Node - This is the handler for the <p> element which is used for paragraph separation
export const ParagraphNodeHandler: NodeHandler<ParagraphNode> = {
    isType: (node: unknown): node is ParagraphNode =>
        (node as AnsieNode).node === 'p',
    handleEnter: (
        node: ParagraphNode,
        stack: AnsieNode[],
        format: CompilerFormat = 'ansi',
    ) => buildStart(node, stack, format, { isBlock: true }),
    handleExit: (
        node: ParagraphNode,
        stack: AnsieNode[],
        format: CompilerFormat = 'ansi',
    ) => buildEnd(node, stack, format, { isBlock: true }),
};

////// Div Node - This is the handler for the <div> element which is used for grouping content
export const DivNodeHandler: NodeHandler<DivNode> = {
    isType: (node: unknown): node is DivNode =>
        (node as AnsieNode).node === 'div',
    handleEnter: (
        node: DivNode,
        stack: AnsieNode[],
        format: CompilerFormat = 'ansi',
    ) => buildStart(node, stack, format, { isBlock: true }),
    handleExit: (
        node: DivNode,
        stack: AnsieNode[],
        format: CompilerFormat = 'ansi',
    ) => buildEnd(node, stack, format, { isBlock: true }),
};

export const _testableFunctions = {
    buildStart,
    buildEnd,
};
