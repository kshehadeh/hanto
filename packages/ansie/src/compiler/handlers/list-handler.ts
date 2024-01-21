import { CompilerError, type CompilerFormat } from '../base';
import type { AnsieNode, ListItemNode, NodeHandler, RawTextNode } from '../types';
import { renderNodeAsMarkupStart } from '../utilities/render-node-as-markup';
import { renderSpaceAttributesStart } from '../utilities/render-space-attributes';
import { renderTextAttributesStart } from '../utilities/render-text-attributes';

export const ListItemNodeHandler: NodeHandler<ListItemNode> = {
    handleEnter(node: RawTextNode, stack: AnsieNode[], format: CompilerFormat = 'ansi') {
        if (format === 'ansi') {
            return `${renderSpaceAttributesStart(node, format)}${renderTextAttributesStart(node, format)}`;
        } else if (format === 'markup') {
            return renderNodeAsMarkupStart(node);
        }
    
        throw new CompilerError(`Invalid format: ${format}`, node, stack, false);    },

    handleExit() {
        return '';
    },

    isType(node: unknown): node is ListItemNode {
        return (node as ListItemNode).node === 'li';
    }
};
