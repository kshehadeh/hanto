import { ComposerNode, type NodeParams } from ".";
import type { RawTextNode } from "../../compiler/handlers/raw-text-handler";
import type { BodyNode, DivNode, H1Node, H2Node, H3Node, ParagraphNode, SpanNode } from "../../compiler/handlers/text-handlers";
import type { AnsieStyle } from "../styles";

export interface TextNodeParams extends NodeParams {
    italics?: boolean;
    underline?: ('single' | 'double' | 'none') | boolean;
    bold?: boolean;
    fg?: string;
    bg?: string;
}

export interface SpaceNodeParams extends NodeParams {
    margin?: number;
    marginLeft?: number;
    marginRight?: number;
    marginTop?: number;
    marginBottom?: number;
}

/**
 * Builds a set of attributes from a style object.  This is used to build the attributes for a node tag.  It will
 * only include attributes that are defined in the style object.
 * @param style 
 * @returns 
 */
function buildAttributesFromStyle(style: AnsieStyle): Record<string, string|number|boolean|undefined> {
    const attributes: Record<string, string|number|boolean|undefined> = {};
    if (style.font?.italics) {
        attributes.italics = style.font.italics;
    }
    if (style.font?.underline) {
        attributes.underline = style.font.underline;
    }
    if (style.font?.bold) {
        attributes.bold = style.font.bold;
    }
    if (style.font?.color.fg) {
        attributes.fg = style.font.color.fg;
    }
    if (style.font?.color.bg) {
        attributes.bg = style.font.color.bg;
    }

    if (style.spacing?.margin) {
        attributes.margin = style.spacing.margin;
    }
    if (style.spacing?.marginLeft) {
        attributes.marginLeft = style.spacing.marginLeft;
    }
    if (style.spacing?.marginRight) {
        attributes.marginRight = style.spacing.marginRight;
    }
    if (style.spacing?.marginTop) {
        attributes.marginTop = style.spacing.marginTop;
    }
    if (style.spacing?.marginBottom) {
        attributes.marginBottom = style.spacing.marginBottom;
    }
    
    return attributes;

}

export class TextComposerNode extends ComposerNode {
    node: string;

    toString() {
        const attributes = buildAttributesFromStyle(this.attrib) || {};
        const attributesString = Object.entries(attributes).map(([key, value]) => `${key}${value ? `="${value}` : ''}"`).join(' ')
        return `<${this.node} ${attributesString}>${super.toString()}</${this.node}>`;
    }
}


// NODE: BODY

export class BodyComposerNode extends TextComposerNode  implements BodyNode {
    node = 'body' as const;
}


// NODE: H1
export class H1ComposerNode extends TextComposerNode implements H1Node{
    node = 'h1' as const;
}

// NODE: H2

export class H2ComposerNode extends TextComposerNode implements H2Node {
    node = 'h2' as const;
}

// NODE: H3

export class H3ComposerNode extends TextComposerNode implements H3Node {
    node = 'h3' as const;
}

// NODE: P

export class ParagraphComposerNode extends TextComposerNode implements ParagraphNode {
    node = 'p' as const;
}

// NODE: SPAN

export class SpanComposerNode extends TextComposerNode implements SpanNode {
    node = 'span' as const;
}

// NODE: DIV

export class DivComposerNode extends TextComposerNode implements DivNode {
    node = 'div' as const;
}

// NODE: RAW TEXT
export interface RawTextNodeParams extends NodeParams {
    text: string;
}

export class RawTextComposerNode extends ComposerNode implements RawTextNode {
    node = 'text' as const;
    _text: string;

    constructor(params: RawTextNodeParams) {
        super(params);
        this._text = params.text;
    }

    toString() {
        return this._text;
    }

    /**
     * The text node will accept a string as a node.  We use it to allow strings to be passed
     * in place of nodes in some cases.  For example, if you pass a string to the `bold` function, it will
     * be interpreted as a `text` node.
     * @param node
     * @returns
     */
    static createFromAlternateInput(node: unknown): ComposerNode {
        if (typeof node === 'string') {
            return new TextComposerNode({text: node});
        } else {
            return undefined;
        }
    }
}