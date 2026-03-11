'use client'

import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useState, useEffect } from 'react';

export default function ColorTheme() {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    // To prevent hydration mismatch, only render the icon once the component is mounted
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <ActionIcon
            onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
            variant="default"
            size="xl"
            aria-label="Toggle color scheme"
        >
            {mounted ? (
                computedColorScheme === 'light' ? <IconMoon stroke={1.5} /> : <IconSun stroke={1.5} />
            ) : (
                <IconMoon stroke={1.5} style={{ visibility: 'hidden' }} />
            )}
        </ActionIcon>
    );
}