from attrs import define, field
from bs4 import BeautifulSoup
import pprint
import re
import requests

@define
class Rule:
    id: str = field()
    text: str = field()
    subrules: list = field(factory=list)

    def __str__(self):
        return f"id: {self.id}\nText: {self.text}\nSubrules: {','.join([srule.id for srule in self.subrules])}"

    def __repr__(self):
        return self.__str__()

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
    # headers are li
    # id= 1 subrules in ul
    # subrules are <a>
    # subrules have id 1.A
    # rules don't have href

def getRuleDetails(rule):
    texts = []
    for child in rule.contents:
        if child.name == 'a' or child.name == 'li' or child.name == 'ul':
            continue
        texts.append(re.sub(r'\s+', ' ', child.get_text(strip=False)))
    return Rule(
        id=rule.find('a')['id'],
        text=''.join(texts),
        # TODO: figure out why subrules aren't populating.
        subrules=[getRuleDetails(subrule) for subrule in rule.find_all('li', id=re.compile(r'\d.\w.*'))]
    )

def main():
    print("Running scraper")
    soup = getSoup()
    rules = getRules(soup)
    rule_details = getRuleDetails(rules[1])
    pprint.pprint(rule_details)
    sections = getSections(soup)
    # TODO: get section details


if __name__ == "__main__":
    main()
