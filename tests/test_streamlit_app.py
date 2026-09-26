import unittest
from pathlib import Path

from streamlit.testing.v1 import AppTest


class StreamlitAppTests(unittest.TestCase):
    def test_app_renders_without_secrets_or_errors(self):
        app = AppTest.from_file(str(Path(__file__).resolve().parents[1] / "app.py")).run()
        self.assertEqual(app.exception, [])
        self.assertTrue(any("What kind of help do you need?" in item.value for item in app.subheader))

    def test_form_shows_local_plan_without_ai_key(self):
        app = AppTest.from_file(str(Path(__file__).resolve().parents[1] / "app.py")).run()
        app.text_area[0].set_value("I need help with rent")
        app.button[0].click().run()
        self.assertEqual(app.exception, [])
        self.assertTrue(any("Your next practical steps" in item.value for item in app.subheader))
        self.assertTrue(any("Macon-Bibb" in item.value for item in app.markdown))

    def test_out_of_scope_prompt_does_not_show_provider_cards(self):
        app = AppTest.from_file(str(Path(__file__).resolve().parents[1] / "app.py")).run()
        app.text_area[0].set_value("I need a place in a shelter")
        app.button[0].click().run()
        self.assertEqual(app.exception, [])
        self.assertTrue(any("outside supported topics" in item.value for item in app.info))
        self.assertFalse(any("Macon-Bibb" in item.value for item in app.markdown))


if __name__ == "__main__":
    unittest.main()
