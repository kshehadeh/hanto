import { Property } from '@hanto/core';
import { ComposerNode, bold, bundle, italics, text } from 'ansie';

export function property(prop: Property): ComposerNode {
    const value =
        typeof prop.value === 'function' ? '<Bound Function>' : prop.value;

    return bundle([
        bold(`${prop.name}:`),
        value ? text(value?.toString()) : italics('undefined'),
    ]);
}
