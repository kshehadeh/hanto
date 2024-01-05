import { Base, extractName, isClassGetter, isClassMethod, isClassProperty, isClassSetter } from './base';

import { ClassDeclaration } from '@babel/types';

export class Class extends Base<ClassDeclaration> {

    get name() {
        return this._top?.id?.name ?? ''
    }

    get methods() {
        return this._top?.body.body.filter(isClassMethod) ?? []
    }

    get getters() {
        return this.methods.filter(isClassGetter) ?? []
    }

    get setters() {
        return this.methods.filter(isClassSetter) ?? []
    }

    get properties() {
        return this._top?.body.body.filter(isClassProperty) ?? []
    }

    get extends() {
        return this._top?.superClass
    }

    get baseClassName() {
        return extractName(this.extends)
    }   
}
