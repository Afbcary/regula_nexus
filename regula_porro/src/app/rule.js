'use client'

import { useState } from 'react';
import Annotation from './annotation';
import { ActionIcon, Anchor, Flex, Text } from '@mantine/core';
import { IconExternalLinkOff, IconPin } from '@tabler/icons-react';


export function findRule(rules, id) {

    if (!rules || !id) return null;
    const parts = id.split('.');
    let current = rules[parts[0]];
    if (!current) return null;
    for (let i = 1; i < parts.length; i++) {
        if (!current || !current.children) return null;
        current = current.children[parts[i]];
    }
    return current;
}
// 20.E.2.d doesn't work
function renderElement(element, expand_annotations, rules, pinnedRules, togglePin) {

    switch (element.type) {
        case 'ANNOTATION':
            return <Annotation annotation={element.content} expand_annotations={expand_annotations} />
        case 'RULE_LINK':
            if (element.title) {
                return (
                    <Anchor size="sm" href={element.content} target="_blank" rel="noopener noreferrer">
                        {element.title}{"\u00A0"}<IconExternalLinkOff style={{ display: 'inline-block', verticalAlign: 'middle' }} size={12} />
                    </Anchor>
                );
            }
            if (/^[a-zA-Z]/.test(element.content)) {
                return (
                    <Anchor size="sm" href={`https://usaultimate.org/rules/#${element.content}`} target="_blank"
                        rel="noopener noreferrer">
                        {element.content}{"\u00A0"}<IconExternalLinkOff style={{ display: 'inline-block', verticalAlign: 'middle' }} size={12} />
                    </Anchor>
                );
            }
            return <Anchor size="sm" href={`#${element.content}`}>{element.content}</Anchor>;
        case 'UNIQUE_HTML':
            return <span dangerouslySetInnerHTML={{ __html: element.content }} />;
        case 'TEXT':
            return <Text span size="sm">{element.content}</Text>;
        default:
            return element.content;
    }
}

export default function Rule({ rule, expand_annotations, rules, hide_children = true, pinnedRules = [], togglePin, showPin = true, generateId = false, indent = '1.5em' }) {

    const isPinned = pinnedRules.includes(rule.id);

    return (
        <div id={generateId ? rule.id : undefined} style={generateId ? { scrollMarginTop: '80px', paddingLeft: indent } : undefined}>
            <Flex>
                {showPin && (
                    <ActionIcon variant={isPinned ? "filled" : "transparent"} color={isPinned ? "blue" : "gray"} onClick={() => togglePin(rule.id)} size="sm" ml={0} mr={0} style={{ display: 'inline-flex', verticalAlign: 'middle' }}>
                        <IconPin size={12} />
                    </ActionIcon>
                )}
                <Anchor mr={4} size="sm" href={`#${rule.id}`}><Text span fw={700}>{rule.id}</Text></Anchor>
                <span style={{ lineHeight: 1 }}>
                    {rule.elements.map((element, index) => (
                        <span key={index}>
                            {renderElement(element, expand_annotations, rules, pinnedRules, togglePin)}
                        </span>
                    ))}
                </span>
            </Flex>
            {rule.children && !hide_children && (
                <div>
                    {Object.entries(rule.children).map(([ruleIndex, childRule]) => (
                        <Rule key={childRule.id} rule={childRule} expand_annotations={expand_annotations} rules={rules} pinnedRules={pinnedRules} togglePin={togglePin} generateId={generateId} hide_children={hide_children} />
                    ))}
                </div>
            )}
        </div>
    );
}
