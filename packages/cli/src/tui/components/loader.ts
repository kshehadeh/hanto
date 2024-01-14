import { Loader, Property } from '@hanto/core';
import { bundle, bold, color, list, text, ComposerNode } from 'ansie';

export function loader(loader: Loader): ComposerNode {
    const props = Object.values<Property>(loader.properties).map((prop: Property) => bundle([bold(`${prop.name}:`), text(prop.value?.toString() || '')]));
    return bundle([
        bold(`Loader: ${loader.name}`),
        text(loader.description),
        color('gray', 'Properties'),
        list(" *", props)
    ])
}
