'use client'

import Image from "next/image";
import data from '../rules.json';
import styles from './page.module.css';
import Rule from './rule.js';

export default function Home() {

  const rules = data.rules;
  const tooltips = data.tooltips;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <ul className="main-rules">
          {Object.entries(rules).map(([, section]) => (
            <li key={section.id} className={styles.section}>
              <a>{section.id}. </a>
              {section.text}
              <ul className={styles.rules}>
                {Object.entries(section.children).map(([ruleIndex, rule]) => (
                 <Rule key={rule.id} rule={rule} />
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </main>
      <footer>
      </footer>
    </div>
  );
}
