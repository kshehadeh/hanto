import { CompilerError, type CompilerFormat } from '../base';
import type { AnsieNode, BreakNode, NodeHandler } from '../types';

//// Break Node - This is a node that represents a line break

export const BreakNodeHandler: NodeHandler<BreakNode> = {
    handleEnter(node: BreakNode, stack: AnsieNode[], format: CompilerFormat = 'ansi') {
        if (format === 'ansi') {
            return '\n';
        } else if (format === 'markup') {
            return '<br/>';
        } 

        throw new CompilerError(`Invalid format: ${format}`, node, stack, false);
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleExit() {
        return '';
    },

    isType(node: unknown): node is BreakNode {
        return (node as BreakNode).node === 'break';
    },
};
