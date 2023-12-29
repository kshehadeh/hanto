import { ILoader } from '@/shared';
import { Project } from '@/project/project';

export { default as npmLoader } from './loaders/npm';
export { default as typescriptLoader } from './loaders/typescript';

const cachedProjects: Project[] = [];

export async function loadProject(
    path: string,
    loaders: ILoader[],
): Promise<Project> {
    const project = new Project(path);

    await Promise.all(loaders.map(loader => project.addLoader(loader)));

    cachedProjects.push(project);

    await project.load();

    return project;
}

export async function getProjects() {
    return cachedProjects;
}
