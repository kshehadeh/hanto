import { type NodeParams, ComposerNode } from ".";

export type BundleNodeParams = NodeParams;
export class BundleComposerNode extends ComposerNode {
    node = 'bundle' as const;
    _name: string;

    toString() {
        return super.toString();
    }
}