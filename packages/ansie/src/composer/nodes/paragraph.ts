import { type NodeParams, ComposerNode } from ".";
import { BreakComposerNode } from "./break";

export interface ParagraphNodeParams extends NodeParams {
    newLineCount?: number;
}
export class ParagraphComposerNode extends ComposerNode {
    node = 'paragraph' as const;
    _newLineCount: number;

    constructor(params: ParagraphNodeParams) {
        super(params);
        this._newLineCount = params.newLineCount || 1;
    }

    toString() {
        const newLines = Array(this._newLineCount).fill(1).map(() => new BreakComposerNode().toString()).join('');
        return `${newLines}${super.toString()}`;
    }
}
