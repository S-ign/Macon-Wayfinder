import unittest
from planner import build_plan
from resources import detect_categories, recommend, RESOURCES


class ResourcePlannerTests(unittest.TestCase):
    def test_supported_topics_classify_and_provide_local_steps(self):
        cases = [("I need help with rent", "rent"), ("electric bill is past due", "utilities"), ("apply for SNAP EBT", "snap"), ("Georgia Gateway benefits", "benefits")]
        for text, category in cases:
            with self.subTest(text=text):
                plan = build_plan(text)
                self.assertIn(category, plan["categories"])
                self.assertTrue(plan["resources"])
                self.assertTrue(plan["actions"])

    def test_mixed_supported_needs_include_both_categories(self):
        self.assertEqual(detect_categories("Behind on rent and power bill"), ["rent", "utilities"])

    def test_unsupported_mixed_request_gets_no_referrals(self):
        plan = build_plan("I need rent help and emergency shelter")
        self.assertTrue(plan["ambiguous"])
        self.assertEqual(plan["resources"], [])
        self.assertTrue(all("resource" not in action for action in plan["actions"]))

    def test_unknown_text_gets_no_referrals(self):
        self.assertEqual(recommend("Please help me")["resources"], [])

    def test_keyword_inside_another_word_does_not_match(self):
        self.assertEqual(detect_categories("rentless benefitshub"), [])

    def test_catalogue_has_only_four_approved_resources(self):
        self.assertEqual(len(RESOURCES), 4)
        self.assertTrue(all(item["website"].startswith("https://") for item in RESOURCES))
        self.assertTrue(all(item["source_url"].startswith("https://") for item in RESOURCES))

    def test_benefit_plan_has_no_more_than_three_steps(self):
        self.assertLessEqual(len(build_plan("Georgia benefits" )["actions"]), 3)


if __name__ == "__main__":
    unittest.main()
