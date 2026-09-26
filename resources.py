from __future__ import annotations

from typing import TypedDict


class Resource(TypedDict, total=False):
    id: str
    name: str
    categories: list[str]
    description: str
    phone: str
    website: str
    address: str
    call_first: bool
    source_url: str
    verified_at: str
    confidence: str


CATEGORIES = ("rent", "utilities", "snap", "benefits")
RESOURCES: list[Resource] = [
    {"id": "macon-bibb-eoc-rent", "name": "Macon-Bibb Economic Opportunity Council (EOC): rental assistance", "categories": ["rent"], "description": "The official EOC services page lists rental assistance and directs residents to contact a case manager. Ask whether applications are open and about eligibility and funding; an application is not a promise of payment.", "phone": "478-738-3240", "website": "https://www.maconbibbeoc.com/services/", "address": "456 Bay Street, Macon, GA 31201", "call_first": True, "source_url": "https://www.maconbibbeoc.com/services/", "verified_at": "2026-09-26", "confidence": "verified"},
    {"id": "macon-bibb-eoc-utilities", "name": "Macon-Bibb Economic Opportunity Council (EOC): utility assistance", "categories": ["utilities"], "description": "The official EOC page describes help with gas, electricity, water, and seasonal LIHEAP. Call first to confirm the applicable program and whether funding is available.", "phone": "478-738-3240", "website": "https://www.maconbibbeoc.com/services/", "address": "456 Bay Street, Macon, GA 31201", "call_first": True, "source_url": "https://www.maconbibbeoc.com/services/", "verified_at": "2026-09-26", "confidence": "verified"},
    {"id": "middle-georgia-snap", "name": "Middle Georgia Community Food Bank: SNAP Outreach", "categories": ["snap", "benefits"], "description": "The food bank official page directs people seeking help applying for SNAP to its SNAP Outreach Coordinator. Ask about application assistance and appointments. Providers, not this guide, determine eligibility.", "phone": "478-342-3218", "website": "https://mgcfb.org/find-healthy-food/", "call_first": True, "source_url": "https://mgcfb.org/find-healthy-food/", "verified_at": "2026-09-26", "confidence": "verified"},
    {"id": "georgia-gateway", "name": "Georgia Gateway: Georgia benefits portal", "categories": ["snap", "benefits"], "description": "The official Georgia Gateway portal for online public-benefit applications. Confirm the program and current instructions on the official website before entering personal information. This guide does not submit applications or determine eligibility.", "website": "https://gateway.ga.gov/access/", "call_first": False, "source_url": "https://gateway.ga.gov/access/", "verified_at": "2026-09-26", "confidence": "needs-check"},
]

KEYWORDS: dict[str, tuple[str, ...]] = {
    "rent": ("rent", "rental", "eviction", "evicted", "past due rent", "past-due rent", "behind on rent", "behind in rent", "late on rent", "rent payment", "rent payments", "security deposit"),
    "utilities": ("utility", "utilities", "electricity", "electric bill", "power bill", "water bill", "gas bill", "heating bill", "energy bill", "liheap", "shutoff notice", "shut off", "disconnection"),
    "snap": ("snap", "food stamps", "food stamp", "ebt", "apply for snap", "snap application"),
    "benefits": ("benefits", "benefit application", "welfare", "tanf", "georgia gateway", "apply for benefits", "benefits application", "public assistance"),
}
OFF_SCOPE = ("shelter", "homeless", "somewhere safe to stay", "place to stay", "pothole", "dumping", "sidewalk", "food pantry", "food bank", "free groceries", "meals", "hungry", "emergency", "911")


def normalize(text: str) -> str:
    import re
    return re.sub(r"[^a-z0-9]+", " ", text.lower()).strip()


def contains_phrase(text: str, phrase: str) -> bool:
    words = normalize(text)
    needle = normalize(phrase)
    return bool(needle) and f" {needle} " in f" {words} "


def detect_categories(text: str) -> list[str]:
    return [category for category in CATEGORIES if any(contains_phrase(text, keyword) for keyword in KEYWORDS[category])]


def recommend(text: str) -> dict:
    categories = detect_categories(text)
    unsupported = any(contains_phrase(text, phrase) for phrase in OFF_SCOPE)
    selected = [] if unsupported else [item for item in RESOURCES if any(c in categories for c in item["categories"])]
    return {"categories": categories, "resources": selected, "ambiguous": not categories or unsupported, "unsupported": unsupported}
