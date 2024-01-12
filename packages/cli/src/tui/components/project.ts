import { Project } from '@hanto/core';
import { build } from '../composer';
import { loaderView } from './loader';
import { ruleView } from './rule';

export function projectView(project: Project) {
    return build()
        .h1(`Project: ${project.config?.name}`)
        .p(project.config?.description)
        .h2('Loaders')
        .list(project.loaders.map(loader => loaderView(loader)))
        .h2('Rules')
        .list(project.validator.rules.map(rule => ruleView(rule)));
}
