import { ComposerNode, type NodeParams } from ".";
import { ValidTags, type H1Node, type H2Node, type H3Node, type ParagraphNode, type SpanNode, type DivNode, type RawTextNode, type BodyNode } from "../../compiler/types";
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
        attributes["italics"] = style.font.italics;
    }
    if (style.font?.underline) {
        attributes["underline"] = style.font.underline;
    }
    if (style.font?.bold) {
        attributes["bold"] = style.font.bold;
    }
    if (style.font?.color?.fg) {
        attributes["fg"] = style.font.color.fg;
    }
    if (style.font?.color?.bg) {
        attributes["bg"] = style.font.color.bg;
    }

    if (style.spacing?.margin) {
        attributes["margin"] = style.spacing.margin;
    }
    if (style.spacing?.marginLeft) {
        attributes["marginLeft"] = style.spacing.marginLeft;
    }
    if (style.spacing?.marginRight) {
        attributes["marginRight"] = style.spacing.marginRight;
    }
    if (style.spacing?.marginTop) {
        attributes["marginTop"] = style.spacing.marginTop;
    }
    if (style.spacing?.marginBottom) {
        attributes["marginBottom"] = style.spacing.marginBottom;
    }
    
    return attributes;

}

export abstract class TextComposerNode extends ComposerNode {
    toString() {
        const attributes = buildAttributesFromStyle(this.attrib) || {};
        const attributesString = Object.entries(attributes).map(([key, value]) => `${key}${value ? `="${value}` : ''}"`).join(' ')
        return `<${this.node} ${attributesString}>${super.toString()}</${this.node}>`;
    }
}


// NODE: BODY

export class BodyComposerNode extends TextComposerNode  implements BodyNode {
    node = ValidTags.body;
}


// NODE: H1
export class H1ComposerNode extends TextComposerNode implements H1Node {
    node = ValidTags.h1;
}

// NODE: H2

export class H2ComposerNode extends TextComposerNode implements H2Node {
    node = ValidTags.h2;
}

// NODE: H3

export class H3ComposerNode extends TextComposerNode implements H3Node {
    node = ValidTags.h3;
}

// NODE: P

export class ParagraphComposerNode extends TextComposerNode implements ParagraphNode {
    node = ValidTags.p;
}

// NODE: SPAN

export class SpanComposerNode extends TextComposerNode implements SpanNode {
    node = ValidTags.span;
}

// NODE: DIV

export class DivComposerNode extends TextComposerNode implements DivNode {
    node = ValidTags.div;
}

// NODE: RAW TEXT
export interface RawTextNodeParams extends NodeParams {    
    text: string;
}

export class RawTextComposerNode extends ComposerNode implements RawTextNode {
    node = ValidTags.text;
    value: string;

    constructor(params: RawTextNodeParams) {
        super(params);
        this.value = params.text;
    }

    toString() {
        return this.value;
    }
}