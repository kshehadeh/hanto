import { type NodeParams, ComposerNode } from ".";
import { DivComposerNode } from "./text";

export interface ListNodeParams extends NodeParams {
    bullet?: string;
}

export class ListComposerNode extends ComposerNode {
    node = 'list' as const;    

    constructor(params: ListNodeParams) {
        const finalNodes = [];
        for (const node of params.nodes) {
            // Put each node inside a div node
            finalNodes.push(new DivComposerNode({ nodes: [node] }));
        }            
        super({ ...params, nodes: finalNodes });
    }

    toString() {
        let str = '';
        for (const node of this._content) {
            str += `${this._theme.list.list.prefix}${node.toString()}`
        }
        return str;
    }
}
