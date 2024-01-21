import { type CompilerFormat } from '../base';
import { ValidTags, type AnsieNode, type NodeHandler, type RawTextNode } from '../types';
import { RawTextMutator } from '../../utilities/raw-text-mutator';

//// Raw Text Node - This is a node that represents raw text that should be output as-is with some exceptions (like emoji)

export const RawTextNodeHandler: NodeHandler<RawTextNode> = {
    isType(node: unknown): node is RawTextNode {
        return (node as RawTextNode).node === ValidTags.text;
    },
    handleEnter(node: RawTextNode, _stack: AnsieNode[], format: CompilerFormat = 'ansi') {
        if (format === 'markup') {
            return node.value
        } else {
            return new RawTextMutator(node.value)
                .replaceEmoji()
                .trimSpaces({ left: true, right: true, allowNewLines: false, replaceWithSingleSpace: false})
                .toString();
        }
    },

    handleExit() {
        return '';
    },    
};
