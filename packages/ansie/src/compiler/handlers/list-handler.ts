import { CompilerError, type CompilerFormat } from '../base';
import type { AnsieNode, ListItemNode, NodeHandler, RawTextNode } from '../types';
import { renderListAttributesEnd, renderListAttributesStart } from '../../utilities/render-list-attributes';
import { renderNodeAsMarkupEnd, renderNodeAsMarkupStart } from '../../utilities/render-node-as-markup';
import { renderSpaceAttributesEnd, renderSpaceAttributesStart } from '../../utilities/render-space-attributes';
import { renderTextAttributesEnd, renderTextAttributesStart } from '../../utilities/render-text-attributes';

export const ListItemNodeHandler: NodeHandler<ListItemNode> = {
    handleEnter(node: RawTextNode, stack: AnsieNode[], format: CompilerFormat = 'ansi') {
        if (format === 'ansi') {
            return `${renderSpaceAttributesStart(node, format, { isBlock: true})}${renderListAttributesStart(node, format)}${renderTextAttributesStart(node, format)}`;
        } else if (format === 'markup') {
            return renderNodeAsMarkupStart(node);
        }
    
        throw new CompilerError(`Invalid format: ${format}`, node, stack, false);    
    },

    handleExit(node: RawTextNode, _stack: AnsieNode[], format: CompilerFormat = 'ansi') {
        if (format === 'ansi') {
            return `${renderTextAttributesEnd(node, format)}${renderListAttributesEnd(node, format)}${renderSpaceAttributesEnd(node, format, { isBlock: true})}`;
        } else if (format === 'markup') {
            return renderNodeAsMarkupEnd(node);
        } else {
            return '';
        }
    },

    isType(node: unknown): node is ListItemNode {
        return (node as ListItemNode).node === 'li';
    }
};
