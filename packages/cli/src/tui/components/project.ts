import { Project } from '@hanto/core';
import { loader } from './loader';
import { rule } from './rule';
import { bold, bundle, p, underline } from 'ansie';

export function projectHeader(project: Project) {
    return bundle([
        bold([underline('single', `Project: ${project.config?.name}`)]),
        p(project.config?.description),
    ])
}

export function projectDetails(project: Project) {
    return bundle([

        bold('Loaders'),
        bundle(project.loaders.map(l => loader(l))),

        bold('Rules'),
        bundle(project.validator.rules.map(r => rule(r))),
    ]);
}