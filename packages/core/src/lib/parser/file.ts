import path from 'path';
import fs from 'fs';
import { ExportNamedDeclaration, ClassDeclaration, ExportDeclaration, ExportDefaultDeclaration, FunctionDeclaration, ImportDeclaration, File as BabelFile} from '@babel/types';
import { Base, ParserError, isAnyJsxType, isClassDeclaration, isFunctionDeclaration, isIdentifier, isImportDeclaration, isModule, isParserError } from './base';
import { parseSync } from '@babel/core';
import { Function } from './function';
import { Class } from './class';
import { ImportStatement } from './import';

export type ParseTarget = 'javascript' | 'typescript'

export interface ImportTree {
    [source: string]: {
        subfile: File
        [source: string]: File | null
    } | null
}

export class File extends Base<BabelFile> {
    _file: string;    
    _errors: ParserError[] = []

    constructor(file: string) {
        super(undefined)
        this._file = file        
        this._top = this.parse()
    }

    public parse() {
        // Load file into a string
        const fileContent = fs.readFileSync(this._file, 'utf8')

        try {
            return parseSync(fileContent, {
                ast: true,
                filename: this._file,
                presets: [
                    '@babel/preset-react',
                    '@babel/preset-typescript',
                    '@babel/preset-env',
                ],
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
        return this._top.program.body.filter(isImportDeclaration) as ImportDeclaration[]
    }

    public get exports(): ExportDeclaration[] {
        if (!this._top) return []
        if (isModule(this._top)) {
            return this._top.program.body.filter((node): node is ExportNamedDeclaration => node.type === 'ExportNamedDeclaration')
        }
        return []        
    }

    public get exportsDefault(): ExportDefaultDeclaration | undefined {
        if (!this._top) return undefined
        if (isModule(this._top)) {
            return this._top.program.body.find((node): node is ExportDefaultDeclaration => node.type === 'ExportDefaultDeclaration')
        }
        return undefined
    }

    public get classes(): ClassDeclaration[] {
        if (!this._top) return []

        const privatelyDeclaredClasses = this._top.program.body.filter(isClassDeclaration) as ClassDeclaration[]
        const exportedClasses = this.exports.filter(isClassDeclaration)
        const exportedDefaultClass = isClassDeclaration(this.exportsDefault?.declaration) ? this.exportsDefault.declaration : undefined
        
        return [...exportedClasses, ...privatelyDeclaredClasses, exportedDefaultClass].filter(isClassDeclaration)
    }

    public functions(): FunctionDeclaration[] {
        if (!this._top) return []
        return this._top.program.body.filter(isFunctionDeclaration) as FunctionDeclaration[]
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
                isIdentifier(node.key) && node.key.name === 'render'
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

// const file = new File('./index.ts')
// const result = file.parse()
// console.log(file.exports)
