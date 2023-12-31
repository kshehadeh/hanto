import { Box, Text } from 'ink';
import { Property } from 'scribbler-core';

export interface PropertyProps {
    property: string;
    value?: string;
    help?: string;
    isStacked?: boolean;    
}

export function LoaderPropertyView({property, ...rest} : Omit<PropertyProps, 'property' | 'value'> & {property: Property}) {
    const value = () => {
        if (typeof property.value === 'function') {
            return "<Bound Function>"
        } else {
            return property.value?.toString() ?? '<Undefined>'
        }
    }

    return <PropertyView property={property.name} value={value()} {...rest} />
}

export function PropertyView({
    property,
    value,
    help,
    isStacked = false,
}: {
    property: string;
    value?: string;
    help?: string;
    isStacked?: boolean;
}) {    
    return isStacked ? (
        <Box flexDirection="column" margin={1} justifyContent="flex-start" borderStyle={'single'} borderColor={'gray'} borderLeft={true} borderRight={false} borderBottom={false} borderTop={false}>
            <Text bold>{property}</Text>
            <Text color={"blue"}>{value || 'N/A'}</Text>
            <Text color={'gray'}>{help && `${help}`}</Text>
        </Box>
    ) : (
        <Box flexDirection="column" padding={1}>
            <Box flexDirection="row">
                <Text bold>{property}:</Text>
                <Box marginLeft={1}><Text color={"blue"}>{value || 'N/A'}</Text></Box>
            </Box>
            <Text color={'gray'}>{help && ` (${help})`}</Text>
        </Box>
    );
}
