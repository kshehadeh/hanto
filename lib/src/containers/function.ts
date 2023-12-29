import * as acorn from 'acorn';
import {
  JSXElement,
  AllNodes,
  getReturnValues,
  isFunctionDeclaration,
} from '../lib/ast';
import { NodeContainerBase } from './base';

export class FunctionContainer extends NodeContainerBase {
  _returns: (acorn.Expression | JSXElement)[] = [];

  static isFunction(node: AllNodes): node is acorn.FunctionDeclaration {
    return isFunctionDeclaration(node);
  }

  constructor(node: AllNodes, path: AllNodes[]) {
    super(node, path);

    if (!FunctionContainer.isFunction(node)) {
      throw new Error('Not a function');
    }
    this._returns = getReturnValues(node);
  }

  get returns() {
    return this._returns;
  }
}
