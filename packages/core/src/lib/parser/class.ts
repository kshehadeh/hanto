import { Base, extractName, isClassGetter, isClassMethod, isClassProperty, isClassSetter } from './base';

import { ClassDeclaration } from '@swc/core';

export class Class extends Base<ClassDeclaration> {

    get name() {
        return this._top?.identifier.value ?? ''
    }

    get methods() {
        return this._top?.body.filter(isClassMethod) ?? []
    }

    get getters() {
        return this.methods.filter(isClassGetter) ?? []
    }

    get setters() {
        return this.methods.filter(isClassSetter) ?? []
    }

    get properties() {
        return this._top?.body.filter(isClassProperty) ?? []
    }

    get extends() {
        return this._top?.superClass
    }

    get baseClassName() {
        return extractName(this.extends)
    }   
}
