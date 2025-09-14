'use client'

import styles from './page.module.css';

export default function Rule(rule, ruleIndex) {
    rule = rule.rule;
    return (
        <li key={ruleIndex} className={styles.rule}>
            <a href={rule.link}>
                {rule.id}.<span className={styles.ruletext}>{rule.text}</span>
            </a>
            {rule.children && (
                <ul className={styles.rules}>
                    {Object.entries(rule.children).map(([ruleIndex, childRule]) => (
                        <Rule key={childRule.id} rule={childRule} />
                    ))}
                </ul>
            )}
        </li>
    );
}
