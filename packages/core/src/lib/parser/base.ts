import { ClassDeclaration, ClassMethod, ClassProperty, FunctionDeclaration, Identifier, ImportDeclaration, JSXElement, JSXFragment, MemberExpression, File, Node, ReturnStatement } from '@babel/types';

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

export function isModule(node: File): node is File {
    return node.type === 'File'
}

export function isClassDeclaration(node: Node | undefined): node is ClassDeclaration {
    return node?.type === 'ClassDeclaration'
}

export function isImportDeclaration(node: Node | undefined | null): node is ImportDeclaration {
    return node?.type === 'ImportDeclaration'
}

export function isFunctionDeclaration(node: Node | undefined | null): node is FunctionDeclaration {
    return node?.type === 'FunctionDeclaration'
}

export function isClassMethod(node: Node | undefined | null): node is ClassMethod {
    return node?.type === 'ClassMethod' && node.kind === 'method'
}

export function isClassConstructor(node: Node | undefined | null): node is ClassMethod {
    return node?.type === 'ClassMethod' && node.kind === 'constructor'
}

export function isClassGetter(node: Node | undefined | null): node is ClassMethod {
    return isClassMethod(node) && node.kind === 'get'
}

export function isClassSetter(node: Node | undefined | null): node is ClassMethod {
    return isClassMethod(node) && node.kind === 'set'
}

export function isClassProperty(node: Node | undefined | null): node is ClassProperty {
    return node?.type === 'ClassProperty'
}

export function isReturnStatement(node: Node | undefined | null): node is ReturnStatement {
    return node?.type === 'ReturnStatement'
}

export function isAnyJsxType(node: Node | undefined | null): node is JSXFragment | JSXElement {
    return node?.type === 'JSXElement' || node?.type === 'JSXFragment'
}

export function isJsxElement(node: Node | undefined | null): node is JSXElement {
    return node?.type === 'JSXElement'
}

export function isJsxFragment(node: Node | undefined | null): node is JSXFragment {
    return node?.type === 'JSXFragment'
}

export function isIdentifier(node: Node | undefined | null): node is Identifier {
    return node?.type === 'Identifier'
}

export function isMemberExpression(node: Node | undefined | null): node is MemberExpression {
    return node?.type === 'MemberExpression'
}

export function extractName(node: Node | undefined | null): string {
    if (!node) return ''    
    if (isClassDeclaration(node)) return node.id?.name || '<anonymous>'
    if (isFunctionDeclaration(node)) return node.id?.name || '<anonymous>'
    if (isImportDeclaration(node)) return node.specifiers[0].local.name
    if (isIdentifier(node)) return node.name
    if (isMemberExpression(node)) return combineMemberExpression(node)
    return '<unknown_type>'
}

export function combineMemberExpression(expr: MemberExpression): string {
    return `${extractName(expr.object)}.${extractName(expr.property)}`
}

export class Base<T extends Node> {
    _top: T | undefined | null;

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