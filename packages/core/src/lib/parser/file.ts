import path from 'path';
import { ClassDeclaration, ExportDeclaration, ExportDefaultDeclaration, FunctionDeclaration, ImportDeclaration, JscTarget, Module, Script, parseFileSync } from '@swc/core';
import { Base, ParserError, isAnyJsxType, isClassDeclaration, isFunctionDeclaration, isIdentifier, isImportDeclaration, isModule, isParserError } from './base';
import { argv } from 'bun';
import { Function } from './function';
import { Class } from './class';
import { ImportStatement } from './import';

export interface ImportTree {
    [source: string]: {
        subfile: File
        [source: string]: File | null
    } | null
}

export class File extends Base<Module|Script> {
    _file: string;    
    _errors: ParserError[] = []

    constructor(file: string) {
        super(undefined)
        this._file = file        
        this._top = this.parse(file)
    }

    public parse(file: string, target: JscTarget = 'esnext') {
        const isTypescript = path.extname(file).startsWith('.ts')
        const isX = ['.jsx', '.tsx'].includes(path.extname(file))

        try {
            return parseFileSync(file, {
                syntax: isTypescript ? 'typescript' : 'ecmascript',
                target,
                tsx: isX && isTypescript,
                jsx: isX && !isTypescript,
                dynamicImport: true,
                decorators: true,
            })    
        } catch (error) {
            if (!isParserError(error)) throw error            
            this._errors.push(error)
        }

        return undefined
    }

    public get errors() {
        return this._errors
    }

    public get imports(): ImportDeclaration[] {
        if (!this._top) return []
        return this._top.body.filter(isImportDeclaration) as ImportDeclaration[]
    }

    public get exports(): ExportDeclaration[] {
        if (!this._top) return []
        if (isModule(this._top)) {
            return this._top.body.filter((node): node is ExportDeclaration => node.type === 'ExportDeclaration')
        }
        return []        
    }

    public get exportsDefault(): ExportDefaultDeclaration | undefined {
        if (!this._top) return undefined
        if (isModule(this._top)) {
            return this._top.body.find((node): node is ExportDefaultDeclaration => node.type === 'ExportDefaultDeclaration')
        }
        return undefined
    }

    public get classes(): ClassDeclaration[] {
        if (!this._top) return []

        const privatelyDeclaredClasses = this._top.body.filter(isClassDeclaration) as ClassDeclaration[]
        const exportedClasses = this.exports.filter((node) => isClassDeclaration(node.declaration)).map((node) => node.declaration as ClassDeclaration)
        const exportedDefaultClass = isClassDeclaration(this.exportsDefault?.decl) ? this.exportsDefault.decl : undefined
        
        return [...exportedClasses, ...privatelyDeclaredClasses, exportedDefaultClass].filter(isClassDeclaration)
    }

    public functions(): FunctionDeclaration[] {
        if (!this._top) return []
        return this._top.body.filter(isFunctionDeclaration) as FunctionDeclaration[]
    }

    public getImportTree() {
        const tree: ImportTree = {}
        this.imports.forEach((node) => {
            const imp = new ImportStatement(node)
            const resolvedFile = imp.resolve({ filePath: this._file })
            if (resolvedFile) {
                const subfile = new File(resolvedFile)                
                tree[imp.source] = {
                    subfile, 
                    ...subfile.getImportTree()
                }
            } else {
                tree[imp.source] = null
            }
        })
        return tree
    }

    /**
     * Returns all React components in the file. A component is either a function or a class
     */
    public get components(): (FunctionDeclaration | ClassDeclaration)[] {
        if (!this._top) return []
        
        const functionComponents =  this.functions().filter((node) => {

            // We determine that a function is a function component if it 
            //  returns JSX            
            const f = new Function(node);
            f.returns.forEach((node) => {
                if (isAnyJsxType(node.argument)) {
                    return true                    
                }
            })
            return false
        })

        const classComponents = this.classes.filter((node) => {

            // We determine that a class is a class component if it has 
            //  a render method that returns JSX

            const c = new Class(node)
            const renderFunction = c.methods.find((node) => {
                isIdentifier(node.key) && node.key.value === 'render'
            })

            if (!renderFunction) return false
            
            const f = new Function(renderFunction)
            f.returns.forEach((node) => {
                if (isAnyJsxType(node.argument)) {
                    return true                    
                }
            })
        })

        return [...functionComponents, ...classComponents]
    }

}

