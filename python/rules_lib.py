from attrs import define, field
from enum import Enum, auto


class ElementType(Enum):
    TEXT = auto()
    RULE_LINK = auto()
    ANNOTATION = auto()
    UNIQUE_HTML = auto()
    TOOLTIP = auto()
    LISTITEM = auto()


@define
class Element:
    type: ElementType = field()
    content: str = field()
    title: str = field(default="")
    list_items: list = field(factory=list)

    def to_dict(self):
        d = {"type": self.type.name, "content": self.content, "title": self.title}
        if self.list_items:
            d["list_items"] = [li.to_dict() for li in self.list_items]
        return d


@define
class Rule:
    id: str = field()
    # Ordered list of elements, to display later in the same order.
    elements: list[Element] = field(factory=list)
    children: dict = field(factory=dict)

    def isSection(self):
        return self.level() == 1

    def level(self):
        return len(self.id.split(sep='.'))

    def to_dict(self):
        return {
            "id": self.id,
            "elements": [e.to_dict() for e in self.elements],
            "children": {k: v.to_dict() for k, v in self.children.items()},
        }

    def __str__(self):
        return f"Rule with id:{self.id}"

    def __repr__(self):
        return self.__str__()

    def __hash__(self):
        return hash(self.id)


@define
class Container:
    rules: dict[str, Rule] = field()

    def getSection(self, id):
        return self.rules[id]

    def to_dict(self):
        return {"rules": {k: v.to_dict() for k, v in self.rules.items()}}