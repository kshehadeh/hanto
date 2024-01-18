import { readFileSync } from 'fs';
import { z, type ZodIssue } from 'zod';
import { parse } from './generated-parser';
import { AstSchema, type Ast } from '../compiler/types';

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

function getParseErrorMessage(issue: ZodIssue, indent = '  ') {
    const path = issue.path.join(' | ');
    // Generate a human readable error message from a Zod issue
    if (issue.code === 'invalid_type') {
        return `Invalid type: Path: ${path} > Expected ${issue.expected} but received ${issue.received}`;
    }

    if (issue.code === 'invalid_union') {
        return `Invalid union: Path: ${path} > Union Issues: \n${indent}${issue.unionErrors
            .flatMap(f => f.issues)
            .map(i => getParseErrorMessage(i, indent))
            .join(`\n${indent}`)}`;
    }

    if (issue.code === 'invalid_enum_value') {
        return `Invalid enum value: Path: ${path} > Received "${issue.received}" but options are "${issue.options.join(', ')}"`;
    }

    if (issue.code === 'invalid_literal') {
        return `Invalid literal: Path: ${path} > Expected "${issue.expected}" but received "${issue.received}"`;
    }

    if (issue.code === 'invalid_arguments') {
        return `Invalid arguments: Path: ${path} > \n${indent}${issue.argumentsError.issues.join(`\n${indent}`)}`;
    }

    if (issue.code === 'invalid_return_type') {
        return `Invalid return type: Path: ${path} > \n${indent}${issue.returnTypeError.issues.join(`\n${indent}`)}`;
    }

    if (issue.code === 'invalid_date') {
        return `Invalid date: Path: ${path} > ${issue.message}`;
    }

    if (issue.code === 'invalid_string') {
        return `Invalid string: Path: ${path} > ${issue.message}`;
    }

    if (issue.code === 'too_small') {
        return `Too small: Path: ${path} > Minimum is "${issue.minimum}"`;
    }

    if (issue.code === 'too_big') {
        return `Too big: Path: ${path} > Maximum is "${issue.maximum}"`;
    }

    if (issue.code === 'invalid_intersection_types') {
        return `Invalid intersection types: Path: ${path} > ${issue.message}`;
    }

    if (issue.code === 'not_multiple_of') {
        return `Not multiple of: Path: ${path} > Should be multiple of "${issue.multipleOf}"`;
    }

    if (issue.code === 'not_finite') {
        return `Not finite: Path: ${path} > ${issue.message}`;
    }

    if (issue.code === 'unrecognized_keys') {
        return `Unrecognized keys: Path: ${path} > Keys: ${issue.keys.join(' + ')}`;
    }

    if (issue.code === 'custom') {
        return `Custom: Path: ${path} > ${issue.message}`;
    }

    return JSON.stringify(issue);
}

export function parseString(text: string): Ast | null {
    const ast = parse(text);    
    const result = AstSchema.safeParse(ast);
    if (result.success === false) {
        console.log(
            `\n${'Invalid AST Received From Parser'}: \n${result.error.issues
                .map(
                    i =>
                        `${i.fatal ? 'fatal' : 'error'}: ${getParseErrorMessage(i)}`,
                )
                .join('\n')}`,
        );
        return null;
    }
    return ast;
}

export function parseFile(filename: string): z.infer<typeof AstSchema> {
    const fileContent = readFileSync(filename, 'utf8');
    return parseString(fileContent);
}

if (process.argv[1].includes('parser')) {
    console.log(JSON.stringify(parseString('<h1 margin="12" fg="red">HELLO</h1>'), null, 2))
    // console.log(JSON.stringify(parseString('<body bold=true>Hello</body>'), null, 2))
    // console.log(JSON.stringify(parseString('<body bold italics underline fg="red" bg="white">Hello</body>'), null, 2))

    // console.log(JSON.stringify(parseString('<color name="red">Hello</color>'), null, 2))
    // console.log(JSON.stringify(parseString('<bold>Hello</bold>'), null, 2))
    // console.log(JSON.stringify(parseString('Hello'), null, 2))
}
