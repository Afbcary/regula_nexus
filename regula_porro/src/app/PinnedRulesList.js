
import Rule, { findRule } from './rule.js';
import { ActionIcon, Card, Group, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

export default function PinnedRulesList({ hideTitle = false, pinnedRules, rules, expand_annotations, togglePin }) {
    return (
        <>
            {!hideTitle && <Text size="sm" mb={4}>Pinned Rules</Text>}
            {pinnedRules.length === 0 && <Text size="xs" c="dimmed">No rules pinned yet.</Text>}
            {pinnedRules.map((ruleId) => {
                const rule = findRule(rules, ruleId);
                if (!rule) return null;
                return (
                    <Card key={ruleId} shadow="sm" padding="xs" radius="md" withBorder style={{ width: '100%', marginBottom: '8px' }}>
                        <Group align="flex-start" wrap="nowrap" gap="xs">
                            <ActionIcon variant="subtle" color="red" onClick={() => togglePin(ruleId)} mt={4}>
                                <IconX size={16} />
                            </ActionIcon>
                            <Rule rule={rule} expand_annotations={expand_annotations} rules={rules} pinnedRules={pinnedRules} togglePin={togglePin} showPin={false} indent={"0"} />
                        </Group>
                    </Card>
                );
            })}
        </>
    );
}
