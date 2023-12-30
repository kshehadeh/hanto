import { argv } from "bun"
import { File } from "./file"

export function parse(file: string) {
    return new File(file)
}

if (import.meta.main) {
    let parsedFile: File
    if (argv.length < 3) {
        console.log("Usage: parse(index) <file>")
    } else {
        parsedFile = parse(argv[2])
        const tree = parsedFile.getImportTree()
        console.log(tree)
        // parser.imports.forEach((node) => {
        //     const stmt = new ImportStatement(node)
        //     const p = stmt.resolve({
        //         projectRoot: nearestProjectRoot(argv[2]),
        //         filePath: argv[2]
        //     })

        //     console.log(p)
        // })
        
        // parser.dump()

        // console.log('*******\nCLASSES*********')
        // parser.classes.forEach((node) => {
        //     console.log(node)
        // })

        // console.log('*******\nIMPORTS*********')
        // parser.imports.forEach((node) => {
        //     console.log(node)
        // })
    }        
}

