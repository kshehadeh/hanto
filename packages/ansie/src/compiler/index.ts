import { parseString } from '../parser';

import { type AnsieNode, type Ast } from './types';
import { CompilerError, type CompilerFormat } from './base';
import { H1NodeHandler, H2NodeHandler, H3NodeHandler, BodyNodeHandler, ParagraphNodeHandler, DivNodeHandler, SpanNodeHandler } from './handlers/text-handlers';
import { BreakNodeHandler } from './handlers/break-handler';
import { RawTextNodeHandler } from './handlers/raw-text-handler';
import { ListItemNodeHandler } from './handlers/list-handler';

const AvailableHandlers = [
    RawTextNodeHandler,
    BreakNodeHandler,
    H1NodeHandler,
    H2NodeHandler,
    H3NodeHandler,
    BodyNodeHandler,
    ParagraphNodeHandler,
    DivNodeHandler,
    SpanNodeHandler,
    ListItemNodeHandler,
];

class Compiler {
    private _ast: Ast;
    private _stack: AnsieNode[] = [];

    /**
     * The compiler takes the AST from the parser and compiles it into a string
     * @param ast Takes the AST from the compiled markup and stores for future operations.
     */
    constructor(ast: Ast) {
        this._ast = ast;
    }

    /**
     * The compile function takes the AST and compiles it into a string.
     * @returns A string that is the compiled markup.
     */
    public compile(format: CompilerFormat= 'ansi') {
        return this._ast.reduce((finalString, node) => {
            finalString += this._compileNode(node, format);
            return finalString;
        }, '');
    }

    protected handleStateEnter(state: AnsieNode, format: CompilerFormat = 'ansi') {
        for (const handler of AvailableHandlers) {
            if (handler.isType(state)) {
                return handler.handleEnter(state, this._stack, format);
            }            
        }

        throw new CompilerError(`Invalid node type: ${state}`, state, this._stack, true);
    }

    protected handleStateExit(state: AnsieNode, format: CompilerFormat = 'ansi') {
        for (const handler of AvailableHandlers) {
            if (handler.isType(state)) {
                return handler.handleExit(state, this._stack, format);
            }
        }

        throw new CompilerError(`Invalid node type: ${state}`, state, this._stack, true);
    }

    private _push(state: AnsieNode, format: CompilerFormat = 'ansi') {
        this._stack.push(state);
        return this.handleStateEnter(state, format);
    }

    private _pop(format?: 'ansi' | 'markup') {
        const old = this._stack.pop();
        return this.handleStateExit(old!, format);
    }

    private _compileNode(node: AnsieNode, format: CompilerFormat = 'ansi'): string {
        const strings = [];

        try {
            strings.push(this._push(node, format));

            if (node.content) {
                if (Array.isArray(node.content)) {
                    node.content.forEach(node =>
                        strings.push(this._compileNode(node)),
                    );
                } else {
                    strings.push(this._compileNode(node.content));
                }
            }

            strings.push(this._pop(format));
            return strings.join('');
        } catch (e) {
            if (e instanceof CompilerError) {
                console.error(e.toString());
                if (!e.continue) {
                    throw e;
                }
            }
        }

        return ''
    }
}



export function compile(markup: string, format: CompilerFormat = 'ansi') {
    const ast = parseString(markup);    
    if (ast) {
        const compiler = new Compiler(ast);
        return compiler.compile(format);
    } else {
        return ''
    }
}

if (process.argv[1].includes('compiler')) {

    // console.log(compile(`<body>
    // <h1 fg="red" marginBottom="1">H1 RED FOREGROUND</h1>
    //     <h2 fg="red" bg="blue" margin="5">RED FOREGROUND AND BLUE BACKGROUND</h2>
    //     <p fg="blue" marginTop="1">This is a paragraph</p>
    //     <p underline="single" marginTop="1" marginBottom="1">Underlined text with newline</p>
    //     <p underline="double" bold marginTop="2" marginBottom="1">Underlined text with newline</p>
    // </body>`));

    console.log(compile('<h1 underline="double" bold="true" fg="blue" marginTop="1" marginBottom="1">Title</h1><h2 underline="single" bold="true" fg="default" marginTop="1" marginBottom="1">A subtitle</h2><p marginTop="1" marginBottom="1">Paragraph</p>'))

}