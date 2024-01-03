import { Project } from "./project";

class Orchestrator {
    projects: Project[] = [];

    constructor() {
        this.projects = [];
    }

    add(project: Project) {
        this.projects.push(project);
    }

    project(projectId: string) {
        return this.projects.find(p => p.id === projectId);
    }
}

export default new Orchestrator();