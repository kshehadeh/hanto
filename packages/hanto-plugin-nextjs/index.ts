import { Loader } from 'hanto-core';

class NextJsLoader extends Loader {
    private _startingFile: File | undefined  = undefined

    get name() {
        return 'nextjs';
    }

    get description() {
        return 'Reads and understands NextJS projects';
    }

    public constructor() {
        super([]);        
    }

    public initialize(projectId: string): boolean {
        super.initialize(projectId);

        const npmLoader = this.project?.getLoader('npm');
        if (!npmLoader) {
            this._errors.push({
                message: 'npm loader is required for nextjs loader',
            });

            return false;
        }

        return true;
    }

    public async load() {
        const project = this.project;
        if (!project) throw new Error('Loader not initialized');

        const npmLoader = project.getLoader('npm');
        if (!npmLoader) {
            throw new Error('npm loader is required for typescript loader');
        }
        
        return true;
    }
}

export default new NextJsLoader();
