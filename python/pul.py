import json
from rules_lib import Element, ElementType, Rule

def generate_rules():
    with open('/home/austin/workspaces/regula_nexus/src/PUL.txt', 'r') as f:
        lines = f.readlines()

    rules = {}

    current_level = 0
    counts = [0] * 10
    path_refs = {0: Rule(id="root", children=rules)}

    in_annotation = False
    active_rule = None

    def get_key_segment(lvl, count):
        if lvl == 1: return str(count)
        elif lvl == 2: return chr(64 + count)
        elif lvl == 3: return str(count)
        elif lvl == 4: return chr(64 + count)
        elif lvl == 5: return str(count)
        elif lvl == 6: return chr(96 + count)
        elif lvl == 7: return str(count)
        else: return str(count)

    for line in lines:
        line = line.strip()
        if not line:
            continue

        if line == '```':
            in_annotation = not in_annotation
            continue

        if in_annotation:
            if line.startswith('*'):
                text = line[1:].strip()
                if active_rule is not None:
                    elements = active_rule.elements
                    if len(elements) > 0 and elements[-1].type == ElementType.ANNOTATION:
                        elements[-1].list_items.append(
                            Element(type=ElementType.LISTITEM, content=f" {text} ")
                        )
                    else:
                        active_rule.elements.append(
                            Element(type=ElementType.LISTITEM, content=f" {text} ")
                        )
            else:
                if active_rule is not None:
                    active_rule.elements.append(
                        Element(type=ElementType.ANNOTATION, content=f" {line} ")
                    )
            continue

        if line.startswith('*'):
            text = line[1:].strip()
            if active_rule is not None:
                active_rule.elements.append(
                    Element(type=ElementType.LISTITEM, content=f" {text} ")
                )
            continue

        if line.startswith('##'):
            hashes = len(line) - len(line.lstrip('#'))
            level = hashes - 1
            text = line.lstrip('#').strip()

            current_level = level
            counts[level] += 1
            for i in range(level + 1, 10):
                counts[i] = 0

            segments = [get_key_segment(i, counts[i]) for i in range(1, level + 1)]
            full_id = "P" + ".".join(segments)

            new_node = Rule(
                id=full_id,
                elements=[Element(type=ElementType.TEXT, content=f" {text} ")],
            )

            parent_node = path_refs[level - 1]
            if level == 1:
                parent_node.children[full_id] = new_node
            else:
                parent_node.children[segments[-1]] = new_node

            path_refs[level] = new_node
            active_rule = new_node

        else:
            if current_level == 0:
                continue

            target_level = current_level + 1
            counts[target_level] += 1
            for i in range(target_level + 1, 10):
                counts[i] = 0

            segments = [get_key_segment(i, counts[i]) for i in range(1, target_level + 1)]
            full_id = "P" + ".".join(segments)

            new_node = Rule(
                id=full_id,
                elements=[Element(type=ElementType.TEXT, content=f" {line} ")],
            )

            parent_node = path_refs[target_level - 1]
            if target_level == 1:
                parent_node.children[full_id] = new_node
            else:
                parent_node.children[segments[-1]] = new_node

            path_refs[target_level] = new_node
            active_rule = new_node

    with open('/home/austin/workspaces/regula_nexus/src/pul_rules.json', 'w') as f:
        json.dump({"rules": {k: v.to_dict() for k, v in rules.items()}}, f, indent=2)

if __name__ == "__main__":
    generate_rules()
