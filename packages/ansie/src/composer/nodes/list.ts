import { type NodeParams, ComposerNode } from ".";
import { BreakComposerNode } from "./break";

export interface ListNodeParams extends NodeParams {
    bullet?: string;
}

export class ListComposerNode extends ComposerNode {
    node = 'list' as const;    
    _bullet: string

    constructor(params: ListNodeParams) {
        super(params);
        this._bullet = params.bullet;
    }

    toString() {
        let str = '';
        for (const node of this._content) {
            str += `  ${this._bullet}${node.toString()}${new BreakComposerNode().toString()}`
        }
        return str;
    }
}
