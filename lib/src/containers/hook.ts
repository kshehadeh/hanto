import { isCallExpressionNode, getDescriptionOfNode, AllNodes } from '../lib/ast';
import { CallExpressionContainer } from './calls';
import * as acorn from 'acorn';

export class HookContainer extends CallExpressionContainer {
  public static isHook(node: unknown): node is acorn.CallExpression {
    return (
      isCallExpressionNode(node) && getDescriptionOfNode(node).startsWith('use')
    );
  }

  constructor(node: AllNodes) {
    if (!HookContainer.isHook(node)) {
      throw new Error('Not a hook');
    }

    super(node);
  }
}
