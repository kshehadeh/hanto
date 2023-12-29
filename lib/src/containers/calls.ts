import { AllNodes, isCallExpressionNode, getDescriptionOfNode } from '../lib/ast';
import { NodeContainerBase } from './base';
import * as acorn from 'acorn';

export class CallExpressionContainer extends NodeContainerBase {
  declare _root: acorn.CallExpression;

  constructor(node: AllNodes) {
    if (!isCallExpressionNode(node)) {
      throw new Error('Not a call expression');
    }

    super(node);
  }

  get name() {
    return getDescriptionOfNode(this._root.callee);
  }
}
