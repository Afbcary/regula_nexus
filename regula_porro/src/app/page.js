'use client'

import Image from "next/image";
import data from '../rules.json';
import styles from './page.module.css';
import Rule from './rule.js';
import { useState } from 'react';

export default function Home() {

  const rules = data.rules;
  const [expand_annotations, setExpandAnnotations] = useState(true);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <button className={styles.button} onClick={() => setExpandAnnotations(!expand_annotations)}>
          {expand_annotations ? 'Collapse' : 'Expand'} All Annotations
        </button>
        <ul className="main-rules">
          {Object.entries(rules).map(([, section]) => (
            <li key={section.id} className={styles.section}>
              <a>{section.id}. </a>
              {section.elements.map((element, index) => (
                <span key={index}>{element.content}</span>
              ))}
              <ul className={styles.rules}>
                {Object.entries(section.children).map(([ruleIndex, rule]) => (
                  <Rule key={rule.id} rule={rule} expand_annotations={expand_annotations} hidden={false} rules={rules} hide_children={false} />
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
