import { readFileSync } from 'fs';
import { z, type ZodIssue } from 'zod';
import { parse } from './generated-parser';
import { AstSchema, type Ast } from '../compiler/types';
import chalk from 'chalk';

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
        return `Invalid type: Path: ${chalk.bold(path)} > Expected ${issue.expected} but received ${issue.received}`;
    }

    if (issue.code === 'invalid_union') {
        return `Invalid union: Path: ${chalk.bold(path)} > Union Issues: \n${indent}${issue.unionErrors
            .flatMap(f => f.issues)
            .map(i => getParseErrorMessage(i, indent))
            .join(`\n${indent}`)}`;
    }

    if (issue.code === 'invalid_enum_value') {
        return `Invalid enum value: Path: ${chalk.bold(path)} > Received "${issue.received}" but options are "${issue.options.join(', ')}"`;
    }

    if (issue.code === 'invalid_literal') {
        return `Invalid literal: Path: ${chalk.bold(path)} > Expected "${issue.expected}" but received "${issue.received}"`;
    }

    if (issue.code === 'invalid_arguments') {
        return `Invalid arguments: Path: ${chalk.bold(path)} > \n${indent}${issue.argumentsError.issues.join(`\n${indent}`)}`;
    }

    if (issue.code === 'invalid_return_type') {
        return `Invalid return type: Path: ${chalk.bold(path)} > \n${indent}${issue.returnTypeError.issues.join(`\n${indent}`)}`;
    }

    if (issue.code === 'invalid_date') {
        return `Invalid date: Path: ${chalk.bold(path)} > ${issue.message}`;
    }

    if (issue.code === 'invalid_string') {
        return `Invalid string: Path: ${chalk.bold(path)} > ${issue.message}`;
    }

    if (issue.code === 'too_small') {
        return `Too small: Path: ${chalk.bold(path)} > Minimum is "${issue.minimum}"`;
    }

    if (issue.code === 'too_big') {
        return `Too big: Path: ${chalk.bold(path)} > Maximum is "${issue.maximum}"`;
    }

    if (issue.code === 'invalid_intersection_types') {
        return `Invalid intersection types: Path: ${chalk.bold(path)} > ${issue.message}`;
    }

    if (issue.code === 'not_multiple_of') {
        return `Not multiple of: Path: ${chalk.bold(path)} > Should be multiple of "${issue.multipleOf}"`;
    }

    if (issue.code === 'not_finite') {
        return `Not finite: Path: ${chalk.bold(path)} > ${issue.message}`;
    }

    if (issue.code === 'unrecognized_keys') {
        return `Unrecognized keys: Path: ${chalk.bold(path)} > Keys: ${issue.keys.join(' + ')}`;
    }

    if (issue.code === 'custom') {
        return `Custom: Path: ${chalk.bold(path)} > ${issue.message}`;
    }

    return JSON.stringify(issue);
}

export function parseString(text: string): Ast | null {
    const ast = parse(text);
    const result = AstSchema.safeParse(ast);
    if (result.success === false) {
        console.log(
            `\n${chalk.underline('Invalid AST Received From Parser')}: \n${result.error.issues
                .map(
                    i =>
                        `${i.fatal ? chalk.red('fatal') : chalk.yellow('error')}: ${chalk.red(getParseErrorMessage(i))}`,
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

// console.log(JSON.stringify(parseString('<color name="red">Hello</color>'), null, 2))
// console.log(JSON.stringify(parseString('<bold>Hello</bold>'), null, 2))
// console.log(JSON.stringify(parseString('Hello'), null, 2))
