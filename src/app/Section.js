import Rule from './rule.js';
import { Divider, Text } from '@mantine/core';

export default function Section({ section, expand_annotations, rules, pinnedRules, togglePin }) {

    // TODO: examine scrollMarginTop behavior. Section headers should be visible.
    return (
        <div id={section.id} style={{ scrollMarginTop: '110px' }} key={section.id} >
            <h1><Text c="rgb(179, 8, 57)" span fw={700}>{section.id}.</Text>{section.elements.map((element, index) => (
                <Text c="rgb(179, 8, 57)" span fw={700} key={index}>{element.content}</Text>
            ))}</h1>
            <div>
                {Object.entries(section.children).map(([ruleIndex, rule]) => (
                    <Rule key={ruleIndex} rule={rule} expand_annotations={expand_annotations} rules={rules} hide_children={false} pinnedRules={pinnedRules} togglePin={togglePin} generateId={true} indent={"0"} />
                ))}
            </div>
            <Divider my="md" />
        </div>
    )
}