import { type NodeParams, ComposerNode } from ".";
import { ValidTags } from "../../compiler/types";
import { DivComposerNode } from "./text";

export interface ListNodeParams extends NodeParams {
    bullet?: string;
    indent?: number;
}

export class ListItemComposerNode extends ComposerNode {
    node = ValidTags.li
    _bullet: string | undefined;
    _indent: number | undefined;

    constructor(params: ListNodeParams) {
        const finalNodes = params?.nodes?.map(n => new DivComposerNode({ nodes: [n] })) ?? [];
        super({ ...params, nodes: finalNodes });
        this._bullet = params.bullet ?? undefined;
        this._indent = params.indent ?? undefined;
    }

    get indent(): string {
        const num =  this._indent ?? this._style.list?.indent ?? this._theme?.li?.list?.indent ?? 1;
        return num ? ' '.repeat(num) : '';
    }

    get bullet(): string {
        return this._bullet ?? this._style.list?.bullet ?? this._theme?.li?.list?.bullet ?? '';
    }

    toString() {
        let str = '';    

        for (const node of this._content) {
            str += `${this.bullet}${this.indent}${node.toString()}`
        }
        return str;
    }
}
