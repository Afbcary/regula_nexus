'use client'

import Image from "next/image";
import data from '../rules.json';
import styles from './page.module.css';
import Rule, { findRule } from './rule.js';
import { useState } from 'react';

import { AppShell, Button, Divider, Paper, Space, TableOfContents, ActionIcon, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPin, IconX } from '@tabler/icons-react';

export default function Home() {

  const rules = data.rules;
  const [expand_annotations, setExpandAnnotations] = useState(false);
  const [opened, { toggle }] = useDisclosure();
  const [pinnedRules, setPinnedRules] = useState([]);

  const togglePin = (ruleId) => {
    setPinnedRules((current) =>
      current.includes(ruleId)
        ? current.filter((id) => id !== ruleId)
        : [...current, ruleId]
    );
  };


  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Navbar>
        <Paper shadow="md" radius="xs" p="xl">
          <h1>USAU Rules</h1>
          <Space h="lg" />
          <TableOfContents
            variant="filled"
            color="blue"
            size="sm"
            radius="sm"
            scrollSpyOptions={{
              selector: '#mdx :is(h1)',
            }}
            getControlProps={({ data }) => ({
              onClick: () => data.getNode().scrollIntoView(),
              children: data.value,
            })}
          />
        </Paper>
        <Button variant="outline" onClick={() => setExpandAnnotations(!expand_annotations)}>
          {expand_annotations ? 'Collapse' : 'Expand'} All Annotations
        </Button>
      </AppShell.Navbar>
      <AppShell.Main>
        <div className={styles.container}>
          <main className={styles.main}>
            <div className="main-rules" id="mdx">
              {Object.entries(rules).map(([, section]) => (
                <div key={section.id} className={styles.section}>
                  <a><h1>{section.id}.{section.elements.map((element, index) => (
                    <span key={index}>{element.content}</span>
                  ))}</h1></a>
                  <div className={styles.rules}>
                    {Object.entries(section.children).map(([ruleIndex, rule]) => (
                      <Rule key={rule.id} rule={rule} expand_annotations={expand_annotations} hidden={false} rules={rules} hide_children={false} pinnedRules={pinnedRules} togglePin={togglePin} />
                    ))}
                  </div>
                  <Divider my="md" />
                </div>
              ))}
            </div>
          </main>
          <footer>
          </footer>
        </div>
      </AppShell.Main>
      <AppShell.Aside p="md">
        <h1>Pinned Rules</h1>
        {pinnedRules.length === 0 && <Text c="dimmed">No rules pinned yet.</Text>}
        {pinnedRules.map((ruleId) => {
          const rule = findRule(rules, ruleId);
          if (!rule) return null;
          return (
            <Group key={ruleId} mb="sm" align="flex-start" wrap="nowrap">
              <ActionIcon variant="subtle" color="red" onClick={() => togglePin(ruleId)} mt={4}>
                <IconX size={16} />
              </ActionIcon>
              <div style={{ flex: 1 }}>
                <Rule rule={rule} expand_annotations={expand_annotations} rules={rules} pinnedRules={pinnedRules} togglePin={togglePin} showPin={false} />
              </div>
            </Group>
          );
        })}
      </AppShell.Aside>

    </AppShell>
  );
}
