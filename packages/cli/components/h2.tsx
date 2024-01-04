import { Box, Text } from 'ink';
import { PropsWithChildren } from 'react';

export function H2({ children }: PropsWithChildren) {
    return (
        <Box borderBottom={true} borderStyle={'single'} borderTop={false} borderLeft={false} borderRight={false}>
            <Text bold>{children}</Text>
        </Box>
    );
}
