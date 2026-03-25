
import Rule, { findRule } from './rule.js';
import { ActionIcon, Card, Group, Text, Flex, Button, CopyButton } from '@mantine/core';
import { IconX, IconShare, IconCheck, IconTrash } from '@tabler/icons-react';
import { useState, useEffect } from 'react';

export default function PinnedRulesList({ hideTitle = false, pinnedRules, rules, expand_annotations, togglePin, clearPinned }) {
    const [shareUrl, setShareUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setShareUrl(`${window.location.origin}${window.location.pathname}?pinned=${pinnedRules.join(',')}`);
        }
    }, [pinnedRules]);

    return (
        <>
            <Flex justify={hideTitle ? "flex-end" : "space-between"} align="center" mb={hideTitle ? 12 : 4}>
                {!hideTitle && <Text size="sm" mb={0}>Pinned Rules</Text>}
                {pinnedRules.length > 0 && shareUrl && (
                    <Group gap="xs">
                        <CopyButton value={shareUrl} timeout={2000}>
                            {({ copied, copy }) => (
                                <Button
                                    size="xs"
                                    variant="light"
                                    color={copied ? "teal" : "blue"}
                                    onClick={copy}
                                    leftSection={copied ? <IconCheck size={14} /> : <IconShare size={14} />}
                                >
                                    {copied ? 'Copied URL' : 'Share'}
                                </Button>
                            )}
                        </CopyButton>
                        <Button
                            size="xs"
                            variant="light"
                            color="red"
                            onClick={clearPinned}
                            leftSection={<IconTrash size={14} />}
                        >
                            Unpin All
                        </Button>
                    </Group>
                )}
            </Flex>
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
