import { Project } from "./project";

class Orchestrator {
    projects: Project[] = [];

    constructor() {
        this.projects = [];
    }

    addProject(project: Project) {
        this.projects.push(project);
    }

    getProject(projectId: string) {
        return this.projects.find(p => p.id === projectId);
    }
    
    getProjectLoader(projectId: string, loaderName: string) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) throw new Error(`Project ${projectId} not found`);
        return project.getLoader(loaderName);
    }
}

export default new Orchestrator();