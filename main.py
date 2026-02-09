from enum import Enum, auto
from attrs import define, field
from bs4 import BeautifulSoup, NavigableString
import pprint
import re
import requests
import json


class ElementType(Enum):
    TEXT = auto()
    RULE_LINK = auto()
    ANNOTATION = auto()
    UNIQUE_HTML = auto()
    TOOLTIP = auto()


@define
class Element:
    type: ElementType = field()
    content: str = field()
    title: str = field(default="")


@define
class Rule:
    id: str = field()
    # Ordered list of elements, to display later in the same order.
    elements: list[Element] = field(factory=list)
    subrules: list = field(factory=list)

    def __str__(self):
        return f"id: {self.id}\nText: {self.text}\nSubrules: {','.join([srule.id for srule in self.subrules])}"

    def __repr__(self):
        return self.__str__()
    def __hash__(self):
        return hash(self.id)

def getSoup():
    url = "https://usaultimate.org/rules/"
    response = requests.get(url)
    response.raise_for_status()  # Raises an error for bad responses
    return BeautifulSoup(response.text, "html.parser")

def getSections(soup):
    #  For now, don't scape the appendix sections. The HTML doesn't follow the standard structure of the rules.
    # ([Aa]ppendix.*)
    section_links =  soup.find_all(name='a', id=re.compile(r'^((\d+)|)$'), href=False)
    return [section_link.find_parent('li') for section_link in section_links]

def getRules(soup):
    # Match standard rules (1.A) and appendix rules (C1, C1.A)
    # Standard: starts with digit + dot
    # TODO: (currently disabled) Appendix: starts with Letter + digit
    # |[A-Z]+\d+
    rule_links =  soup.find_all(name='a', id=re.compile(r'^(\d+\.).*'), href=False)
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
                elements.append(Element(type=ElementType.RULE_LINK, title=stripped, content=child['href']))
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
def addRuleToMap(rule, rules_map, depth=0):
    print(f"Adding {rule.id}")
    ids = rule.id.split('.')[depth:]
    if len(ids) < 1:
        print(f"Warning: Rule Id {rule} is not valid.")
    elif len(ids) == 1:
        rules_map['children'][ids[0]] =  {
            'id': rule.id,
            'elements': [{'type': e.type.name, 'content': e.content, 'title': e.title} for e in rule.elements],
            'children': {}}
    else:
        addRuleToMap(rule, rules_map['children'].get(ids[0]), depth+1)

def main():
    print("Running scraper")
    soup = getSoup()
    sections = getSections(soup)
    sections.extend(getRules(soup))
    details = [getRuleDetails(rule) for rule in sections]
    rules_map = {'children': {}}
    for rule in details:
        addRuleToMap(rule, rules_map)
    with open('regula_porro/src/rules.json', 'w') as fp:
        json.dump(
            {'rules': rules_map['children']},
            fp,
            indent=2
        )
                  
if __name__ == "__main__":
    main()
