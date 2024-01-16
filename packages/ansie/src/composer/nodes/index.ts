import { defaultTheme, type AnsieTheme } from '../styles';
import { AvailableComposerNodes } from './all-nodes';

export interface NodeParams {
    nodes?: ComposerNodeCompatible;
    theme?: AnsieTheme;
    [key: string]: unknown;
}

export abstract class ComposerNode {
    _theme: AnsieTheme;
    _content: ComposerNode[];
    constructor(params: NodeParams = {}) {
        this._content = ComposerNode.create(params.nodes) || [];        
        this._theme = params.theme || defaultTheme;
    }

    toString() {
        return this._content?.map(c => c.toString()).join('') || '';
    }

    set theme(theme: AnsieTheme) {
        this._theme = theme;
    }

    get theme() {
        return this._theme;
    }

    /**
     * Add a node or array of nodes to the content of this node.
     * @param node
     */
    add(node: ComposerNodeCompatible) {
        this._content = this._content.concat(ComposerNode.create(node));
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



///// HIGHER LEVEL NODES /////
// These nodes are used to create higher level constructs that are composed of other nodes.
//  For example, the `list` node is composed of sub-nodes and the raw node is composed of
//  a string that is compiled into a node.
/////////////////////////////

/**
 * Nest the nodes in the stack to create a hierarchical structure.
 * The first node in the stack will be the root node, and each subsequent node will be added as a child of the previous node.
 * @param stack - An array of ComposerNode objects representing the nodes to be nested.
 * @returns The root node of the nested structure.
 */
// function nest(stack: ComposerNode[]) {
//     const root = stack[0];
//     while (stack.length > 0) {
//         const node = stack.shift();
//         if (node && stack.length > 0) {
//             // Add the next node as a child of the current node
//             const nextNode = stack[0];
//             node.add(nextNode);
//         }
//     }
//     return root;
// }




// <doc theme="default"> 
//     <h1>Heading 1</h1>
//     <h2>Heading 2</h2>
//     <h3>Heading 3</h3>
//     <body>
//         <p>Paragraph 1</p>
//         <p>Paragraph 2</p>
//         <list bullet="-">
//             <text>Item 1</text>
//             <text>Item 2</text>
//             <text>Item 3</text>
//         </list>
//     </body>
// </doc>