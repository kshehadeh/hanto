import * as acorn from 'acorn';
import { NodeContainerBase } from './base';
import { AllNodes, isClassDeclarationNode } from '../lib/ast';

export class ClassContainer extends NodeContainerBase {
  _methods: acorn.MethodDefinition[] = [];
  _properties: acorn.PropertyDefinition[] = [];

  static isClass(node: AllNodes): node is acorn.ClassDeclaration {
    return isClassDeclarationNode(node);
  }

  constructor(node: AllNodes, path: AllNodes[]) {
    super(node, path);

    if (!ClassContainer.isClass(node)) {
      throw new Error('Not a class');
    }

    this._methods = node.body.body.filter(
      n => n.type === 'MethodDefinition',
    ) as acorn.MethodDefinition[];
    this._properties = node.body.body.filter(
      n => n.type === 'PropertyDefinition',
    ) as acorn.PropertyDefinition[];
  }

  get methods() {
    return this._methods;
  }

  get properties() {
    return this._properties;
  }
}
