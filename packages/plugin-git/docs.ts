import { build } from '@hanto/composer'
import { GitLoader } from './src/loader';
import properties from './src/properties';
import { Property } from '@hanto/core';

export default function docs() {
    const loader = new GitLoader();
    
    const doc = build()
    doc.h1(loader.name)
    doc.p(loader.description)
    doc.h2('Properties')
    doc.table(['Name', 'Description', 'Default'], loader.properties.map((p:Property) => [p.name, p.description, p.defaultValue]))']) 
    return 
}