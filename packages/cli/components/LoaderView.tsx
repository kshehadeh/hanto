import { Box, Text } from 'ink';
import { Loader, Property } from '../../hanto-core';
import { LoaderPropertyView, PropertyView } from './PropertyView';

export function LoaderView({ loader, isHorizontal=true }: { loader: Loader, isHorizontal: boolean }) {    
    const values = Object.values<Property>(loader.properties);
    const numProps = values.length;
    return (
        <Box flexDirection="column" padding={1}>
            <Box borderStyle={'round'} borderBottom={true} borderTop={false} borderRight={false} borderLeft={false} borderColor={'blackBright'} gap={1}>
                <Text bold>Loader: {loader.name}</Text>            
                {loader.description && <Text color={"gray"}>({loader.description})</Text>}
            </Box>

            <Box flexDirection={isHorizontal ? "row" : "column"} flexWrap="wrap">                
                {numProps === 0 && <Text color={"gray"}>There are no properties defined for this loader</Text>}
                {numProps  > 0 && values.map(prop => (
                    <LoaderPropertyView key={prop.name} property={prop} help={prop.description} isStacked={isHorizontal} />
                ))}
            </Box>
        </Box>
    );
}
