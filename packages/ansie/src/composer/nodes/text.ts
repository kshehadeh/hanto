import { ComposerNode, type NodeParams } from ".";
import type { RawTextNode } from "../../compiler/handlers/raw-text-handler";
import type { BodyNode, H1Node, H2Node, H3Node } from "../../compiler/handlers/text-handlers";

export interface TextNodeParams extends NodeParams {
    italics?: boolean;
    underline?: ('single' | 'double' | 'none') | boolean;
    bold?: boolean;
    fg?: string;
    bg?: string;
}

export class TextComposerNode extends ComposerNode {
    node: string;
    italics: boolean;
    underline: ('single' | 'double' | 'none') | boolean;
    bold: boolean;
    fg: string;
    bg: string;

    constructor(params: TextNodeParams) {
        super(params);
        this.italics = params.italics;
        this.underline = params.underline;
        this.bold = params.bold;
        this.fg = params.fg;
        this.bg = params.bg;
    }

    toString() {
        const italics = this.italics ? 'italics' : '';
        const underline = this.underline ? `underline${typeof this.underline === 'string' ? `="${this.underline}"` : ''}` : '';
        const bold = this.bold ? 'bold' : '';
        const fg = this.fg ? `fg="${this.fg}"` : '';
        const bg = this.bg ? `bg="${this.bg}"` : '';
        
        return `<${this.node} ${italics} ${underline} ${bold} ${fg} ${bg}>${super.toString()}</${this.node}>`;
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