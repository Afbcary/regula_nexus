'use client'

import data from '../rules.json';
import wulData from '../wul_rules.json';
import Section from './Section.js'
import MobileNavHeader from './MobileNavHeader.js';
import ColorTheme from './colorTheme.js';
import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Anchor, AppShell, Button, Divider, em, Flex, Paper, ScrollArea, TableOfContents, Text, Drawer } from '@mantine/core';
import { useDisclosure, useMediaQuery, useLocalStorage } from '@mantine/hooks';

import PinnedRulesList from './PinnedRulesList';

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const rules = { ...data.rules, ...wulData.rules };
  const [expand_annotations, setExpandAnnotations] = useLocalStorage({
    key: 'expand-annotations',
    defaultValue: false,
    getInitialValueInEffect: true,
  });
  const [drawerOpened, { toggle: toggleDrawer }] = useDisclosure(false);
  const [pinnedRules, setPinnedRules] = useState(() => {
    const pinnedParam = searchParams.get('pinned');
    return pinnedParam ? pinnedParam.split(',') : [];
  });

  const togglePin = (ruleId) => {
    setPinnedRules((current) => {
      return current.includes(ruleId)
        ? current.filter((id) => id !== ruleId)
        : [...current, ruleId];
    });
  };

  const isMobile = useMediaQuery(`(max-width: ${em(750)}), (max-height: ${em(700)})`);

  return (
    <AppShell
      padding="md"
      {...(!isMobile && { header: { height: 80 } })}
      navbar={{
        width: { base: 100, sm: 200, md: 300 },
      }}
      aside={{
        width: { base: 100, sm: 250, md: 300, lg: 400 },
        breakpoint: 750,
        collapsed: { desktop: isMobile, mobile: true },
      }}
    >
      {!isMobile && <AppShell.Header>
        <Flex
          justify="space-between"
          align="center"
          direction="row"
          w="100%"
          px="md"
        >
          <div>
            <Text fw={600} mb={isMobile ? 'xs' : 'md'}>USAU Rules</Text>
            <Text size="sm" mb={isMobile ? 'xs' : 'md'}>
              A dynamic adaptation of the{' '}
              <Anchor href="https://usaultimate.org/rules/" target="_blank">
                official rulebook
              </Anchor>
              .
            </Text>
          </div>
          <Flex gap="md">
            <Button size="sm" variant="default" onClick={() => setExpandAnnotations(!expand_annotations)}>
              <Text size="xs" p={0} mt={0}>{expand_annotations ? 'Collapse' : 'Expand'} Annotations</Text>
            </Button>
            <ColorTheme />
          </Flex>
        </Flex>
      </AppShell.Header>}
      <AppShell.Navbar>
        <Paper shadow="none" radius="xs" p="xs" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {isMobile && <MobileNavHeader pinnedRules={pinnedRules} toggleDrawer={toggleDrawer} setExpandAnnotations={setExpandAnnotations} expand_annotations={expand_annotations} />}
          <ScrollArea scrollbars="y" style={{ flex: 1, minHeight: 0 }}>
            <TableOfContents
              variant="filled"
              color="blue"
              size={isMobile ? 'sm' : 'md'}
              radius="sm"
              scrollSpyOptions={{
                selector: '#mdx :is(h1)',
              }}
              getControlProps={({ data }) => ({
                onClick: () => data.getNode().scrollIntoView(),
                children: <Text size="xs" style={{ textWrap: 'wrap' }}>{data.value}</Text>,
              })}
            />
          </ScrollArea>
        </Paper>
      </AppShell.Navbar>
      <AppShell.Main>
        <div className="main-rules" id="mdx">
          {Object.entries(rules).map(([, section]) => (
            <Section key={section.id} section={section} expand_annotations={expand_annotations} rules={rules} pinnedRules={pinnedRules} togglePin={togglePin} isMobile={isMobile} />
          ))}
        </div>
      </AppShell.Main>
      <AppShell.Aside title="Pinned Rules" p="md">
        <ScrollArea scrollbars="y">
          <PinnedRulesList pinnedRules={pinnedRules} rules={rules} expand_annotations={expand_annotations} togglePin={togglePin} clearPinned={() => setPinnedRules([])} />
        </ScrollArea>
      </AppShell.Aside>

      <Drawer opened={drawerOpened} onClose={toggleDrawer} position="bottom" title="Pinned Rules" size="85%">
        <ScrollArea h="100%">
          <PinnedRulesList hideTitle={true} pinnedRules={pinnedRules} rules={rules} expand_annotations={expand_annotations} togglePin={togglePin} clearPinned={() => setPinnedRules([])} />
        </ScrollArea>
      </Drawer>

    </AppShell>
  );
}
