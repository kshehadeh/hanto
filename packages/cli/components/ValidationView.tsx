import { Project } from "@hanto/core";
import { ProjectLayout } from "./ProjectLayout";
import { H2 } from "./h2";

export function ValidationView ({project} : {project: Project}) {
    return (
        <ProjectLayout project={project}>
            <H2>Rules</H2>
        </ProjectLayout>
    )
}   