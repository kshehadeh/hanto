import { Rule } from '@hanto/core';
import { bold, bundle, p } from 'ansie';

export function rule(rule: Rule) {
    return bundle([
        bold(`Rule: ${rule.name}`),
        p(rule.description)
    ])
}
