from attrs import define, field
from bs4 import BeautifulSoup
import pprint
import re
import requests
import json

@define
class Rule:
    id: str = field()
    text: str = field()
    html: str = field()
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
    rule_links =  soup.find_all(name='a', id=re.compile(r'\d.\w.*'), href=False)
    return [rule_link.find_parent('li') for rule_link in rule_links]

def getRuleDetails(rule):
    anchor = rule.find('a', id=True)
    try: 
        rule_id = anchor['id']
    except TypeError:
        raise ValueError(f"Rule {rule} does not have a direct 'a' tag with an id")
    texts = []
    for child in rule.contents:
        if child.name == 'a' or child.name == 'li' or child.name == 'ul':
            continue
        texts.append(re.sub(r'\s+', ' ', child.get_text(strip=False)))
    subrules_container = rule.find('ul')
    subrules = []
    if subrules_container:
        sub_elements = subrules_container.find_all('li', href=False)
        for sub_element in sub_elements:
            try:
                subrules.append(getRuleDetails(sub_element))
            except ValueError as e:
                # Skipping subrule since it does not have an 'a' tag with an id. This is expected for non-rule lists.
                continue
    return Rule(
        id=rule_id,
        text=''.join(texts).strip(),
        subrules=subrules,
        html=str(rule.contents),
    )

def main():
    print("Running scraper")
    soup = getSoup()
    rules = getRules(soup)
    sections = getSections(soup)
    section_details = [getRuleDetails(section) for section in sections ]
    rules_details = [getRuleDetails(rule) for rule in rules ]
    with open('rules.json', 'w') as fp:
        json.dump(
            {
                'rules': [
                    {
                        'id': rule.id,
                        'text': rule.text,
                        'subrules': [subrule.id for subrule in rule.subrules],
                        'html': rule.html
                    } for rule in rules_details
                ],
                'sections': [{'id': section.id, 'text': section.text} for section in section_details]
            },
            fp,
            indent=2
        )
                  
if __name__ == "__main__":
    main()
