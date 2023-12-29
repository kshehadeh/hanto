import * as acorn from 'acorn';
import { NodeContainerBase } from './base';
import {
  AllNodes,
  getDescriptionOfNode,
  isVariableDeclarationNode,
} from '../lib/ast';

export interface Variable {
  name: string;
  valueAsString: string;
  valueAsNode: AllNodes | null | undefined;
  isInitialized: boolean;
}

export class VariableContainer extends NodeContainerBase {
  _kind: string;
  _variables: Variable[] = [];

  static isVariable(node: AllNodes): node is acorn.VariableDeclaration {
    return isVariableDeclarationNode(node);
  }

  constructor(node: AllNodes, path: AllNodes[]) {
    super(node, path);

    if (!VariableContainer.isVariable(node)) {
      throw new Error('Not a variable');
    }

    this._kind = node.kind;
    this._variables = node.declarations.map(d => ({
      name: getDescriptionOfNode(d.id),
      valueAsString: d.init
        ? getDescriptionOfNode(d.init)
        : '[not initialized]',
      valueAsNode: d.init,
      isInitialized: !!d.init,
    }));
  }

  get variables() {
    return this._variables;
  }

  get kind() {
    return this._kind;
  }
}
