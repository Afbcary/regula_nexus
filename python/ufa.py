import json
import re
from rules_lib import Element, ElementType, Rule

# Regex to match rule IDs like "1.1.1", "6.3.1.3", "13.2.6.5.1", etc.
RULE_ID_RE = re.compile(r'^(\d+(?:\.\d+)*)\s+(.*)')
# Page numbers are standalone single or double digit numbers on a line
PAGE_NUMBER_RE = re.compile(r'^\d{1,2}$')
# Figure lines
FIGURE_RE = re.compile(r'^Figure\s+\d+', re.IGNORECASE)

# String that signals the end of the list items in rule U13.3.2 and the
# start of a new TEXT paragraph. This is the only place in the UFA rulebook
# where a paragraph of text follows a list of bullet items.
LISTITEM_BREAK_STRING = "At an official"


def get_node_at_path(rules, id_parts):
    """Navigate the rules tree to find the Rule for the given id parts."""
    node = rules[id_parts[0]]
    for part in id_parts[1:]:
        node = node.children[part]
    return node


def get_parent_node(rules, id_parts):
    """Get the parent Rule (or wrapper) for a given set of id parts."""
    if len(id_parts) == 1:
        return Rule(id="root", children=rules)
    return get_node_at_path(rules, id_parts[:-1])


def generate_rules():
    with open('/home/austin/workspaces/regula_nexus/src/UFA.txt', 'r') as f:
        lines = f.readlines()

    rules = {}
    current_node = None
    current_rule_id = None
    in_listitem = False
    merging_break_text = False

    for line in lines:
        line = line.strip()

        # Skip empty lines
        if not line:
            continue

        # Skip page numbers (standalone digits like "6", "10", "25")
        if PAGE_NUMBER_RE.match(line):
            continue

        # Skip figure references
        if FIGURE_RE.match(line):
            continue

        # Check for list items (● or • character)
        if line.startswith('●') or line.startswith('•'):
            if current_node is not None:
                text = line[1:].strip()
                current_node.elements.append(
                    Element(type=ElementType.LISTITEM, content=f" {text} ")
                )
                in_listitem = True
                merging_break_text = False
            continue

        # Check for rule ID
        rule_match = RULE_ID_RE.match(line)
        if rule_match:
            in_listitem = False
            merging_break_text = False
            rule_id = 'U' + rule_match.group(1)
            text = rule_match.group(2)
            id_parts = rule_id.split('.')
            current_rule_id = rule_id

            new_node = Rule(
                id=rule_id,
                elements=[Element(type=ElementType.TEXT, content=f" {text} ")],
            )

            parent = get_parent_node(rules, id_parts)
            key = id_parts[-1]

            if len(id_parts) == 1:
                parent.children[rule_id] = new_node
            else:
                parent.children[key] = new_node

            current_node = new_node
        else:
            # Continuation text
            if current_node is not None:
                if merging_break_text:
                    # Continue appending to the break text element
                    last = current_node.elements[-1]
                    last.content += " " + line
                elif in_listitem and line.startswith(LISTITEM_BREAK_STRING):
                    # Special case: "At an official's discretion..." paragraph
                    # after the list items in rule U13.3.2.
                    in_listitem = False
                    merging_break_text = True
                    current_node.elements.append(
                        Element(type=ElementType.TEXT, content=line)
                    )
                elif in_listitem and current_node.elements:
                    # Merge into the last LISTITEM
                    last = current_node.elements[-1]
                    if last.type == ElementType.LISTITEM:
                        last.content = last.content.rstrip() + " " + line + " "
                    else:
                        current_node.elements.append(
                            Element(type=ElementType.TEXT, content=f" {line} ")
                        )
                else:
                    current_node.elements.append(
                        Element(type=ElementType.TEXT, content=f" {line} ")
                    )

    with open('/home/austin/workspaces/regula_nexus/src/ufa_rules.json', 'w') as f:
        json.dump({"rules": {k: v.to_dict() for k, v in rules.items()}}, f, indent=2)

if __name__ == "__main__":
    generate_rules()
