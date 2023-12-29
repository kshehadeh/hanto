import { ILoader, IProject } from '@/shared';
import { Project } from '@/project/project';

const cachedProjects: Project[] = [];

export async function loadProject(
    path: string,
    loaders: ILoader[],
): Promise<IProject> {
    const project = new Project(path);

    await Promise.all(loaders.map(loader => project.addLoader(loader)));

    cachedProjects.push(project);

    await project.load();

    return project;
}

export async function getProjects() {
    return cachedProjects;
}
