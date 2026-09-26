import { recommend, resources, type Category, type Resource } from "./resources";

export type Action = { number: number; label: string; title: string; detail: string; resource?: Resource };
const labels: Record<Category, string> = { rent: "rent assistance", utilities: "utility-bill assistance", snap: "SNAP application help", benefits: "benefits information" };

export function buildPlan(input: string): { categories: Category[]; actions: Action[]; resources: Resource[]; ambiguous: boolean; unsupported: boolean } {
  const result = recommend(input);
  if (result.ambiguous) {
    const detail = result.unsupported
      ? "This guide only covers Macon-area rent assistance, utility assistance, SNAP application support, and public-benefit information. Nothing was sent to Nexos. No service referral is provided for this request."
      : "Try a short, general description such as “I need help paying rent,” “I cannot pay a utility bill,” or “I want information about SNAP or Georgia benefits.” Do not include personal details. Nothing has been sent to Nexos.";
    return { ...result, resources: [], actions: [
      { number: 1, label: "Scope", title: result.unsupported ? "This request is outside the guide’s scope" : "Describe a supported topic", detail },
      { number: 2, label: "Try again", title: "Keep the description to rent, utilities, SNAP or benefits", detail: "This local guide does not route other requests or determine eligibility." },
      { number: 3, label: "Privacy", title: "Do not share personal or sensitive information", detail: "The local guide does not submit forms, store case history or send this request to Nexos." },
    ] }
  }
  const actions: Action[] = [];
  for (const category of result.categories) {
    const resource = result.resources.find((item) => item.categories.includes(category));
    if (!resource || actions.length >= 3) continue;
    actions.push({ number: actions.length + 1, label: labels[category], title: "Ask " + resource.name + " about " + labels[category], detail: "Call first to ask whether applications are open, whether funding is available, which requirements apply, and what steps or documents the provider may request.", resource });
  }
  const gateway = result.resources.find((resource) => resource.id === "georgia-gateway-benefits-portal");
  if (gateway && actions.length < 3) actions.push({ number: actions.length + 1, label: "Official online information", title: "Read the current Georgia Gateway application instructions", detail: "Use the official government website. Check the current program’s instructions before sharing personal details or applying.", resource: gateway });
  while (actions.length < 3) {
    const first = result.resources[0];
    const number = actions.length + 1;
    if (number === 2) actions.push({ number, label: "Before you call", title: "Ask what documents or information may be needed", detail: "Request the provider’s current instructions. Do not send personal documents through this guide.", resource: first });
    else if (number === 3 && first?.address) actions.push({ number, label: "Plan before a visit", title: "Confirm the office location and hours", detail: "Call to confirm the current address, operating hours, and whether an appointment is needed before visiting.", resource: first });
    else if (number === 3 && gateway) actions.push({ number, label: "Official program information", title: "Check the official Georgia Gateway portal", detail: "See the government’s current benefit-application instructions. Confirm the program before proceeding.", resource: gateway });
    else break;
  }
  return { ...result, actions };
}
