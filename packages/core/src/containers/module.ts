import {
  AllNodes,
  getClassDeclarations,
  getExportedNames,
  getFunctionCalls,
  getVariableDeclarations,
} from '../lib/ast';
import { NodeContainerBase } from './base';
import { ClassContainer } from './class';
import { ComponentContainer } from './component';
import { FunctionContainer } from './function';
import { VariableContainer } from './variable';

export class ModuleContainer extends NodeContainerBase {
  _privateFunctions: FunctionContainer[] = [];
  _privateComponents: ComponentContainer[] = [];
  _privateClasses: ClassContainer[] = [];
  _privateProperties: VariableContainer[] = [];
  _exportedFunctions: FunctionContainer[] = [];
  _exportedClasses: ClassContainer[] = [];
  _exportedComponents: ComponentContainer[] = [];
  _exportedProperties: VariableContainer[] = [];

  constructor(node: AllNodes) {
    super(node);

    this._privateComponents = getFunctionCalls(node, {
      isExported: false,
    })
      .filter(n => ComponentContainer.isComponent(n))
      .map(node => new ComponentContainer(node, []));
    this._privateFunctions = getFunctionCalls(node, {
      isExported: false,
    })
      .filter(n => FunctionContainer.isFunction(n))
      .map(node => new FunctionContainer(node, []));
    this._privateClasses = getClassDeclarations(node, {
      isExported: false,
    })
      .filter(n => ClassContainer.isClass(n))
      .map(node => new ClassContainer(node, []));
    this._privateProperties = getVariableDeclarations(node, {
      isExported: false,
    })
      .filter(n => VariableContainer.isVariable(n))
      .map(node => new VariableContainer(node, []));

    const exportedNodes = getExportedNames(node);
    exportedNodes.forEach(n => {
      if (!n.declaration) {
        return;
      }

      if (FunctionContainer.isFunction(n.declaration)) {
        this._exportedFunctions.push(new FunctionContainer(n.declaration, []));
      }

      if (ClassContainer.isClass(n.declaration)) {
        this._exportedClasses.push(new ClassContainer(n.declaration, []));
      }

      if (ComponentContainer.isComponent(n.declaration)) {
        this._exportedComponents.push(
          new ComponentContainer(n.declaration, []),
        );
      }

      if (VariableContainer.isVariable(n.declaration)) {
        this._exportedProperties.push(new VariableContainer(n.declaration, []));
      }
    });
  }

  get privateComponents() {
    return this._privateComponents;
  }

  get privateFunctions() {
    return this._privateFunctions;
  }

  get privateClasses() {
    return this._privateClasses;
  }

  get exportedFunctions() {
    return this._exportedFunctions;
  }

  get exportedClasses() {
    return this._exportedClasses;
  }

  get exportedComponents() {
    return this._exportedComponents;
  }

  get exportedProperties() {
    return this._exportedProperties;
  }

  get privateProperties() {
    return this._privateProperties;
  }
}
