from bs4 import BeautifulSoup, NavigableString
import re
import requests
import json
from rules_lib import Element, ElementType, Rule

def getSoup():
    url = "https://usaultimate.org/rules/"
    response = requests.get(url)
    response.raise_for_status()  # Raises an error for bad responses
    return BeautifulSoup(response.text, "html.parser")

def getSections(soup):
    #  For now, don't scape the appendix sections. The HTML doesn't follow the standard structure of the rules.
    # ([Aa]ppendix.*)
    section_links =  soup.find_all(name='a', id=re.compile(r'^((\d+)|[Aa]ppendix C.*|)$'), href=False)
    return [section_link.find_parent('li') for section_link in section_links]

def getRules(soup):
    # Match standard rules (1.A) and appendix rules (C1, C1.A)
    # Standard: starts with digit + dot
    # Appendix: starts with Letter + digit + dot
    # |[A-Z]+\d+
    rule_links =  soup.find_all(name='a', id=re.compile(r'^(\d+\.|[C]+\d+(\.|$)).*'), href=False)
    return [rule_link.find_parent('li') for rule_link in rule_links]

def getRuleDetails(rule):
    anchor = rule.find('a', id=True)
    try: 
        # Note that the id doesn't have the trailing period, but the text does.
        rule_id = anchor['id']
    except TypeError:
        raise ValueError(f"Rule {rule} does not have a direct 'a' tag with an id")
    texts = []
    elements = []
    for child in rule.contents:
        if isinstance(child, NavigableString):
            t = re.sub(r'\s+', ' ', child.get_text(strip=False))
            texts.append(t)
            elements.append(Element(type=ElementType.TEXT, content=t))
        elif child.name == 'a':
            t = re.sub(r'\s+', ' ', child.get_text(strip=False))
            texts.append(t)
            stripped = t.strip()
            if stripped.startswith('Appendix'):
                content = child['href']
                if 'appendix_c' in content.lower():
                    content = 'C1'
                elements.append(Element(type=ElementType.RULE_LINK, title=stripped, content=content))
                continue
            if  rule_id + '.' == stripped:
                continue # This is a self-reference link, skip it in elements
            else:
                if stripped.startswith('Section '):
                    stripped = stripped.replace('Section ', '')
                
                elements.append(Element(type=ElementType.RULE_LINK, content=stripped))
        elif child.name == 'span' and 'class' in child.attrs and 'tooltip' in child['class']:
            t = re.sub(r'\s+', ' ', child.get_text(strip=True))
            elements.append(Element(type=ElementType.TOOLTIP, content=t))
        elif child.name == 'span' and 'class' in child.attrs and 'annotation' in child['class']:
            t = re.sub(r'\s+', ' ', child.get_text(strip=True))
            elements.append(Element(type=ElementType.ANNOTATION, content=t))
        elif child.name in ['ul', 'li']:
            # Skip subrules and sibling/nested rules
            continue
        else:
            t = str(child)
            elements.append(Element(type=ElementType.UNIQUE_HTML, content=t))
    return Rule(
        id=rule_id,
        elements=elements,
    )

# desired output
# {rules: {
#    section_rules {
#      'id': rule.id,
#      'elements': [{'type': e.type.name, 'content': e.content} for e in rule.elements],
#      'children': {Rule1: {...}, Rule2: {...}, ...},
#    }
#  }
# }
def addRuleToMap(rule, parent_rule, depth=0):
    print(f"Adding {rule.id}")
    ids = rule.id.split('.')[depth:]
    if len(ids) < 1:
        print(f"Warning: Rule Id {rule} is not valid.")
    elif len(ids) == 1:
        parent_rule.children[ids[0]] = Rule(
            id=rule.id,
            elements=rule.elements,
        )
    else:
        addRuleToMap(rule, parent_rule.children.get(ids[0]), depth+1)

def main():
    print("Running scraper")
    soup = getSoup()
    sections = getSections(soup)
    sections.extend(getRules(soup))
    details = [getRuleDetails(rule) for rule in sections]
    root = Rule(id="root")
    for rule in details:
        addRuleToMap(rule, root)
    with open('../src/rules.json', 'w') as fp:
        json.dump(
            {"rules": {k: v.to_dict() for k, v in root.children.items()}},
            fp,
            indent=2
        )
                  
if __name__ == "__main__":
    main()
