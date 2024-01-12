import { z } from "zod";
import { parseString } from "../parser";

import { ColorNodeSchema, ColorNodeHandler } from "./handlers/color-handler";
import { ItalicsNodeSchema, ItalicsNodeHandler } from "./handlers/italics-handler";
import { TextNodeSchema, TextNodeHandler } from "./handlers/text-handler";
import { BoldNodeSchema, BoldNodeHandler } from "./handlers/bold-handler";
import { UnderlineNodeSchema, UnderlineNodeHandler } from "./handlers/underline-handler";
import { AstSchema, BaseNodeSchema } from "./types";

const NodeUnionSchema = z.discriminatedUnion('node', [
    ColorNodeSchema,
    ItalicsNodeSchema,
    TextNodeSchema,
    BoldNodeSchema,
    UnderlineNodeSchema,
])
        
type Node = z.infer<typeof NodeUnionSchema> & {
    content?: z.infer<typeof NodeUnionSchema> | z.infer<typeof NodeUnionSchema>[];
}

const NodeSchema: z.ZodType<Node> = BaseNodeSchema.extend({
    content: z.lazy(() => z.union([z.array(NodeUnionSchema), NodeUnionSchema]))
})

export interface NodeHandler<T extends z.infer<typeof BaseNodeSchema>>{
    handleEnter(node: T, stack: z.infer<typeof BaseNodeSchema>[]): string;
    handleExit(node: T, stack: z.infer<typeof BaseNodeSchema>[]): string;
    isType(node: z.infer<typeof BaseNodeSchema>): node is T;
    schema: z.ZodObject<any, any>;
}

class Compiler {
    private _ast: z.infer<typeof AstSchema>;
    private _stack: z.infer<typeof NodeSchema>[] = [];
    private _handlers: NodeHandler<z.infer<typeof BaseNodeSchema>>[] = [];

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
            TextNodeHandler
        ]
    }

    /**
     * The compile function takes the AST and compiles it into a string.
     * @returns A string that is the compiled markup.
     */
    public compile() {
        return this._ast.reduce((finalString, node) => {
            finalString += this._compileNode(node)
            return finalString;
        }, '')
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
        return this.handleStateExit(old!)
    }

    private _compileNode(node: z.infer<typeof NodeSchema>) {

        const strings = []

        strings.push(this._push(node))

        if (node.content) {
            if (Array.isArray(node.content)) {
                node.content.forEach(node => strings.push(this._compileNode(node)))
            } else {
                strings.push(this._compileNode(node.content))
            }
        }

        strings.push(this._pop())

        return strings.join('')
    }
}
export function compile(markup: string) {
    const ast = parseString(markup);
    const compiler = new Compiler(ast);
    return compiler.compile();
}