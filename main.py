from attrs import define, field
from bs4 import BeautifulSoup, NavigableString
import pprint
import re
import requests
import json

@define
class Rule:
    id: str = field()
    text: str = field()
    html: str = field()
    annotations: list = field(factory=list)
    unique_html: list = field(factory=list)
    tooltips: set = field(factory=set)
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
    section_links =  soup.find_all(name='a', id=re.compile(r'^\d+$'), href=False)
    return [section_link.find_parent('li') for section_link in section_links]

def getRules(soup):
    rule_links =  soup.find_all(name='a', id=re.compile(r'^\d+.\w.*'), href=False)
    return [rule_link.find_parent('li') for rule_link in rule_links]

def getRuleDetails(rule):
    anchor = rule.find('a', id=True)
    try: 
        rule_id = anchor['id']
    except TypeError:
        raise ValueError(f"Rule {rule} does not have a direct 'a' tag with an id")
    texts = []
    unique_html = []
    tooltips = set()
    annotations = []
    for child in rule.contents:
        if isinstance(child, NavigableString) or child.name == 'a':
            texts.append(re.sub(r'\s+', ' ', child.get_text(strip=False)))
        elif child.name == 'span' and 'class' in child.attrs and 'tooltip' in child['class']:
            tooltips.add(re.sub(r'\s+', ' ', child.get_text(strip=True)))
        elif child.name == 'span' and 'class' in child.attrs and 'annotation' in child['class']:
            annotations.append(re.sub(r'\s+', ' ', child.get_text(strip=True)))
        elif child.name == 'ul':
            # Skip subrules
            continue
        else:
            unique_html.append(str(child))
        # texts.append(re.sub(r'\s+', ' ', child.get_text(strip=False)))
    # subrules_container = rule.find('ul')
    # subrules = []
    # if subrules_container:
    #     sub_elements = subrules_container.find_all('li', href=False)
    #     for sub_element in sub_elements:
    #         try:
    #             subrules.append(getRuleDetails(sub_element))
    #         except ValueError as e:
    #             # Skipping subrule since it does not have an 'a' tag with an id. This is expected for non-rule lists.
    #             continue
    return Rule(
        id=rule_id,
        text=''.join(texts).strip(),
        tooltips=tooltips,
        unique_html=unique_html,
        annotations=annotations,
        # subrules=subrules,
        html=str(rule.contents),
    )

# desired output
# {rules: {
#    section_rules {
#      'id': rule.id,
#      'text': rule.text,
#      'html': rule.html
#      'subrules': { recurvisely nest the same structure }
#    }
#  }
# }
def addRuleToMap(rule, rules_map, depth=0):
    print(f"Adding {rule.id}")
    ids = rule.id.split('.')[depth:]
    if len(ids) < 1:
        print(f"Warning: Rule Id {rule} is not valid.")
    elif len(ids) == 1:
        # print(pprint.pprint(rules_map))
        # print(pprint.pprint(rules_map['children']))
        rules_map['children'][ids[0]] =  {
            'id': rule.id,
            'text': rule.text,
            'html': rule.html,
            'unique_html': rule.unique_html,
            'annotations': rule.annotations,
            'children': {}}
    else:
        addRuleToMap(rule, rules_map['children'].get(ids[0]), depth+1)

def main():
    print("Running scraper")
    soup = getSoup()
    sections = getSections(soup)
    sections.extend(getRules(soup))
    details = [getRuleDetails(rule) for rule in sections]
    tooltips = set()
    for detail in details:
        tooltips.update(detail.tooltips)
    # section_details = [getRuleDetails(section) for section in sections ]
    rules_map = {'children': {}}
    for rule in details:
        addRuleToMap(rule, rules_map)
    with open('regula_porro/src/rules.json', 'w') as fp:
        json.dump(
            {'rules': rules_map['children'], 'tooltips': list(tooltips)},
            fp,
            indent=2
        )
    # rules_details = [getRuleDetails(rule) for rule in rules ]
    # for rule in rules_details:
    #     section_id = rule.id.split('.')[0]
    #     if section_id in rules_map:
    #         rules_map[section_id]['children'][rule.id] = rule
    #     else:
    #         print(f"Warning: Rule {rule.id} does not have a corresponding section {section_id}")
    # with open('regula_porro/src/rules.json', 'w') as fp:
    #     json.dump(
    #         {
    #             'rules': [
    #                 {
    #                     'id': rule.id,
    #                     'text': rule.text,
    #                     'subrules': [subrule.id for subrule in rule.subrules],
    #                     'html': rule.html
    #                 } for rule in rules_details
    #             ],
    #             'sections': [{'id': section.id, 'text': section.text} for section in section_details]
    #         },
    #         fp,
    #         indent=2
    #     )
                  
if __name__ == "__main__":
    main()
