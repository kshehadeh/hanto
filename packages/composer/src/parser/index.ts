import { readFileSync } from 'fs';
import { z } from 'zod';
import { parse } from './generated-parser';
import { AstSchema } from '../compiler/types';

// const ast: z.infer<typeof AstSchema> = [
//     {
//         node: 'color',
//         name: 'red',        
//         content: [{
//             node: 'text',
//             value: 'Hello'
//         }]
//     }
// ]

// const ast2: z.infer<typeof AstSchema> = [
//     {
//         node: 'color',
//         name: 'red',        
//         content: {
//             node: 'color',
//             name: 'blue',           
//         }
//     }
// ]

export function parseString(text: string): z.infer<typeof AstSchema> {
    const ast = parse(text);
    const result = AstSchema.safeParse(ast);
    if (result.success === false) {
        throw new Error(`Invalid AST: ${result.error.issues.map(i => i.message).join('\n')}`);
    }
    return ast;
}

export function parseFile(filename: string): z.infer<typeof AstSchema> {
    const fileContent = readFileSync(filename, 'utf8');
    return parseString(fileContent);
}

// console.log(JSON.stringify(parseString('<color name="red">Hello</color>'), null, 2))
// console.log(JSON.stringify(parseString('<bold>Hello</bold>'), null, 2))
// console.log(JSON.stringify(parseString('Hello'), null, 2))