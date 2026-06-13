'use client'

import { Container, Paper, Title, Text, Button, List, ThemeIcon, Stack, Group, Anchor } from '@mantine/core';
import { IconArrowLeft, IconBrandGithub, IconMail, IconBook, IconEye, IconMoon, IconPin, IconShare, IconDeviceMobile } from '@tabler/icons-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Button component={Link} href="/" leftSection={<IconArrowLeft size={16} />} variant="subtle" color="gray">
            Back to Rules
          </Button>
          <Anchor href="https://github.com/Afbcary/regula_nexus" target="_blank">
            <Button leftSection={<IconBrandGithub size={16} />} variant="default" size="xs">
              GitHub
            </Button>
          </Anchor>
        </Group>

        <Paper withBorder p="xl" radius="md" shadow="sm">
          <Title order={1} mb="md" fw={700}>
            About Regula Nexus
          </Title>
          <Text size="sm" c="dimmed" mb="xl">
            Regula Nexus is a dynamic, mobile-friendly rulebook designed to make ultimate frisbee rulesets interactive, accessible, and easily referenceable.
          </Text>

          <Title order={2} size="h3" mb="sm" fw={600}>
            How to Use These Dynamic Rules
          </Title>

          <List spacing="md" size="sm" center icon={
            <ThemeIcon size={24} radius="xl">
              <IconBook size={14} />
            </ThemeIcon>
          }>
            <List.Item
              icon={
                <ThemeIcon color="blue" size={24} radius="xl">
                  <IconBook size={14} />
                </ThemeIcon>
              }
            >
              <Text span fw={600}>Enabling Rulesets:</Text> Toggle the switches (WUL, PUL, UFA) in the header on desktop or the settings drawer on mobile to view specific semi-pro rulesets alongside the standard USAU rulebook.
            </List.Item>

            <List.Item
              icon={
                <ThemeIcon color="teal" size={24} radius="xl">
                  <IconEye size={14} />
                </ThemeIcon>
              }
            >
              <Text span fw={600}>Rule Annotations:</Text> Use the Annotations toggle to show or hide inline rule clarifications and examples of official rule applications.
            </List.Item>

            <List.Item
              icon={
                <ThemeIcon color="indigo" size={24} radius="xl">
                  <IconMoon size={14} />
                </ThemeIcon>
              }
            >
              <Text span fw={600}>Dark / Light Mode:</Text> Click the sun or moon icon to toggle between light and dark modes.
            </List.Item>

            <List.Item
              icon={
                <ThemeIcon color="orange" size={24} radius="xl">
                  <IconPin size={14} />
                </ThemeIcon>
              }
            >
              <Text span fw={600}>Pinning Rules:</Text> Click the pin icon next to any rule ID to save it to your Pinned Rules list on the right side of the screen for quick cross-reference.
            </List.Item>

            <List.Item
              icon={
                <ThemeIcon color="violet" size={24} radius="xl">
                  <IconDeviceMobile size={14} />
                </ThemeIcon>
              }
            >
              <Text span fw={600}>Mobile Pinned Drawer:</Text> On mobile devices, tap the View Pinned Rules button at the bottom of the screen to open a drawer displaying all pinned rules.
            </List.Item>

            <List.Item
              icon={
                <ThemeIcon color="grape" size={24} radius="xl">
                  <IconShare size={14} />
                </ThemeIcon>
              }
            >
              <Text span fw={600}>Sharing Links:</Text> Click the Share icon (next to settings on mobile or ruleset toggles on desktop) to copy a custom shareable link. Navigating to a shared link automatically enables the required rulesets, scrolls to the specified rule hash, and restores any pinned rules.
            </List.Item>
          </List>

          <Title order={2} size="h3" mt="xl" mb="sm" fw={600}>
            Open Source & Feedback
          </Title>
          <Text size="sm" mb="md">
            This project is open source. You can view the code, report issues, or contribute on GitHub at{' '}
            <Anchor href="https://github.com/Afbcary/regula_nexus" target="_blank" fw={500}>
              github.com/Afbcary/regula_nexus
            </Anchor>
            .
          </Text>

          <Paper withBorder p="md" radius="sm" bg="var(--mantine-color-gray-light)">
            <Group gap="sm" align="flex-start">
              <ThemeIcon variant="light" size="lg">
                <IconMail size={20} />
              </ThemeIcon>
              <div>
                <Text fw={600} size="sm">Feedback Welcome</Text>
                <Text size="xs" c="dimmed">
                  I'd love to hear your thoughts, feature requests, or bug reports! You can reach me at:
                </Text>
                <Text fw={500} size="sm" mt="xs">
                  afbcary (at) gmail
                </Text>
              </div>
            </Group>
          </Paper>
        </Paper>
      </Stack>
    </Container>
  );
}
