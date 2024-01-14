import { Issue } from '@hanto/core';
import { ComposerNode, bold, bundle, list, text } from 'ansie';


export function issue(issue: Issue): ComposerNode {
    return list('* ', bundle([
        bold(`${issue.path?.join(',') || '[root]'}:`),
        text(issue.message),        
    ]));    
}
