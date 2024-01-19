import type { SpaceNode } from "../types";

export function getSpacingFromProperties(node: SpaceNode) {
    const left = node.marginLeft || node.margin || 0;
    const right = node.marginRight || node.margin || 0;
    const top = node.marginTop || node.margin || 0;
    const bottom = node.marginBottom || node.margin || 0;

    const vpre = top ? '\n'.repeat(top) : '';
    const vpost = bottom ? '\n'.repeat(bottom) : '';
    const hpre = left ? ' '.repeat(left) : '';
    const hpost = right ? ' '.repeat(right) : '';

    return {
        on: `${vpre}${hpre}`,
        off: `${hpost}${vpost}`,
    }
}