'use client'

import { Anchor, Button, Switch, Text, Drawer, ActionIcon, Flex, CopyButton, Tooltip } from '@mantine/core';
import { IconHelp, IconPin, IconSettings, IconShare, IconCheck } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import ColorTheme from './colorTheme.js';
import Link from 'next/link';
import Title from './Title.js';

export default function MobileNavHeader({ pinnedRules, toggleDrawer, setExpandAnnotations, expand_annotations, includeWul, handleWulToggle, includePul, handlePulToggle, includeUfa, handleUfaToggle, shareUrl }) {

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
            <Title mobile />
            <Flex>
                <CopyButton value={shareUrl} timeout={2000}>
                    {({ copied, copy }) => (
                        <Tooltip label={copied ? "Copied!" : "Share Rules"}>
                            <ActionIcon variant="subtle" color={copied ? "teal" : "gray"} onClick={copy}>
                                {copied ? <IconCheck size={24} /> : <IconShare size={24} />}
                            </ActionIcon>
                        </Tooltip>
                    )}
                </CopyButton>
                <ActionIcon variant="subtle" onClick={openSettings}>
                    <IconSettings size={24} />
                </ActionIcon>
                <Tooltip label="About this site">
                    <ActionIcon component={Link} href="/about" variant="subtle" color="gray" >
                        <IconHelp size={24} />
                    </ActionIcon>
                </Tooltip>
            </Flex>
            <Button
                onClick={toggleDrawer}
                size="xs"
                variant="default"
                mt="xs"
                mb="xs"
                className={isShaking ? 'shake' : ''}
                rightSection={<IconPin size={16} />}
                style={{ height: "60px" }}
            >
                View
            </Button >
            <Drawer opened={settingsOpened} onClose={closeSettings} position="bottom" title="Settings">
                <Flex direction="column" gap="md">
                    <Flex direction="row" justify="flex-start" align="center" gap="md"><ColorTheme /><Text size='sm'>Color Theme</Text></Flex>
                    <Switch w="100%" styles={{ labelWrapper: { flex: 1, minWidth: 0 }, label: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' } }} label="Annotations" description="Expand or collapse all annotations. Annotations are clarification and examples of rule applications." size="sm" checked={expand_annotations} onChange={(event) => setExpandAnnotations(event.currentTarget.checked)} />
                    <Switch label="WUL" description="Show the Western Ultimate League rules" size="sm" checked={includeWul} onChange={handleWulToggle} />
                    <Switch label="PUL" description="Show the Premier Ultimate League rules" size="sm" checked={includePul} onChange={handlePulToggle} />
                    <Switch label="UFA" description="Show the Ultimate Frisbee Association rules" size="sm" checked={includeUfa} onChange={handleUfaToggle} />
                    <Text size='xs'>The semi-pro rulesets are lightly edited for this format. For the official rules see the <Anchor href="https://westernultimateleague.com/rules" target="_blank">2026 WUL Third Edition Rule Book</Anchor>, <Anchor href="https://www.premierultimateleague.com/rulebook" target="_blank">PUL Competition Rules</Anchor>, or <Anchor href="https://watchufa.com/sites/default/files/UFA%20Rule%20Book%202026.pdf" target="_blank">UFA Rulebook</Anchor>.</Text>
                    <Text size='xs'>See the <Anchor href='https://usaultimate.org/wp-content/uploads/2020/11/2024-Observer-Manual-2024-04-25.pdf' target='_blank'>Observer Manual</Anchor> to understand how observers interact with the rules and players.</Text>
                </Flex>
            </Drawer>
        </>
    );
}