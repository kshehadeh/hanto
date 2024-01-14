import z from 'zod';

export const IsFileTrackedOptionsSchema = z.object({
    relativePath: z.string().describe('The path to the file relative to the project root'),
}).describe('Options for the isFileTracked function');

export const IsFileTrackedResultSchema = z.boolean().describe('Returns true if the file is tracked by git, false otherwise.');

export default [
    {
        name: 'isFileTracked',
        description: 'Determine if a file is tracked by git',
        type: 'function',
        valueSchema: IsFileTrackedResultSchema,
        optionsSchema: IsFileTrackedOptionsSchema,
    },
    {
        name: 'isGitRepository',
        description: 'Determine if the project is a git repository',
        valueSchema: z.boolean().describe('Returns true if the project is a git repository, false otherwise.'),
    },
]