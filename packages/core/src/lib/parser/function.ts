import { ClassMethod, FunctionDeclaration, ReturnStatement } from "@swc/core";
import { Base, extractName, isClassMethod, isFunctionDeclaration, isReturnStatement } from "./base";

export class Function extends Base<FunctionDeclaration | ClassMethod> {

    get name() {
        if (isClassMethod(this._top)) {
            return extractName(this._top.key)
        }        
        if (isFunctionDeclaration(this._top)) {
            return this._top.identifier.value
        }        
    }

    get parameters() {
        if (isFunctionDeclaration(this._top)) {
            return this._top.params
        }

        if (isClassMethod(this._top)) {
            return this._top.function.params
        }

        return []
    }

    get body() {
        if (isFunctionDeclaration(this._top)) {
            return this._top.body
        }

        if (isClassMethod(this._top)) {
            return this._top.function.body
        }
    }

    get returns() {
        const body = this.body
        if (!body) return []

        const statements: ReturnStatement[] = []
        this.crawl(body, (node) => {
            if (isReturnStatement(node)) {
                statements.push(node)
                return false // We don't want to continue crawling this branch
            }
            return true // We want to continue crawling this branch
        })
        return statements
    }
}