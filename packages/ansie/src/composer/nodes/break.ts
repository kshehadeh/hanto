import { type NodeParams, ComposerNode } from ".";
import type { BreakNode } from "../../compiler/handlers/break-handler";

export type BreakNodeParams = NodeParams;
export class BreakComposerNode extends ComposerNode implements BreakNode{
    node = 'break' as const;

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