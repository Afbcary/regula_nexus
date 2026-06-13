import { Anchor, Flex, Text, ActionIcon, Tooltip } from '@mantine/core';


export default function Title({ mobile }) {
    if (mobile) {
        return (
            <>
                <Flex justify="space-between" align="center" mb="xs">
                    <Text fw={600} mb={0}>Regula Nexus</Text>
                </Flex>
                <Text size="xs" mb='xs'>
                    A dynamic adaptation of the{' '}
                    <Anchor href="https://usaultimate.org/rules/" target="_blank">
                        USAU official rulebook
                    </Anchor>
                    {' '}plus other rulesets.
                </Text>
            </>
        );
    }

    return (
        <div>
            <Text fw={600} mt="md" mb="md" style={{ margin: 0 }}>Regula Nexus</Text>
            <Text size="sm" mb="md" mt="xs">
                A dynamic adaptation of the{' '}
                <Anchor href="https://usaultimate.org/rules/" target="_blank">
                    USAU official rulebook
                </Anchor>
                {' '}plus other rulesets.
            </Text>
        </div>
    );
}
