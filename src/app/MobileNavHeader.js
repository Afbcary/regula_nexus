'use client'

import { Anchor, Button, Switch, Text, Drawer, ActionIcon, Flex } from '@mantine/core';
import { IconPin, IconSettings } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import ColorTheme from './colorTheme.js';

export default function MobileNavHeader({ pinnedRules, toggleDrawer, setExpandAnnotations, expand_annotations, includeWul, handleWulToggle, includePul, handlePulToggle }) {

    const [isShaking, setIsShaking] = useState(false);
    const prevPinnedCount = useRef(pinnedRules?.length || 0);
    const [settingsOpened, { open: openSettings, close: closeSettings }] = useDisclosure(false);

    useEffect(() => {
        const currentCount = pinnedRules?.length || 0;
        if (currentCount > prevPinnedCount.current) {
            setIsShaking(true);
            const timer = setTimeout(() => setIsShaking(false), 500); // 0.5s matches CSS animation length
            prevPinnedCount.current = currentCount;
            return () => clearTimeout(timer);
        }
        prevPinnedCount.current = currentCount;
    }, [pinnedRules]);

    return (
        <>
            <Flex justify="space-between" align="center" mb="xs">
                <Text fw={600} mb={0}>USAU Rules</Text>
            </Flex>
            <Text size="xs" mb='xs'>
                A dynamic adaptation of the{' '}
                <Anchor href="https://usaultimate.org/rules/" target="_blank">
                    official rulebook
                </Anchor>
                .
            </Text>

            <ActionIcon variant="subtle" onClick={openSettings}>
                <IconSettings size={18} />
            </ActionIcon>
            <Button onClick={toggleDrawer} size="compact-xs" variant="default" mt="xs" mb="xs" className={isShaking ? 'shake' : ''}>
                <Text span size="xs" p={0} m={0}>View {' '}
                    <IconPin size={12} style={{ display: 'inline-flex', verticalAlign: 'middle' }} /></Text>
            </Button>

            <Drawer opened={settingsOpened} onClose={closeSettings} position="bottom" title="Settings">
                <Flex direction="column" gap="md">
                    <Flex direction="row" justify="flex-start" align="center" gap="md"><ColorTheme /><Text size='sm'>Color Theme</Text></Flex>
                    <Switch w="100%" styles={{ labelWrapper: { flex: 1, minWidth: 0 }, label: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' } }} label="Annotations" description="Expand or collapse all annotations. Annotations are clarification and examples of rule applications." size="sm" checked={expand_annotations} onChange={(event) => setExpandAnnotations(event.currentTarget.checked)} />
                    <Switch label="WUL" description="Show the Western Ultimate League rules" size="sm" checked={includeWul} onChange={handleWulToggle} />
                    <Switch label="PUL" description="Show the Premier Ultimate League rules" size="sm" checked={includePul} onChange={handlePulToggle} />
                    <Text size='xs'>The semi-pro rulesets are lightly edited for this format. For the official rules see the <Anchor href="https://westernultimateleague.com/rules" target="_blank">2026 WUL Third Edition Rule Book</Anchor> or <Anchor href="https://www.premierultimateleague.com/rulebook" target="_blank">PUL Competition Rules</Anchor>.</Text>
                </Flex>
            </Drawer>
        </>
    );
}