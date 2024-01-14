import { compile } from '../../compiler';
import { CompilerError, type BaseNode } from '../../compiler/base';
import type { BoldNode } from '../../compiler/handlers/bold-handler';
import type { BreakNode } from '../../compiler/handlers/break-handler';
import type { ColorNode } from '../../compiler/handlers/color-handler';
import type { ItalicsNode } from '../../compiler/handlers/italics-handler';
import type { TextNode } from '../../compiler/handlers/text-handler';
import type { UnderlineNode } from '../../compiler/handlers/underline-handler';
import { condStr } from '../../util';

export abstract class ComposerNode {
    _content: ComposerNode[];
    constructor(nodes?: ComposerNodeCompatible) {
        this._content = ComposerNode.create(nodes);
    }

    toString() {
        return this._content?.map(c => c.toString()).join('') || '';
    }

    /**
     * This will handle the creation of a node object from a node, string or an array of either.
     * @param node
     * @returns
     */
    static create(node: ComposerNodeCompatible): ComposerNode[] {
        if (Array.isArray(node)) {
            // If we got an array then call this function recursively
            return node.map(n => ComposerNode.create(n).at(0)).filter(n => !!n);
        } else if (typeof node === 'string') {
            // If we have a string then interpret the string as a node
            return [ComposerNode.interpretString(node)].filter(n => !!n);
        } else if (node instanceof ComposerNode) {
            // If we got a node then just return it as is
            return [node];
        } else {
            // If we got anything else then we can't create a node from it.  .
            return undefined;
        }
    }

    /**
     * Interpret a string as a node.  This is used to allow strings to be passed in place of
     * nodes in some cases.  For example, if you pass a string to the `bold` function, it will
     * be interpreted as a `text` node.  But this function can also be used to interpret a
     * string as a node in any other context.  This opens up the extensibility to allow for
     * specialized nodes that take string as inputs.
     * @param str
     * @returns
     */
    protected static interpretString(str: string): ComposerNode {
        // If we got a string then try to create a node from it.
        //  We'll try each of the available node types until we find one that works.
        const bld = AvailableComposerNodes.reduce(
            (acc, cls) => {
                return acc || cls.createFromAlternateInput?.(str);
            },
            undefined as ComposerNode | undefined,
        );

        // If we didn't find a node then throw an error.
        if (!bld) {
            throw new Error(`Unable to create node from ${str}`);
        }

        return Array.isArray(bld) ? bld[0] : bld;
    }

    /**
     * Nodes can override this to allow for alternate input types.  For example, the `text` node
     * will accept a string as a node.  We use it to allow strings to be passed in place of nodes
     * in some cases.  Example:
     *
     *  color('red', 'green', [bold(['Hello World'])]) will create a node that looks like this:
     *  `<color fg=red bg=green><bold>Hello World</bold></color>`
     *
     * @param node
     * @returns
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static createFromAlternateInput(_node: unknown): ComposerNode {
        return undefined;
    }
}

export type ComposerNodeCompatible = ComposerNode | (ComposerNode | string)[] | string;


/**
 * This is a special node that allows for raw markup to be inserted into the output.
 * This does the work of validating that the raw markup is valid ansie markup before
 * storing.
 * 
 * @returns 
 */
export class RawComponentNode extends ComposerNode implements BaseNode {
    node = 'raw' as const;
    markup: string;

    constructor(content: string) {
        super();     

        try {
            this.markup = compile(content, 'markup');
        } catch (e) {
            if (e instanceof CompilerError) {
                console.error(e.toString());
                if (!e.continue) {
                    throw e;
                }
            }
        }
    }

    toString() {
        return this.markup;
    }
}

export class ColorComposerNode extends ComposerNode implements ColorNode {
    node = 'color' as const;
    _fg: string;
    _bg: string;

    constructor(fg?: string, bg?: string, nodes?: ComposerNodeCompatible) {
        super(nodes);
        this._fg = fg;
        this._bg = bg;
    }

    toString() {
        return `<color ${condStr(!!this._fg, `fg="${this._fg}"`)} ${condStr(!!this._bg, `bg="${this._bg}"`)}>${super.toString()}</color>`;
    }
}

export class BoldComposerNode extends ComposerNode implements BoldNode {
    node = 'bold' as const;
    toString() {
        return `<bold>${super.toString()}</bold>`;
    }
}

export class UnderlineComposerNode extends ComposerNode implements UnderlineNode {
    node = 'underline' as const;
    _type: UnderlineNode['type'];

    constructor(type: UnderlineNode['type'], nodes?: ComposerNodeCompatible) {
        super(nodes);
        this._type = type;
    }

    toString() {
        return `<underline ${condStr(!!this._type, `type="${this._type}"`)}>${super.toString()}</underline>`;
    }
}

export class ItalicsComposerNode extends ComposerNode implements ItalicsNode {
    node = 'italics' as const;

    toString() {
        return `<italics>${super.toString()}</italics>`;
    }
}

export class BreakComposerNode extends ComposerNode implements BreakNode {
    node = 'break' as const;

    constructor() {
        // Intentionally do not allow any contained nodes here because it's a self-terminated
        //  node.
        super();
    }

    toString() {
        return '<br/>';
    }
}

export class TextComposerNode extends ComposerNode implements TextNode {
    node = 'text' as const;
    _text: string;

    constructor(text: string, nodes?: ComposerNodeCompatible) {
        super(nodes);
        this._text = text;
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
            return new TextComposerNode(node);
        } else {
            return undefined;
        }
    }
}

export class ListComposerNode extends ComposerNode {
    node = 'list' as const;    
    _bullet: string

    constructor(bullet: string, nodes?: ComposerNodeCompatible) {
        super(nodes);
        this._bullet = bullet;
    }

    toString() {
        let str = '';
        for (const node of this._content) {
            str += `  ${this._bullet}${node.toString()}${new BreakComposerNode().toString()}`
        }
        return str;
    }
}

export class BundleComposerNode extends ComposerNode {
    node = 'bundle' as const;
    _name: string;

    constructor(nodes?: ComposerNodeCompatible) {
        super(nodes);        
    }

    toString() {
        return super.toString();
    }
}

export class ParagraphComposerNode extends ComposerNode {
    node = 'paragraph' as const;

    constructor(nodes?: ComposerNodeCompatible) {
        super(nodes);
    }

    toString() {
        return `${new BreakComposerNode().toString()}${super.toString()}`;
    }
}

export const AvailableComposerNodes = [
    ColorComposerNode,
    BoldComposerNode,
    UnderlineComposerNode,
    ItalicsComposerNode,
    BreakComposerNode,
    ListComposerNode,
    RawComponentNode,
    BundleComposerNode,
    ParagraphComposerNode,
    TextComposerNode, // Text node should always be last as it accepts strings as input.  This allows other nodes to override the behavior of the text input if necessary.
] as const;
