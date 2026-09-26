import { describe, expect, it } from "vitest";
import { buildPlan } from "@/lib/planner";
import { detectCategories, recommend, resources, validateResources } from "@/lib/resources";

describe("Macon Wayfinder supported-intent classification", () => {
  it.each([
    ["I’m behind on rent", ["rent"]],
    ["I need rental assistance", ["rent"]],
    ["I cannot pay my electric bill", ["utilities"]],
    ["I have a water bill and gas bill", ["utilities"]],
    ["Can someone help with LIHEAP?", ["utilities"]],
    ["How do I apply for SNAP and EBT?", ["snap"]],
    ["Where can I apply for public benefits?", ["benefits"]],
    ["I am behind on rent and the power bill", ["rent", "utilities"]],
    ["I need SNAP and general benefits information", ["snap", "benefits"]],
  ] as const)("classifies %s", (text, expected) => { expect(detectCategories(text)).toEqual(expected); });

  it.each(["", "I need a free grocery pantry", "I am looking for a shelter", "I need emergency help", "There is a pothole outside", "help please"]) ("does not match unsupported or ambiguous text: %s", (text) => { expect(recommend(text).ambiguous).toBe(true); });

  it("returns no food-bank or shelter resources for out-of-scope topics", () => {
    const shelter = recommend("I need somewhere safe to stay");
    expect(shelter.ambiguous).toBe(true); expect(shelter.resources).toHaveLength(0);
    const food = recommend("I need a food pantry");
    expect(food.ambiguous).toBe(true); expect(food.resources).toHaveLength(0);
  });
});

describe("provider-approved, grounded action plans", () => {
  it.each(["I need help with rent", "my electric bill is past due", "I want SNAP application help", "I need to understand Georgia benefits"]) ("produces three actions without AI for: %s", (text) => {
    const result = buildPlan(text);
    expect(result.ambiguous).toBe(false); expect(result.actions).toHaveLength(3);
    for (const action of result.actions) expect(action.detail).toMatch(/ask|confirm|call|check|instructions|provider/i);
    for (const resource of result.resources) expect(resources).toContainEqual(resource);
  });

  it("never routes emergency or explicitly unsupported requests to a resource", () => {
    const result = buildPlan("I need eviction advice and emergency shelter");
    expect(result.ambiguous).toBe(true); expect(result.unsupported).toBe(true);
    expect(result.resources).toHaveLength(0); expect(result.actions).toHaveLength(3);
    expect(result.actions.every((action) => !action.resource)).toBe(true);
    expect(result.actions.map((action) => action.title).join(" ")).not.toMatch(/EOC|Gateway|Provider/i);
  });

  it("provides three harmless starter prompts instead of referral claims on ambiguous requests", () => {
    const result = buildPlan("I need help");
    expect(result.ambiguous).toBe(true); expect(result.actions).toHaveLength(3);
    expect(result.actions.every((action) => action.detail.length > 0)).toBe(true);
  });

  it("contains exactly the four requested resources and no shelter or general food-directory records", () => {
    expect(resources).toHaveLength(4);
    expect(resources.flatMap((resource) => resource.categories)).not.toContain("shelter");
    expect(resources.map((resource) => resource.id)).not.toContain("mgcfb-food-locator");
  });

  it("ambiguous and unsupported plans do not imply that a provider has endorsed this request", () => { for (const text of ["please help", "I need a shelter"]) { const result = buildPlan(text); expect(result.actions.every((action) => !action.resource)).toBe(true); expect(result.resources).toHaveLength(0); } });

  it("does not match a supported keyword embedded inside another word", () => { expect(detectCategories("I am rentless; this has no relation to benefitshub")).toEqual([]); });

  it("validates every source, phone number, category, and verification date", () => { expect(validateResources()).toEqual([]); });
});
