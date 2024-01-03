import { Box, Text } from 'ink';
import { Property, Rule } from '@hanto/core';
import { LoaderPropertyView, PropertyView } from './PropertyView';

export function RuleView({ rule, isHorizontal=true }: { rule: Rule, isHorizontal: boolean }) {    
    return (
        <Box flexDirection="column" padding={1}>
            <Box borderStyle={'round'} borderBottom={true} borderTop={false} borderRight={false} borderLeft={false} borderColor={'blackBright'} gap={1}>
                <Text bold>Rule: {rule.name}</Text>            
                {rule.description && <Text color={"gray"}>({rule.description})</Text>}
            </Box>

            <Box flexDirection={isHorizontal ? "row" : "column"} flexWrap="wrap">                                                
                <PropertyView property={"Active"} value={rule.active.toString()} isStacked={isHorizontal} />                
            </Box>
        </Box>
    );
}
