import { useState, useEffect } from 'react';
import { Spoiler, Text, List } from '@mantine/core';

export default function Annotation({ annotation, expand_annotations, list_items }) {
    const [expanded, setExpanded] = useState(expand_annotations);

    useEffect(() => {
        setExpanded(expand_annotations);
    }, [expand_annotations]);

    return <Spoiler
        maxHeight={0}
        showLabel={<Text size="xs">+ Annotation</Text>}
        hideLabel={<Text size="xs">- Annotation</Text>}
        expanded={expanded}
        onExpandedChange={setExpanded}
    >
        <Text span size="xs" fs="italic">{annotation}</Text>
        {list_items && list_items.length > 0 && (
            <List withPadding listStyleType="disc" size="xs" mt="xs" mb="xs">
                {list_items.map((item, index) => (
                    <List.Item key={index}>
                        <Text span size="xs" fs="italic">{item.content}</Text>
                    </List.Item>
                ))}
            </List>
        )}
    </Spoiler>
}