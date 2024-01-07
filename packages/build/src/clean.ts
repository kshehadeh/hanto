import fs from 'fs'
export function clean(target?: string | string[]) {
    if (!target) {
        target = ['bun', 'node', 'browser']
    } else if (typeof target === 'string') {
        target = [target]
    }

    target.forEach((t) => {
        fs.rmdirSync(`./dist/${t}`, { recursive: true })
    })    
}