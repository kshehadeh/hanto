import { Rule } from '@hanto/core';
import { build } from '../composer';

export function ruleView(rule: Rule) {
    return build().h1(`Rule: ${rule.name}`).p(rule.description);
}
