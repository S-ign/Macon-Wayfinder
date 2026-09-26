from __future__ import annotations

from resources import recommend, Resource

LABELS = {"rent": "rent assistance", "utilities": "utility-bill assistance", "snap": "SNAP application help", "benefits": "benefits information"}


def build_plan(text: str) -> dict:
    result = recommend(text)
    if result["ambiguous"]:
        if result["unsupported"]:
            detail = "This guide only covers Macon-area rent, utility assistance, SNAP application support, and public-benefit information. Nothing was sent to Nexos. No service referral is provided for this request."
            title = "This request is outside the guide scope"
        else:
            detail = "Try a short general description such as: I need help paying rent; I cannot pay a utility bill; or I want information about SNAP or Georgia benefits. Do not include personal details. Nothing has been sent to Nexos."
            title = "Describe a supported topic"
        actions = [
            {"number": 1, "label": "Scope", "title": title, "detail": detail},
            {"number": 2, "label": "Try again", "title": "Keep the description to rent, utilities, SNAP, or benefits", "detail": "This local guide does not route other requests or determine eligibility."},
            {"number": 3, "label": "Privacy", "title": "Do not share personal or sensitive information", "detail": "The local guide does not submit forms, store case history, or send this request to Nexos."},
        ]
        return {**result, "actions": actions, "resources": []}

    actions = []
    for category in result["categories"]:
        resource = next((item for item in result["resources"] if category in item["categories"]), None)
        if resource is not None and len(actions) < 3:
            title = "Ask this provider about " + LABELS[category]
            actions.append({"number": len(actions) + 1, "label": LABELS[category], "title": title, "detail": "Call first to ask whether applications are open, whether funding is available, which requirements apply, and what steps or documents the provider may request.", "resource": resource})
    if not actions:
        first = result["resources"][0]
        actions.append({"number": 1, "label": "Next step", "title": "Review the official information", "detail": "Check the provider's current instructions and confirm your question directly with the organization.", "resource": first})
    if "benefits" in result["categories"] and len(actions) < 3:
        gateway = next((item for item in result["resources"] if item["id"] == "georgia-gateway"), None)
        if gateway:
            actions.append({"number": len(actions) + 1, "label": "Official online information", "title": "Read the current Georgia Gateway instructions", "detail": "Check current program instructions on the official site before entering personal information.", "resource": gateway})
    return {**result, "actions": actions}
