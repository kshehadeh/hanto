import { z } from 'zod';
import { parseString } from '../parser';

import { ColorNodeHandler } from './handlers/color-handler';
import { ItalicsNodeHandler } from './handlers/italics-handler';
import { TextNodeHandler } from './handlers/text-handler';
import { BoldNodeHandler } from './handlers/bold-handler';
import { UnderlineNodeHandler } from './handlers/underline-handler';
import { AstSchema, NodeSchema } from './types';
import { type CompilerFormat } from './base';
import { BreakNodeHandler } from './handlers/break-handler';
import { CompilerError, type BaseNode } from './base';


export interface NodeHandler<T extends z.infer<typeof NodeSchema>> {    
    handleEnter(node: T, stack: BaseNode[], format: CompilerFormat): string;
    handleExit(node: T, stack: BaseNode[], format: CompilerFormat): string;
    isType(node: z.infer<typeof NodeSchema>): node is T;
    schema: z.ZodObject<any, any>;
    tagName: string;
    selfTerminated?: boolean;
    attributes: {
        name: string;
        type: 'enum' | 'string' | 'number';
        required?: boolean;
        values?: string[];
    }[];
}

class Compiler {
    private _ast: z.infer<typeof AstSchema>;
    private _stack: z.infer<typeof NodeSchema>[] = [];
    private _handlers: NodeHandler<z.infer<typeof NodeSchema>>[] = [];

    /**
     * The compiler takes the AST from the parser and compiles it into a string
     * @param ast Takes the AST from the compiled markup and stores for future operations.
     */
    constructor(ast: z.infer<typeof AstSchema>) {
        this._ast = ast;

        this._handlers = [
            BoldNodeHandler,
            ItalicsNodeHandler,
            UnderlineNodeHandler,
            ColorNodeHandler,
            TextNodeHandler,
            BreakNodeHandler,
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
    }

    protected handleStateExit(state: z.infer<typeof NodeSchema>, format: CompilerFormat = 'ansi') {
        for (const handler of this._handlers) {
            if (handler.isType(state)) {
                return handler.handleExit(state, this._stack, format);
            }
        }
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
