import { ClassDeclaration, ClassMethod, ClassProperty, ExportDeclaration, ExportDefaultDeclaration, ExportNamedDeclaration, FunctionDeclaration, Identifier, ImportDeclaration, JSXElement, JSXFragment, JscTarget, MemberExpression, Module, Node, ReturnStatement, Script, parseFileSync } from '@swc/core';


export interface ParserError {
    code: string
    originalLine: number
    originalColumn: number
    message: string
    sourceUrl: string
    stack: string
}

export function isParserError(error: any): error is ParserError {
    return error.code !== undefined && error.code === 'GenericFailure'
}

export function isModule(node: Module | Script): node is Module {
    return node.type === 'Module'
}

export function isClassDeclaration(node: Node | undefined): node is ClassDeclaration {
    return node?.type === 'ClassDeclaration'
}

export function isImportDeclaration(node: Node | undefined): node is ImportDeclaration {
    return node?.type === 'ImportDeclaration'
}

export function isFunctionDeclaration(node: Node | undefined): node is FunctionDeclaration {
    return node?.type === 'FunctionDeclaration'
}

export function isClassMethod(node: Node | undefined): node is ClassMethod {
    return node?.type === 'ClassMethod'
}

export function isClassGetter(node: Node | undefined): node is ClassMethod {
    return isClassMethod(node) && node.kind === 'getter'
}

export function isClassSetter(node: Node | undefined): node is ClassMethod {
    return isClassMethod(node) && node.kind === 'setter'
}

export function isClassProperty(node: Node | undefined): node is ClassProperty {
    return node?.type === 'ClassProperty'
}

export function isReturnStatement(node: Node | undefined): node is ReturnStatement {
    return node?.type === 'ReturnStatement'
}

export function isAnyJsxType(node: Node | undefined): node is JSXFragment | JSXElement {
    return node?.type === 'JSXElement' || node?.type === 'JSXFragment'
}

export function isJsxElement(node: Node | undefined): node is JSXElement {
    return node?.type === 'JSXElement'
}

export function isJsxFragment(node: Node | undefined): node is JSXFragment {
    return node?.type === 'JSXFragment'
}

export function isIdentifier(node: Node | undefined): node is Identifier {
    return node?.type === 'Identifier'
}

export function isMemberExpression(node: Node | undefined): node is MemberExpression {
    return node?.type === 'MemberExpression'
}

export function extractName(node: Node | undefined): string {
    if (!node) return ''
    if (isClassDeclaration(node)) return node.identifier.value
    if (isFunctionDeclaration(node)) return node.identifier.value
    if (isImportDeclaration(node)) return node.specifiers[0].local.value
    if (isIdentifier(node)) return node.value
    if (isMemberExpression(node)) return combineMemberExpression(node)
    return '<unknown_type>'
}

export function combineMemberExpression(expr: MemberExpression): string {
    return `${extractName(expr.object)}.${extractName(expr.property)}`
}

export class Base<T extends Node> {
    _top: T | undefined;

    constructor(top: T | undefined) {
        this._top = top;
    }

    public dump() {
        if (!this._top) return
        // no-dd-sa
        console.log(JSON.stringify(this._top, undefined, 2))
    }

    public crawl(node: Node, peek: (node: Node) => boolean, depth: number = 0) {

        const cont = peek(node)

        // We continue diving into the tree if the peek function returns true
        // and the depth is greater than 0 or less than 0 (which means we will
        // continue diving into the tree until we reach the bottom)
        if (cont && (depth > 0 || depth < 0)) {
            const children = (node as any).body ?? []
            children.forEach((child: Node) => this.crawl(child, peek, depth - 1))            
        }
    }    
}