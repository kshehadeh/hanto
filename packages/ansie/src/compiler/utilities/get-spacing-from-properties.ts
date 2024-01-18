import type { SpaceAttributes } from "../handlers/text-handlers";



export function getSpacingFromProperties(props: SpaceAttributes) {
    const left = props.marginLeft || props.margin || 0;
    const right = props.marginRight || props.margin || 0;
    const top = props.marginTop || props.margin || 0;
    const bottom = props.marginBottom || props.margin || 0;

    const vpre = top ? '\n'.repeat(top) : '';
    const vpost = bottom ? '\n'.repeat(bottom) : '';
    const hpre = left ? ' '.repeat(left) : '';
    const hpost = right ? ' '.repeat(right) : '';

    return {
        on: `${vpre}${hpre}`,
        off: `${hpost}${vpost}`,
    }
}