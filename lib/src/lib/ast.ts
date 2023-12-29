import * as acorn from 'acorn';
import tsPlugin from 'acorn-typescript';
import fs from 'fs';

export interface NodeFilterOptions {
    isExported?: boolean;
}

export interface JSXClosingElement extends acorn.Node {
    type: 'JSXClosingElement';
    name: string;
}

export interface JSXOpeningElement extends acorn.Node {
    type: 'JSXOpeningElement';
    name: string;
}

export interface JSXElement extends acorn.Node {
    type: 'JSXElement';
    openingElement: JSXOpeningElement;
    closingElement: JSXClosingElement;
}

export function isJSXElement(node: unknown): node is JSXElement {
    return (
        node !== null &&
        typeof node === 'object' &&
        'type' in node &&
        node.type === 'JSXElement'
    );
}

export function isExpressionNode(
    node: unknown,
): node is acorn.Expression | JSXElement {
    if (
        node !== null &&
        typeof node === 'object' &&
        'type' in node &&
        node.type &&
        typeof node.type === 'string'
    ) {
        return (
            node.type.endsWith('Expression') ||
            node.type === 'JSXElement' ||
            node.type === 'TemplateLiteral' ||
            node.type === 'Literal' ||
            node.type === 'MetaProperty' ||
            node.type === 'Identifier'
        );
    }

    return false;
}

export function isVariableDeclarationNode(
    node: unknown,
): node is acorn.VariableDeclaration {
    return (
        node !== null &&
        typeof node === 'object' &&
        'type' in node &&
        node.type === 'VariableDeclaration'
    );
}

export function isFunctionDeclaration(
    node: unknown,
): node is acorn.FunctionDeclaration {
    return (
        node !== null &&
        typeof node === 'object' &&
        'type' in node &&
        node.type === 'FunctionDeclaration'
    );
}

export function isClassDeclarationNode(
    node: unknown,
): node is acorn.ClassDeclaration {
    return (
        node !== null &&
        typeof node === 'object' &&
        'type' in node &&
        node.type === 'ClassDeclaration'
    );
}

export function isReturnStatementNode(
    node: unknown,
): node is acorn.ReturnStatement {
    return (
        node !== null &&
        typeof node === 'object' &&
        'type' in node &&
        node.type === 'ReturnStatement'
    );
}

export function isCallExpressionNode(
    node: unknown,
): node is acorn.CallExpression {
    return (
        node !== null &&
        typeof node === 'object' &&
        'type' in node &&
        node.type === 'CallExpression'
    );
}

export function isFunctionExpressionNode(
    node: unknown,
): node is acorn.FunctionExpression {
    return (
        node !== null &&
        typeof node === 'object' &&
        'type' in node &&
        node.type === 'FunctionExpression'
    );
}

export function isNodeWithBodySingle(
    node: acorn.Node,
): node is acorn.Node & { body: AllNodes } {
    return (
        typeof node === 'object' &&
        'body' in node &&
        !Array.isArray(node.body) &&
        node.body !== null
    );
}

export function isNodeWithName(
    node: acorn.Node,
): node is acorn.Node & { name: string } {
    return (
        typeof node === 'object' &&
        'name' in node &&
        typeof node.name === 'string' &&
        node.name !== null
    );
}

export function isNodeWithBodyArray(
    node: acorn.Node,
): node is acorn.Node & { body: AllNodes[] } {
    return (
        typeof node === 'object' &&
        'body' in node &&
        Array.isArray(node.body) &&
        node.body !== null
    );
}

export function isNodeWithExpression(
    node: acorn.Node,
): node is acorn.Node & { expression: AllNodes } {
    return (
        typeof node === 'object' &&
        'expression' in node &&
        node.expression !== null
    );
}

export function isNodeWithId(
    node: acorn.Node,
): node is acorn.Node & { id: acorn.Node } {
    return typeof node === 'object' && 'id' in node && node.id !== null;
}

export function isNodeWithDeclarations(
    node: acorn.Node,
): node is acorn.Node & { declarations: AllNodes[] } {
    return (
        typeof node === 'object' &&
        'declarations' in node &&
        node.declarations !== null
    );
}

export function isNodeWithDeclaration(
    node: acorn.Node,
): node is acorn.Node & { declaration: AllNodes } {
    return (
        typeof node === 'object' &&
        'declaration' in node &&
        node.declaration !== null
    );
}

function isNodeWithArguments(
    node: acorn.Node,
): node is acorn.Node & { arguments: AllNodes[] } {
    return (
        typeof node === 'object' &&
        'arguments' in node &&
        node.arguments !== null
    );
}

export function isNodeWithArgument(
    node: acorn.Node,
): node is acorn.Node & { argument: AllNodes } {
    return (
        typeof node === 'object' && 'argument' in node && node.argument !== null
    );
}

export function isNodeWithElements(
    node: acorn.Node,
): node is acorn.Node & { elements: AllNodes[] } {
    return (
        typeof node === 'object' && 'elements' in node && node.elements !== null
    );
}

export type AllNodes =
    | acorn.AnyNode
    | JSXElement
    | JSXOpeningElement
    | JSXClosingElement
    | acorn.VariableDeclarator
    | acorn.Pattern;

/**
 * Returns the name of a hook being called in a CallExpression or
 * null if the node is not a hook call
 * @param node
 * @returns
 */
export function getHookCall(node: AllNodes): string | null {
    if (node.type === 'CallExpression') {
        if (
            isNodeWithName(node.callee) &&
            node.callee.name?.startsWith('use')
        ) {
            return node.callee.name;
        }
    }
    return null;
}

export function getDescriptionOfNode(node: AllNodes): string {
    let final: string = node.type;

    switch (node.type) {
        case 'Program':
            switch (node.sourceType) {
                case 'module':
                    final = 'Module';
                    break;
                case 'script':
                    final = 'Script';
                    break;
                default:
                    final = 'Program';
                    break;
            }
            break;

        case 'ClassDeclaration':
            final = `📚 ${node.id?.name || 'anonymous'}`;
            break;
        case 'JSXElement':
            final = `<> ${node.openingElement.name}`;
            break;
        case 'CallExpression':
            final = getDescriptionOfNode(node.callee);
            break;
        case 'Identifier':
            final = node.name;
            break;
        case 'MemberExpression':
            final = `┝ ${getDescriptionOfNode(
                node.object,
            )}.${getDescriptionOfNode(node.property)}`;
            break;
        case 'ExpressionStatement':
            final = `${getDescriptionOfNode(node.expression)}${
                node.directive ? ` [${node.directive}]` : ''
            }`;
            break;
        case 'ImportExpression':
            final = `import(${getDescriptionOfNode(node.source)})`;
            break;
        case 'ImportDeclaration':
            final = `import ${node.specifiers
                .map(n => getDescriptionOfNode(n))
                .join(', ')} from ${getDescriptionOfNode(node.source)}`;
            break;
        case 'FunctionDeclaration':
            final = `ƛ ${
                node.id
                    ? getDescriptionOfNode(node.id) || 'anonymous'
                    : 'anonymous'
            }`;
            break;
        case 'Literal':
            final =
                node?.value?.toString() || node?.raw?.toString() || 'Literal';
            break;
        case 'BlockStatement':
            final = `{`;
            break;
        case 'ExportNamedDeclaration':
            if (node.specifiers && node.specifiers.length > 0) {
                final = `export {${node.specifiers
                    .map(n => getDescriptionOfNode(n))
                    .join(', ')}}`;
            } else if (node.declaration) {
                final = `export ${getDescriptionOfNode(node.declaration)}`;
            } else if (node.source) {
                final = `export * from ${getDescriptionOfNode(node.source)}`;
            } else {
                final = 'export';
            }
            break;
        case 'ArrayPattern':
            final = `[${node.elements
                .filter((n): n is acorn.Pattern => !!n)
                .map(n => getDescriptionOfNode(n))
                .join(', ')}]`;
            break;
        case 'VariableDeclarator':
            final = `${getDescriptionOfNode(node.id)} = ${
                node.init ? getDescriptionOfNode(node.init) : 'undefined'
            }`;
            break;
        case 'VariableDeclaration':
            final = `${node.kind} ${node.declarations
                .map(n => getDescriptionOfNode(n))
                .join(', ')}`;
            break;
        case 'ImportSpecifier':
            final = getDescriptionOfNode(node.imported);
            break;
        case undefined:
            final = '';
            break;
    }

    return final;
}

export function printTree(node: AllNodes, indent = 0) {
    console.log(' '.repeat(indent) + getDescriptionOfNode(node));

    crawl(node, (node, path) => {
        console.log(
            ' '.repeat(indent + path.length) + getDescriptionOfNode(node),
        );
    });
}

export type CrawlCallback = (node: AllNodes, path: AllNodes[]) => void;

export function crawl(
    node: AllNodes,
    callback: CrawlCallback,
    path: AllNodes[] = [],
) {
    if (node === null) {
        return;
    }

    const newPath = [...path, node];
    callback(node, newPath);

    if (isNodeWithBodyArray(node)) {
        node.body.forEach(child => crawl(child, callback, newPath));
    }

    if (isNodeWithBodySingle(node)) {
        crawl(node.body, callback, newPath);
    }

    if (isNodeWithDeclaration(node)) {
        crawl(node.declaration, callback, newPath);
    }

    // if (isNodeWithDeclarations(node)) {
    //     node.declarations.forEach(child => crawl(child, callback, newPath));
    // }

    if (isNodeWithId(node)) {
        crawl(node.id, callback, newPath);
    }

    if (isNodeWithExpression(node)) {
        crawl(node.expression, callback, newPath);
    }

    if (isNodeWithArguments(node)) {
        node.arguments.forEach(child => crawl(child, callback, newPath));
    }

    if (isNodeWithArgument(node)) {
        crawl(node.argument, callback, newPath);
    }

    if (isNodeWithElements(node)) {
        node.elements.forEach(child => crawl(child, callback, newPath));
    }
}

/**
 * Returns all return statements in a function (that are not nested)
 * @param node
 * @returns
 */
export function getReturnStatements(node: AllNodes): acorn.ReturnStatement[] {
    const returnStatements: acorn.ReturnStatement[] = [];
    if (isFunctionDeclaration(node)) {
        crawl(node, (node, path) => {
            // Make sure we're in the function body and not a nested function
            if (path.filter(n => isFunctionDeclaration(n)).length === 1) {
                if (isReturnStatementNode(node)) {
                    returnStatements.push(node);
                }
            }
        });
    }
    return returnStatements;
}

/**
 * Returns all return values in a function (that are not nested)
 * @param node
 * @returns
 */
export function getReturnValues(
    node: AllNodes,
): (acorn.Expression | JSXElement)[] {
    if (!isFunctionDeclaration(node)) {
        throw new Error('Node is not a function declaration');
    }

    const returnStatements = getReturnStatements(node);
    const returnValues: acorn.Expression[] = [];
    returnStatements.forEach(returnStatement => {
        if (isNodeWithArgument(returnStatement)) {
            returnValues.push(returnStatement.argument);
        }
    });
    return returnValues;
}

export function getVariableDeclarations(
    node: AllNodes,
    options: NodeFilterOptions,
): acorn.VariableDeclaration[] {
    const declarations: acorn.VariableDeclaration[] = [];
    crawl(node, (node, path) => {
        if (node.type === 'VariableDeclaration') {
            if (checkFilter(node, path, options)) {
                declarations.push(node);
            }
        }
    });
    return declarations;
}

/**
 * Parse a file and output information about it
 * @param {string} file
 */
export function parseFile(file: string) {
    // @ts-expect-error tsPlugin doesn't have the proper types and I don't know how to fix it
    return acorn.Parser.extend(tsPlugin()).parse(
        fs.readFileSync(file, 'utf8'),
        {
            sourceType: 'module',
            ecmaVersion: 'latest',
            locations: true,
        },
    );
}

export function getFunctionCalls(
    node: AllNodes,
    options: NodeFilterOptions,
): acorn.CallExpression[] {
    const calls: acorn.CallExpression[] = [];
    crawl(node, (node, path) => {
        if (isCallExpressionNode(node)) {
            if (checkFilter(node, path, options)) {
                calls.push(node);
            }
        }
    });
    return calls;
}

/**
 * Returns all exported names in a file
 * @param node
 * @returns
 */
export function getExportedNames(
    node: AllNodes,
    options?: NodeFilterOptions,
): acorn.ExportNamedDeclaration[] {
    const exports: acorn.ExportNamedDeclaration[] = [];
    crawl(node, (node, path) => {
        if (node.type === 'ExportNamedDeclaration') {
            if (checkFilter(node, path, options)) {
                exports.push(node);
            }
        }
    });
    return exports;
}

/**
 * Returns true if the given path contains an export
 * @param path
 * @returns
 */
export function isExported(path: AllNodes[]): boolean {
    return path.some(node => node.type === 'ExportNamedDeclaration');
}

/**
 * Evaluates the given node and path to ensure that it matches the given filter options
 * @param node
 * @param path
 * @param options
 * @returns
 */
export function checkFilter(
    node: AllNodes,
    path: AllNodes[],
    options?: NodeFilterOptions,
) {
    if (
        typeof options?.isExported !== 'undefined' &&
        options.isExported !== isExported(path)
    ) {
        return false;
    }

    return true;
}

/**
 * Returns all function declarations in a file
 * @param node
 * @param options
 * @returns
 */
export function getClassDeclarations(
    node: AllNodes,
    options: NodeFilterOptions,
): acorn.ClassDeclaration[] {
    const classes: acorn.ClassDeclaration[] = [];
    crawl(node, (node, path) => {
        if (isClassDeclarationNode(node)) {
            if (checkFilter(node, path, options)) {
                classes.push(node);
            }
        }
    });
    return classes;
}

export function getImportDeclarations(node: AllNodes) {
    const imports: acorn.ImportDeclaration[] = [];
    crawl(node, node => {
        if (node.type === 'ImportDeclaration') {
            imports.push(node);
        }
    });
    return imports;
}
