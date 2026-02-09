import { useState, useEffect } from 'react';
import { Spoiler, Text } from '@mantine/core';

export default function Annotation({ annotation, expand_annotations }) {
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
    </Spoiler>
}