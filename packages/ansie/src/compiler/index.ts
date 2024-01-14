import { z } from 'zod';
import { parseString } from '../parser';

import { ColorNodeHandler } from './handlers/color-handler';
import { ItalicsNodeHandler } from './handlers/italics-handler';
import { TextNodeHandler } from './handlers/text-handler';
import { BoldNodeHandler } from './handlers/bold-handler';
import { UnderlineNodeHandler } from './handlers/underline-handler';
import { AstSchema, NodeSchema } from './types';
import { BreakNodeHandler } from './handlers/break-handler';
import { CompilerError, type BaseNode } from './base';

export interface NodeHandler<T extends z.infer<typeof NodeSchema>> {
    handleEnter(node: T, stack: BaseNode[]): string;
    handleExit(node: T, stack: BaseNode[]): string;
    isType(node: z.infer<typeof NodeSchema>): node is T;
    schema: z.ZodObject<any, any>;
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
    public compile() {
        return this._ast.reduce((finalString, node) => {
            finalString += this._compileNode(node);
            return finalString;
        }, '');
    }

    protected handleStateEnter(state: z.infer<typeof NodeSchema>) {
        for (const handler of this._handlers) {
            if (handler.isType(state)) {
                return handler.handleEnter(state, this._stack);
            }
        }
    }

    protected handleStateExit(state: z.infer<typeof NodeSchema>) {
        for (const handler of this._handlers) {
            if (handler.isType(state)) {
                return handler.handleExit(state, this._stack);
            }
        }
    }

    private _push(state: z.infer<typeof NodeSchema>) {
        this._stack.push(state);
        return this.handleStateEnter(state);
    }

    private _pop() {
        const old = this._stack.pop();
        return this.handleStateExit(old!);
    }

    private _compileNode(node: z.infer<typeof NodeSchema>) {
        const strings = [];

        try {
            strings.push(this._push(node));

            if (node.content) {
                if (Array.isArray(node.content)) {
                    node.content.forEach(node =>
                        strings.push(this._compileNode(node)),
                    );
                } else {
                    strings.push(this._compileNode(node.content));
                }
            }

            strings.push(this._pop());

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
export function compile(markup: string) {
    const ast = parseString(markup);
    if (ast) {
        const compiler = new Compiler(ast);
        return compiler.compile();
    }
}

// const str = compile(`<color fg="red"><color fg="green">green</color>red</color>`)
// console.log(str)
// <bold>Title</bold><br/>

// <color fg="gray" bg="white">Subtitle goes here</color><br/>

// A description using the default text will appear here.  But you can also include <underline type="single"><italics>nested</italics></underline> values.
// `)
