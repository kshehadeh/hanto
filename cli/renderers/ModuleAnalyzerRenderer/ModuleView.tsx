import { Section } from '../../components/Section';
import { containers } from 'scribbler-lib';
import { Box, Text } from 'ink';

type Props = {
    module: containers.ModuleContainer;
}

export function ModuleView ({module}: Readonly<Props>) {
    return (
        <Box flexDirection={"column"}>
            <Text bold>{module.name}</Text>            

            <Box borderStyle={"single"} flexDirection={'row'}>
                <Box marginBottom={1} width={"50%"} flexDirection={'column'}>
                    <Text bold>Exported</Text>

                    <Section title={'Components'} emptyMessage={'No exported components found'}>
                    {module.exportedComponents.map(component => (
                        <Text key={component.name}>{component.name}</Text>
                    ))}
                    </Section>
                    <Section title={'Classes'} emptyMessage={'No exported classes found'}>
                    {module.exportedClasses.map(cls => (
                        <Text key={cls.name}>{cls.name}</Text>
                    ))}
                    </Section>
                    <Section title={'Functions'} emptyMessage={'No exported functions found'}>
                    {module.exportedFunctions.map(func => (
                        <Text key={func.name}>{func.name}</Text>
                    ))}
                    </Section>

                    <Section title={'Properties'} emptyMessage={'No exported propertioes found'}>
                    {module.exportedProperties.map(prop => (
                        <Text key={prop.name}>{prop.name}</Text>
                    ))}
                    </Section>
                    
                </Box>

                <Box marginBottom={1} width={"50%"}  flexDirection={'column'}>
                    <Text bold>Private</Text>

                    <Section title={'Components'} emptyMessage={'No private components found'}>
                    {module.privateComponents.map(component => (
                        <Text key={component.name}>{component.name}</Text>
                    ))}
                    </Section>
                    <Section title={'Classes'} emptyMessage={'No private classes found'}>
                    {module.privateClasses.map(cls => (
                        <Text key={cls.name}>{cls.name}</Text>
                    ))}
                    </Section>
                    <Section title={'Functions'} emptyMessage={'No private functions found'}>
                    {module.privateFunctions.map(func => (
                        <Text key={func.name}>{func.name}</Text>
                    ))}
                    </Section>
                    <Section title={'Properties'} emptyMessage={'No private propertioes found'}>
                    {module.privateProperties.map(prop => (
                        <Text key={prop.name}>{prop.name}</Text>
                    ))}
                    </Section>
                </Box>
            </Box>
        </Box>
    )
}