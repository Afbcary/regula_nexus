'use client'

import styles from './page.module.css';
import { useState } from 'react';
import Annotation from './annotation';
import { ActionIcon } from '@mantine/core';
import { IconPin } from '@tabler/icons-react';


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

function renderElement(element, expand_annotations, rules, pinnedRules, togglePin) {

    switch (element.type) {
        case 'ANNOTATION':
            return <Annotation annotation={element.content} expand_annotations={expand_annotations} />
        case 'RULE_LINK':
            const targetRule = findRule(rules, element.content);
            if (targetRule) {
                return <Rule rule={targetRule} expand_annotations={expand_annotations} rules={rules} hidden={true} pinnedRules={pinnedRules} togglePin={togglePin} />;
            }

            return 'Couldn\'t find rule';
        case 'UNIQUE_HTML':
            return <span className={styles.unique_html} dangerouslySetInnerHTML={{ __html: element.content }} />;
        case 'TEXT':
            return element.content;
        default:
            return element.content;
    }
}

export default function Rule({ rule, expand_annotations, rules, hidden = false, hide_children = true, pinnedRules = [], togglePin, showPin = true }) {


    const [isHidden, setHidden] = useState(hidden);
    if (isHidden) {
        return <span>{rule.id}<button onClick={() => setHidden(false)}>+</button></span>
    }
    const isPinned = pinnedRules.includes(rule.id);

    return (

        <div className={styles.rule}>
            <a href={rule.link} id={rule.id}>
                {rule.id}.
            </a>
            {showPin && (
                <ActionIcon variant={isPinned ? "filled" : "transparent"} color={isPinned ? "blue" : "gray"} onClick={() => togglePin(rule.id)} size="sm" ml={4} mr={4}>
                    <IconPin size={12} />
                </ActionIcon>
            )}


            <span className={styles.ruletext}>
                {rule.elements.map((element, index) => (
                    <span key={index}>
                        {renderElement(element, expand_annotations, rules, pinnedRules, togglePin)}

                    </span>
                ))}
            </span>


            {rule.children && !hide_children && (
                <div className={styles.rules}>
                    {Object.entries(rule.children).map(([ruleIndex, childRule]) => (
                        <Rule key={childRule.id} rule={childRule} expand_annotations={expand_annotations} rules={rules} pinnedRules={pinnedRules} togglePin={togglePin} />
                    ))}

                </div>
            )}
        </div>
    );
}
