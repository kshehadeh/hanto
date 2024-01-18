import { z } from 'zod';
import { parseString } from '../parser';

import { AstSchema, NodeSchema, type AnsieNode } from './types';
import { CompilerError, type CompilerFormat } from './base';
import { BreakNodeHandler } from './handlers/break-handler';
import { H1NodeHandler, H2NodeHandler, H3NodeHandler, BodyNodeHandler, ParagraphNodeHandler, DivNodeHandler, SpanNodeHandler } from './handlers/text-handlers';
import { RawTextNodeHandler } from './handlers/raw-text-handler';

export interface NodeHandler<T extends z.infer<typeof NodeSchema>> {    
    handleEnter(node: T, stack: AnsieNode[], format: CompilerFormat): string;
    handleExit(node: T, stack: AnsieNode[], format: CompilerFormat): string;
    isType(node: z.infer<typeof NodeSchema>): node is T;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.ZodObject<any, any>;
}

class Compiler {
    private _ast: z.infer<typeof AstSchema>;
    private _stack: AnsieNode[] = [];
    private _handlers: NodeHandler<z.infer<typeof NodeSchema>>[] = [];

    /**
     * The compiler takes the AST from the parser and compiles it into a string
     * @param ast Takes the AST from the compiled markup and stores for future operations.
     */
    constructor(ast: z.infer<typeof AstSchema>) {
        this._ast = ast;

        this._handlers = [
            RawTextNodeHandler,
            BreakNodeHandler,
            H1NodeHandler,
            H2NodeHandler,
            H3NodeHandler,
            BodyNodeHandler,
            ParagraphNodeHandler,
            DivNodeHandler,
            SpanNodeHandler,
        ];
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

    protected handleStateEnter(state: z.infer<typeof NodeSchema>, format: CompilerFormat = 'ansi') {
        for (const handler of this._handlers) {
            if (handler.isType(state)) {
                return handler.handleEnter(state, this._stack, format);
            }            
        }

        throw new CompilerError(`Invalid node type: ${state}`, state, this._stack, true);
    }

    protected handleStateExit(state: z.infer<typeof NodeSchema>, format: CompilerFormat = 'ansi') {
        for (const handler of this._handlers) {
            if (handler.isType(state)) {
                return handler.handleExit(state, this._stack, format);
            }
        }

        throw new CompilerError(`Invalid node type: ${state}`, state, this._stack, true);
    }

    private _push(state: z.infer<typeof NodeSchema>, format: CompilerFormat = 'ansi') {
        this._stack.push(state);
        return this.handleStateEnter(state, format);
    }

    private _pop(format?: 'ansi' | 'markup') {
        const old = this._stack.pop();
        return this.handleStateExit(old!, format);
    }

    private _compileNode(node: z.infer<typeof NodeSchema>, format: CompilerFormat = 'ansi') {
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
    }
}



export function compile(markup: string, format: CompilerFormat = 'ansi') {
    const ast = parseString(markup);
    if (ast) {
        const compiler = new Compiler(ast);
        return compiler.compile(format);
    }
}

if (process.argv[1].includes('compiler')) {

    console.log(compile(`<body>
    <h1 fg="red" marginBottom="1">H1 RED FOREGROUND</h1>
        <h2 fg="red" bg="blue" margin="5">RED FOREGROUND AND BLUE BACKGROUND</h2>
        <p fg="blue" marginTop=1>This is a paragraph</p>
        <p underline="single" marginTop=1 marginBottom=1>Underlined text with newline</p>
        <p underline="double" bold marginTop=2 marginBottom=1>Underlined text with newline</p>
    </body>`));

}