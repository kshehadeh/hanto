import { Project } from "@hanto/core";
import { PropsWithChildren } from "react";
import { ProjectHeader } from "./ProjectHeader";
import { Box } from "ink";

export function ProjectLayout({project, children}: PropsWithChildren<{project: Project}>) {
    return (
        <Box flexDirection="column" gap={1}>
            <ProjectHeader project={project} />

            {children}
        </Box>        
    )
}