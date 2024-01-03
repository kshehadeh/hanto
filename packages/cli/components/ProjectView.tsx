import { Box, Text } from 'ink';
import { Project } from '@hanto/core';
import { LoaderView } from './LoaderView';
import { PropertyView } from './PropertyView';
import { RuleView } from './RuleView';

export function ProjectView({ project }: { project: Project }) {
    return (
        <Box flexDirection="column" gap={1}>
            <Box borderStyle={'double'} borderBottom={true} borderTop={false} borderRight={false} borderLeft={false}>
                <Text bold>Project: {project.config?.name}</Text>
            </Box>

            <Box flexDirection="row" flexWrap="wrap">
                <PropertyView
                    property="Description"
                    value={project.config?.description ?? 'Unknown'}
                />
                <PropertyView property="Directory" value={project.dir} />
            </Box>
            <Box flexDirection="column">
                <Box borderStyle={'single'} borderBottom={true} borderTop={false} borderRight={false} borderLeft={false} >
                    <Text bold>Loaders</Text>
                </Box>
                <Box flexDirection="column">
                    {project.loaders.map(loader => (
                        <LoaderView key={loader.name} loader={loader} isHorizontal={true} />
                    ))}
                </Box>
            </Box>

            <Box flexDirection="column">
                <Box borderStyle={'single'} borderBottom={true} borderTop={false} borderRight={false} borderLeft={false} >
                    <Text bold>Rules</Text>
                </Box>
                <Box flexDirection="column">
                    {project.validator.rules.map(rule => (
                        <RuleView key={rule.name} rule={rule} isHorizontal={true} />
                    ))}
                </Box>
            </Box>
        </Box>
    );
}
