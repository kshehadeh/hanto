import { Box, Text } from 'ink';
import { Project } from '@hanto/core';
import { LoaderView } from './LoaderView';
import { RuleView } from './RuleView';
import { ProjectLayout } from './ProjectLayout';
import { H2 } from './h2';

export function ProjectView({ project }: { project: Project }) {
    return (
        <ProjectLayout project={project}>            
            <Box flexDirection="column">
                <H2>Loaders</H2>                
                <Box flexDirection="column">
                    {project.loaders.map(loader => (
                        <LoaderView key={loader.name} loader={loader} isHorizontal={true} />
                    ))}
                </Box>
            </Box>

            <Box flexDirection="column">
                <H2>Rules</H2>                
                <Box flexDirection="column">
                    {project.validator.rules.map(rule => (
                        <RuleView key={rule.name} rule={rule} isHorizontal={true} />
                    ))}
                </Box>
            </Box>
        </ProjectLayout>
    );
}
