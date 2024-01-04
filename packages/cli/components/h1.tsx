import { Box, Text } from 'ink';
import { PropsWithChildren } from 'react';

export function H1({ children }: PropsWithChildren) {
    return (
        <Box borderBottom={true} borderStyle={'double'} borderTop={false} borderLeft={false} borderRight={false}>
            <Text bold>{children}</Text>
        </Box>
    );
}
