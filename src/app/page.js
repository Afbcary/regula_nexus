'use client'

import data from '../rules.json';
import Rule from './rule.js';
import { useState } from 'react';
import { ActionIcon, Anchor, AppShell, Button, Container, Divider, em, Flex, Paper, ScrollArea, TableOfContents, Text, Drawer } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconPin } from '@tabler/icons-react';

import PinnedRulesList from './PinnedRulesList';

export default function Home() {

  const rules = data.rules;
  const [expand_annotations, setExpandAnnotations] = useState(false);
  const [opened, { toggle }] = useDisclosure();
  const [drawerOpened, { toggle: toggleDrawer }] = useDisclosure(false);
  const [pinnedRules, setPinnedRules] = useState([]);

  const togglePin = (ruleId) => {
    setPinnedRules((current) =>
      current.includes(ruleId)
        ? current.filter((id) => id !== ruleId)
        : [...current, ruleId]
    );
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
          <Button size="xs" variant="outline" onClick={() => setExpandAnnotations(!expand_annotations)}>
            <Text size="xs" p={0} mt={0}>{expand_annotations ? 'Collapse' : 'Expand'} Annotations</Text>
          </Button>
        </Flex>
      </AppShell.Header>}
      <AppShell.Navbar component={ScrollArea} >
        <Paper shadow="none" radius="xs" p="xs" style={{ height: '100vh' }}>
          {isMobile && <Text fw={600} mb={isMobile ? 'xs' : 'md'}>USAU Rules</Text>}
          {isMobile && <Text size="sm" mb={isMobile ? 'xs' : 'md'}>
            A dynamic adaptation of the{' '}
            <Anchor href="https://usaultimate.org/rules/" target="_blank">
              official rulebook
            </Anchor>
            .
          </Text>
          }
          {isMobile && (
            <Button onClick={toggleDrawer} variant="default" mt="xs" mb="xs">
              <Text span size="xs" p={0} m={0}>View {' '}
                <IconPin size={12} style={{ display: 'inline-flex', verticalAlign: 'middle' }} /></Text>
            </Button>
          )}
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
          {isMobile && (
            <Button fullWidth size="compact-sm" mt="md" variant="outline" onClick={() => setExpandAnnotations(!expand_annotations)}>
              <Text style={{ overflow: 'hidden', whiteSpace: 'nowrap' }} size="xs" p={1} mt={0}>{expand_annotations ? 'Hide' : 'Show'} An.</Text>
            </Button>
          )}
        </Paper>
      </AppShell.Navbar>
      <AppShell.Main>
        <div className="main-rules" id="mdx">
          {Object.entries(rules).map(([, section]) => (
            <div id={section.id} style={{ color: 'rgb(179, 8, 57)', scrollMarginTop: '110px' }} key={section.id} >
              <h1><Text span fw={700}>{section.id}.</Text>{section.elements.map((element, index) => (
                <Text span fw={700} key={index}>{element.content}</Text>
              ))}</h1>
              <div style={{ color: 'black' }}>
                {Object.entries(section.children).map(([ruleIndex, rule]) => (
                  <Rule key={ruleIndex} rule={rule} expand_annotations={expand_annotations} rules={rules} hide_children={false} pinnedRules={pinnedRules} togglePin={togglePin} generateId={true} indent={"0"} />
                ))}
              </div>
              <Divider my="md" />
            </div>
          ))}
        </div>
      </AppShell.Main>
      <AppShell.Aside title="Pinned Rules" p="md">
        <PinnedRulesList pinnedRules={pinnedRules} rules={rules} expand_annotations={expand_annotations} togglePin={togglePin} />
      </AppShell.Aside>

      <Drawer opened={drawerOpened} onClose={toggleDrawer} position="bottom" title="Pinned Rules" size="85%">
        <ScrollArea h="100%">
          <PinnedRulesList hideTitle={true} pinnedRules={pinnedRules} rules={rules} expand_annotations={expand_annotations} togglePin={togglePin} />
        </ScrollArea>
      </Drawer>

    </AppShell>
  );
}
