import React, { PropsWithChildren } from "react";
import { Box, Text } from "ink";
import { isIterator, isIteratorEmpty } from "../types";

export function Section(props: PropsWithChildren<{title: string, emptyMessage: string}>) {
    const showChildren = props.children && (isIterator(props.children) ? !isIteratorEmpty(props.children) : true)
    return (
        <Box padding={1} flexDirection={"column"} borderStyle={'single'}>
            <Box marginBottom={1} >
                <Text color="blue">{props.title}</Text>
            </Box>
            {showChildren ? props.children : <Text>{props.emptyMessage}</Text>}
        </Box>
    )
}
