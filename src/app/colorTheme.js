'use client'

import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export default function ColorTheme() {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // To prevent hydration mismatch, only render the icon once the component is mounted
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        const newTheme = computedColorScheme === 'light' ? 'dark' : 'light';
        setColorScheme(newTheme);
    };

    return (
        <ActionIcon
            onClick={toggleTheme}
            variant="default"
            size="lg"
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