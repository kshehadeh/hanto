import { ComposerNode, type NodeParams } from ".";
import { compile } from "../../compiler";
import { type BaseNode, CompilerError } from "../../compiler/base";

export interface MarkupNodeParams extends NodeParams {
    content: string;
}

/**
 * This is a special node that allows for raw markup to be inserted into the output.
 * This does the work of validating that the raw markup is valid ansie markup before
 * storing.
 * 
 * @returns 
 */
export class MarkupComponentNode extends ComposerNode implements BaseNode {
    node = 'raw' as const;
    markup: string;

    constructor(params: MarkupNodeParams) {
        super(params);     

        try {
            this.markup = compile(params.content, 'markup');
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
