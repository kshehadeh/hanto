import { Loader } from '@hanto/core';
import { z } from 'zod';
import { runGit } from './lib/run-git';

export class GitLoader extends Loader {
    public constructor() {
        super([
            {
                name: 'isFileTracked',
                description: 'Determine if a file is tracked by git',
                type: 'function',
                valueSchema: z.string(),
                optionsSchema: z.object({
                    relativePath: z.string(),
                }),
            },
            {
                name: 'isGitRepository',
                description: 'Determine if the project is a git repository',
                valueSchema: z.boolean(),
            },
        ]);
    }

    get name(): string {
        return 'git';
    }
    get description(): string {
        return 'Reads and understands git repos';
    }

    get dependencies(): string[] {
        return [];
    }

    public async isFileTracked(relativePath: string): Promise<boolean> {
        const project = this.project;
        if (!project) throw new Error('Loader not initialized');
        if (!project.dir) throw new Error('Project dir not set');

        const result = await runGit(
            `ls-files --error-unmatch ${relativePath}`,
            project.dir,
        );
        return result === relativePath;
    }

    public async load() {
        const project = this.project;
        if (!project) throw new Error('Loader not initialized');
        if (!project.dir) throw new Error('Project dir not set');

        this.set('isFileTracked', this.isFileTracked.bind(this));

        const isGitRepo = await runGit(
            'rev-parse --is-inside-work-tree',
            project.dir,
        );
        this.set('isGitRepository', isGitRepo.trim() === 'true');

        return this.errors.length === 0;
    }
}
