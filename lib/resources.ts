export const categories = ["rent", "utilities", "snap", "benefits"] as const;
export type Category = (typeof categories)[number];

export type Resource = {
  id: string;
  name: string;
  categories: Category[];
  description: string;
  phone?: string;
  website: string;
  address?: string;
  mapUrl?: string;
  callFirst: boolean;
  sourceUrl: string;
  verifiedAt: string;
  confidence: "verified" | "needs-check";
};

export const resources: Resource[] = [
  { id: "macon-bibb-eoc-rent-and-utility-assistance", name: "Macon-Bibb Economic Opportunity Council (EOC) · rental assistance", categories: ["rent"], description: "The official EOC services page lists rental assistance and directs residents to contact a case manager. Ask whether the program is accepting applications and about its eligibility and funding; an application is not a promise of payment.", phone: "478-738-3240", website: "https://www.maconbibbeoc.com/services/", address: "456 Bay Street, Macon, GA 31201", mapUrl: "https://www.google.com/maps/search/?api=1&query=456+Bay+Street+Macon+GA+31201", callFirst: true, sourceUrl: "https://www.maconbibbeoc.com/services/", verifiedAt: "2026-09-26", confidence: "verified" },
  { id: "macon-bibb-eoc-utility-assistance", name: "Macon-Bibb Economic Opportunity Council (EOC) · utility assistance", categories: ["utilities"], description: "The official EOC page describes help with gas, electricity, water and seasonal LIHEAP. Call before applying to confirm the applicable program and whether funding is available.", phone: "478-738-3240", website: "https://www.maconbibbeoc.com/services/", address: "456 Bay Street, Macon, GA 31201", mapUrl: "https://www.google.com/maps/search/?api=1&query=456+Bay+Street+Macon+GA+31201", callFirst: true, sourceUrl: "https://www.maconbibbeoc.com/services/", verifiedAt: "2026-09-26", confidence: "verified" },
  { id: "middle-georgia-food-bank-snap-outreach", name: "Middle Georgia Community Food Bank · SNAP Outreach", categories: ["snap", "benefits"], description: "The food bank’s official page directs people seeking help with applying for SNAP (food stamps) to contact its SNAP Outreach Coordinator. Ask about application assistance and appointments. Providers, not this guide, determine eligibility.", phone: "478-342-3218", website: "https://mgcfb.org/find-healthy-food/", callFirst: true, sourceUrl: "https://mgcfb.org/find-healthy-food/", verifiedAt: "2026-09-26", confidence: "verified" },
  { id: "georgia-gateway-benefits-portal", name: "Georgia Gateway · Georgia benefits portal", categories: ["snap", "benefits"], description: "The official Georgia Gateway portal for online public-benefit applications. Confirm the program and current instructions on the official website before entering any personal information. This guide does not submit applications or determine eligibility.", website: "https://gateway.ga.gov/access/", callFirst: false, sourceUrl: "https://gateway.ga.gov/access/", verifiedAt: "2026-09-26", confidence: "needs-check" },
];

const keywords: Record<Category, string[]> = {
  rent: ["rent", "rental", "eviction", "evicted", "past due rent", "past-due rent", "behind on rent", "behind in rent", "late on rent", "rent payment", "rent payments", "security deposit"],
  utilities: ["utility", "utilities", "electricity", "electric bill", "power bill", "water bill", "gas bill", "heating bill", "energy bill", "liheap", "shutoff notice", "shut off", "disconnection"],
  snap: ["snap", "food stamps", "food stamp", "ebt", "apply for snap", "snap application"],
  benefits: ["benefits", "benefit application", "welfare", "tanf", "georgia gateway", "apply for benefits", "benefits application", "public assistance"],
};

export function detectCategories(input: string): Category[] {
  const words = input.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  if (!words) return [];
  return categories.filter((category) => keywords[category].some((keyword) => (" " + words + " " ).includes(" " + keyword + " ")));
}

const offScopeKeywords = ["shelter", "homeless", "somewhere safe to stay", "place to stay", "pothole", "dumping", "sidewalk", "food pantry", "food bank", "free groceries", "meals", "hungry", "emergency", "911"];

export function recommend(input: string) {
  const matches = detectCategories(input);
  const normalized = input.toLowerCase().replace(/[^a-z0-9]+/g, " " ).trim();
  const unsupported = offScopeKeywords.some((keyword) => (" " + normalized + " " ).includes(" " + keyword.replace(/[^a-z0-9]+/g, " " ).trim() + " "));
  const matchedResources = unsupported ? [] : resources.filter((resource) => resource.categories.some((category) => matches.includes(category)));
  return { categories: matches, resources: matchedResources, ambiguous: matches.length === 0 || unsupported, unsupported };
}

export function validateResources(): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const resource of resources) {
    if (ids.has(resource.id)) errors.push("Duplicate resource ID: " + resource.id);
    ids.add(resource.id);
    if (!resource.name.trim() || !resource.description.trim()) errors.push("Missing resource content: " + resource.id);
    if (!resource.categories.length || resource.categories.some((category) => !categories.includes(category))) errors.push("Invalid category: " + resource.id);
    if (!resource.website.startsWith("https://") || !resource.sourceUrl.startsWith("https://")) errors.push("Resource URL must use HTTPS: " + resource.id);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(resource.verifiedAt)) errors.push("Missing verification date: " + resource.id);
    if (resource.phone && !/^[+\d() .-]{7,20}$/.test(resource.phone)) errors.push("Invalid phone number: " + resource.id);
  }
  return errors;
}
