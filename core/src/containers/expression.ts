import { JSXElement, AllNodes, isExpressionNode } from '../lib/ast';
import * as acorn from 'acorn';
import { NodeContainerBase } from './base';

export class ExpressionContainer extends NodeContainerBase {
  declare _root: acorn.Expression | JSXElement;

  constructor(node: AllNodes) {
    if (!isExpressionNode(node)) {
      throw new Error('Not an expression');
    }

    super(node);
  }
}
