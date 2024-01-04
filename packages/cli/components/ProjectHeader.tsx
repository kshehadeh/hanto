import { Project } from '@hanto/core';
import { Box, Text } from 'ink';
import { PropertyView } from './PropertyView';
import { H1 } from './h1';

export function ProjectHeader({ project }: { project: Project }) {
    return (
        <Box flexDirection="column" gap={1}>
            <H1>Project: {project.config?.name || '<No Name>'}</H1>

            <Box flexDirection="row" flexWrap="wrap">
                <PropertyView
                    property="Description"
                    value={project.config?.description ?? 'Unknown'}
                />
                <PropertyView property="Directory" value={project.dir} />
            </Box>
        </Box>
    );
}
