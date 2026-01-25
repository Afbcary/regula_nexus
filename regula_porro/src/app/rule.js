'use client'

import styles from './page.module.css';
import { useState } from 'react';

function findRule(rules, id) {
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

function renderElement(element, expand_annotation, setExpandAnnotation, rules) {
    switch (element.type) {
        case 'ANNOTATION':
            if (expand_annotation) {
                return <div><span className={styles.annotation}>{element.content}</span><button className={styles.button} onClick={() => setExpandAnnotation(false)}>Collapse</button></div>;
            } else {
                return <div><span className={styles.annotation}>{element.content}</span><button className={styles.button} onClick={() => setExpandAnnotation(true)}>Expand</button></div>;
            }
        case 'RULE_LINK':
            const targetRule = findRule(rules, element.content);
            if (targetRule) {
                return <Rule rule={targetRule} expand_annotations={expand_annotation} rules={rules} hidden={true} />;
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

export default function Rule({ rule, expand_annotations, rules, hidden = false, hide_children = true }) {
    const [expand_annotation, setExpandAnnotation] = useState(expand_annotations);
    const [isHidden, setHidden] = useState(hidden);
    if (isHidden) {
        return <span>{rule.id}<button onClick={() => setHidden(false)}>+</button></span>
    }
    return (
        <li className={styles.rule}>
            <a href={rule.link}>
                {rule.id}.<span className={styles.ruletext}>
                    {rule.elements.map((element, index) => (
                        <span key={index}>
                            {renderElement(element, expand_annotation, setExpandAnnotation, rules)}
                        </span>
                    ))}
                </span>

            </a>
            {rule.children && !hide_children && (
                <ul className={styles.rules}>
                    {Object.entries(rule.children).map(([ruleIndex, childRule]) => (
                        <Rule key={childRule.id} rule={childRule} expand_annotations={expand_annotations} rules={rules} />
                    ))}
                </ul>
            )}
        </li>
    );
}
