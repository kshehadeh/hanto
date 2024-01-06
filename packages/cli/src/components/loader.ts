import { Loader, Property } from '@hanto/core';
import { build } from '../tui/composer';
import { propertyView } from './property';

export function loaderView(loader: Loader) {
    return build()
        .h3(`Loader: ${loader.name}`)
        .p(loader.description)
        .h4('Properties')
        .list(
            Object.values<Property>(loader.properties).map((prop: Property) =>
                propertyView(prop),
            ),
            { emptyMessage: 'No properties found' },
        );
}
