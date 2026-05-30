import json
import unittest


class UFATest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        with open('/home/austin/workspaces/regula_nexus/src/ufa_rules.json') as f:
            cls.data = json.load(f)
        cls.rules = cls.data['rules']

    def get_rule(self, rule_id):
        """Navigate to a rule node by its full ID like 'U13.3.2'."""
        parts = rule_id.split('.')
        node = self.rules[parts[0]]
        for part in parts[1:]:
            node = node['children'][part]
        return node

    def test_top_level_sections(self):
        """All 16 top-level sections should exist with U prefix."""
        expected = [f'U{i}' for i in range(1, 17)]
        self.assertEqual(list(self.rules.keys()), expected)

    def test_rule_id_format(self):
        """Top-level rule IDs should be prefixed with U."""
        for key, node in self.rules.items():
            self.assertTrue(key.startswith('U'), f"Key {key} missing U prefix")
            self.assertEqual(key, node['id'])

    def test_deep_nesting(self):
        """Rule U13.2.6.5.1 should exist at 5 levels deep."""
        rule = self.get_rule('U13.2.6.5.1')
        self.assertEqual(rule['id'], 'U13.2.6.5.1')

    def test_listitem_merging(self):
        """Multi-line list items in U6.3.1.3 should be merged into single LISTITEMs."""
        rule = self.get_rule('U6.3.1.3')
        listitems = [e for e in rule['elements'] if e['type'] == 'LISTITEM']
        self.assertEqual(len(listitems), 3)
        # Each list item should be a single merged string, not split across elements
        self.assertIn('nearest to where the pull last went out of bounds', listitems[0]['content'])
        self.assertIn('before picking up the disc', listitems[1]['content'])

    def test_13_3_2_special_case(self):
        """Rule U13.3.2: 'At an official's discretion...' should be a TEXT element
        after the LISTITEM elements, not merged into the last LISTITEM."""
        rule = self.get_rule('U13.3.2')
        elements = rule['elements']

        # Should have 4 LISTITEM elements
        listitems = [e for e in elements if e['type'] == 'LISTITEM']
        self.assertEqual(len(listitems), 4)

        # Last LISTITEM should NOT contain "At an official"
        self.assertNotIn("At an official", listitems[-1]['content'])
        self.assertIn("2 Team Technical Fouls and 1 Flagrant or Technical Foul", listitems[-1]['content'])

        # The final element should be a TEXT with the full "At an official..." paragraph
        last_text = elements[-1]
        self.assertEqual(last_text['type'], 'TEXT')
        expected_content = (
            "At an official\u2019s discretion, a player or any team personnel "
            "may be ejected after only 1 Flagrant or Technical foul. "
            "If an official believes a player intentionally commits a foul "
            "to gain advantage, the player will be immediately ejected. "
            "All ejections trigger an automatic and immediate disciplinary "
            "review by the Executive Council or a designated Committee."
        )
        self.assertEqual(last_text['content'], expected_content)

    def test_rule_children(self):
        """Rule U13.2.5 should have children 1-6."""
        rule = self.get_rule('U13.2.5')
        self.assertEqual(set(rule['children'].keys()), {'1', '2', '3', '4', '5', '6'})

    def test_rule_with_listitems_and_children(self):
        """Rule U13.2.5 should have both LISTITEM elements and children."""
        rule = self.get_rule('U13.2.5')
        listitems = [e for e in rule['elements'] if e['type'] == 'LISTITEM']
        self.assertGreater(len(listitems), 0)
        self.assertGreater(len(rule['children']), 0)


if __name__ == '__main__':
    unittest.main()