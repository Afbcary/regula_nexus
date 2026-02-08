import { useState } from 'react';
import { Spoiler } from '@mantine/core';

export default function Annotation({ annotation, expand_annotations }) {
    const [expanded, setExpanded] = useState(expand_annotations);
    return <Spoiler
        maxHeight={0}
        showLabel="+ Annotation"
        hideLabel="- Annotation"
        expanded={expanded}
        onExpandedChange={setExpanded}
    >
        {annotation}
    </Spoiler>
}