import { Property } from '@hanto/core';
import { Composer, build } from '../tui/composer';

export function propertyView(prop: Property): Composer {
    const value =
        typeof prop.value === 'function' ? '<Bound Function>' : prop.value;

    return build().listItem(`${prop.name}: ${value}`);
}
