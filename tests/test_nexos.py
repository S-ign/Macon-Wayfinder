import io
import json
import unittest
from unittest.mock import patch

from nexos import NEXOS_ENDPOINT, NEXOS_MODEL, request_guidance


class FakeResponse:
    def __init__(self, body):
        self.body = body
    def __enter__(self):
        return self
    def __exit__(self, *args):
        return False
    def read(self, size=-1):
        return self.body[:size]


def response_for(categories=("rent",), guidance="Call the local provider to confirm the current program."):
    content = json.dumps({"categories": list(categories), "guidance": guidance})
    return json.dumps({"choices": [{"message": {"content": content}}]}).encode()


class NexosTests(unittest.TestCase):
    def test_missing_key_does_not_make_a_request(self):
        def fail(*args, **kwargs):
            raise AssertionError("network must not be called")
        self.assertFalse(request_guidance("I need rent help", api_key="", opener=fail)["ok"])

    def test_out_of_scope_does_not_make_a_request(self):
        def fail(*args, **kwargs):
            raise AssertionError("network must not be called")
        result = request_guidance("I need a shelter", api_key="fake", opener=fail)
        self.assertFalse(result["ok"])
        self.assertIn("Nothing was sent", result["error"])

    def test_consented_flow_uses_fixed_nexos_endpoint_and_nonstorage(self):
        captured = {}
        def open_request(request, timeout):
            captured["url"] = request.full_url
            captured["headers"] = request.headers
            captured["payload"] = json.loads(request.data)
            captured["timeout"] = timeout
            return FakeResponse(response_for())
        result = request_guidance("I need rent help", api_key="private-test-key", opener=open_request)
        self.assertTrue(result["ok"])
        self.assertEqual(captured["url"], NEXOS_ENDPOINT)
        self.assertEqual(captured["payload"]["model"], NEXOS_MODEL)
        self.assertFalse(captured["payload"]["store"])
        self.assertEqual(captured["timeout"], 12)
        self.assertNotIn("private-test-key", json.dumps(result))

    def test_wrong_category_is_rejected(self):
        def open_request(request, timeout):
            return FakeResponse(response_for(categories=("benefits",)))
        self.assertFalse(request_guidance("I need rent help", api_key="fake", opener=open_request)["ok"])

    def test_bad_json_fails_safely(self):
        result = request_guidance("I need rent help", api_key="fake", opener=lambda *a, **k: FakeResponse(b"not json"))
        self.assertFalse(result["ok"])
        self.assertNotIn("Traceback", result["error"])


if __name__ == "__main__":
    unittest.main()
