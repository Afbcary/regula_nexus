'use client'

import { Anchor, Button, Text } from '@mantine/core';
import ColorTheme from './colorTheme.js';
import { IconPin } from '@tabler/icons-react';
import { useState, useEffect, useRef } from 'react';

export default function MobileNavHeader({ pinnedRules, toggleDrawer, setExpandAnnotations, expand_annotations }) {

    const [isShaking, setIsShaking] = useState(false);
    const prevPinnedCount = useRef(pinnedRules?.length || 0);

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
            <Text fw={600} mb='xs'>USAU Rules</Text>
            <Text size="sm" mb='xs'>
                A dynamic adaptation of the{' '}
                <Anchor href="https://usaultimate.org/rules/" target="_blank">
                    official rulebook
                </Anchor>
                .
            </Text>
            <Button onClick={toggleDrawer} variant="default" mt="xs" mb="xs" className={isShaking ? 'shake' : ''}>
                <Text span size="xs" p={0} m={0}>View {' '}
                    <IconPin size={12} style={{ display: 'inline-flex', verticalAlign: 'middle' }} /></Text>
            </Button>
            <ColorTheme />
            <Button fullWidth size="compact-sm" mt="md" variant="outline" onClick={() => setExpandAnnotations(!expand_annotations)}>
                <Text style={{ overflow: 'hidden', whiteSpace: 'nowrap' }} size="xs" p={1} mt={0}>{expand_annotations ? 'Hide' : 'Show'} An.</Text>
            </Button>
        </>

    );
}