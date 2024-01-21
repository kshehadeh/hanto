import { type NodeParams, ComposerNode } from ".";
import { ValidTags, type BreakNode } from "../../compiler/types";

export type BreakNodeParams = NodeParams;
export class BreakComposerNode extends ComposerNode implements BreakNode{
    node = ValidTags.break;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(_params: NodeParams = {}) {
        // Intentionally do not allow any contained nodes here because it's a self-terminated
        //  node.
        super();
    }

    toString() {
        return '<br/>';
    }
}