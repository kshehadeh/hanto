import { AllNodes, getDescriptionOfNode } from '../lib/ast';

export class NodeContainerBase {
  _root: AllNodes;
  _path: AllNodes[];

  constructor(node: AllNodes, path: AllNodes[] = []) {
    this._root = node;
    this._path = path;
  }

  get name() {
    return getDescriptionOfNode(this._root);
  }

  get type() {
    return this._root.type;
  }
}
