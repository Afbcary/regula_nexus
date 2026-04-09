'use client'

import data from '../rules.json';
import wulData from '../wul_rules.json';
import pulData from '../pul_rules.json';
import Section from './Section.js'
import MobileNavHeader from './MobileNavHeader.js';
import ColorTheme from './colorTheme.js';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Anchor, AppShell, Button, em, Flex, Paper, ScrollArea, TableOfContents, Text, Drawer, Switch } from '@mantine/core';
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

  const [includeWul, setIncludeWul] = useLocalStorage({
    key: 'include-wul',
    defaultValue: false,
    getInitialValueInEffect: true,
  });

  const [includePul, setIncludePul] = useLocalStorage({
    key: 'include-pul',
    defaultValue: false,
    getInitialValueInEffect: true,
  });

  const rules = {
    ...data.rules,
    ...(includeWul ? wulData.rules : {}),
    ...(includePul ? pulData.rules : {})
  };

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

  const handleWulToggle = (event) => {
    const checked = event.currentTarget.checked;
    setIncludeWul(checked);
    if (!checked) {
      setPinnedRules((current) => current.filter((id) => !wulData.rules[id]));
    }
  };

  const handlePulToggle = (event) => {
    const checked = event.currentTarget.checked;
    setIncludePul(checked);
    if (!checked) {
      setPinnedRules((current) => current.filter((id) => !pulData.rules[id]));
    }
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
            <Text fw={600} mt={isMobile ? 'xs' : 'md'} mb={isMobile ? 'xs' : 'md'}>USAU Rules</Text>
            <Text size="sm" mb={isMobile ? 'xs' : 'md'}>
              A dynamic adaptation of the{' '}
              <Anchor href="https://usaultimate.org/rules/" target="_blank">
                official rulebook
              </Anchor>
              .
            </Text>
          </div>
          <Flex gap="md" align="center">
            <Switch label="WUL" size="sm" checked={includeWul} onChange={handleWulToggle} />
            {/* TODO: Add PUL back in when the full rulebook has been cleanly adapted to this format */}
            {/* <Switch label="PUL" size="sm" checked={includePul} onChange={handlePulToggle} /> */}
            <Switch label="Annotations" size="sm" checked={expand_annotations} onChange={(event) => setExpandAnnotations(event.currentTarget.checked)} />
            <ColorTheme />
          </Flex>
        </Flex>
      </AppShell.Header>}
      <AppShell.Navbar>
        <Paper shadow="none" radius="xs" p="xs" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {isMobile && <MobileNavHeader pinnedRules={pinnedRules} toggleDrawer={toggleDrawer} setExpandAnnotations={setExpandAnnotations} expand_annotations={expand_annotations} includeWul={includeWul} handleWulToggle={handleWulToggle} includePul={includePul} handlePulToggle={handlePulToggle} />}
          <ScrollArea scrollbars="y" style={{ flex: 1, minHeight: 0 }}>
            <TableOfContents
              key={`toc-${includeWul}-${includePul}`}
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
