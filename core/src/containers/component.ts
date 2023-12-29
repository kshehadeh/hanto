import {
  AllNodes,
  getReturnValues,
  getFunctionCalls,
  isFunctionDeclaration,
} from '../lib/ast';
import { FunctionContainer } from './function';
import { HookContainer } from './hook';
import * as acorn from 'acorn';

export class ComponentContainer extends FunctionContainer {
  _hooks: HookContainer[] = [];

  constructor(node: AllNodes, path: AllNodes[]) {
    super(node, path);

    if (!ComponentContainer.isComponent(node)) {
      throw new Error('Not a component');
    }

    this._hooks = getFunctionCalls(node, {})
      .filter(n => HookContainer.isHook(n))
      .map(node => new HookContainer(node));
  }

  static isComponent(node: AllNodes): node is acorn.FunctionDeclaration {
    return (
      isFunctionDeclaration(node) &&
      getReturnValues(node).some(n => n.type === 'JSXElement')
    );
  }

  get hooks() {
    return this._hooks;
  }
}
