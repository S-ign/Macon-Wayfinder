# Macon Wayfinder — project blueprint

**Event:** Hack for Humanity: Macon · The AI Collective · Macon, Georgia\
**Build window:** Three hours, followed by live demos and judging\
**Product status:** Portable project package · Phased development\
**Repository goal:** Commit and push this self-contained app to its own GitHub repository so the event team can clone and run it on their own machines. Do not host the app on Hermes.\

---

## Product summary

> Macon Wayfinder lets someone describe, in general terms, a question about paying rent or utilities, applying for SNAP, or accessing public benefits. It returns a simple, useful plan and clearly sourced local services, so the next step is to contact the right existing provider.

**Use of AI:** Nexos is the only AI provider. AI is optional and defaults to off. With the user’s separate, informed consent and explicit send action, the server may send a supported free-text description to Nexos to produce a short suggestion. On-device rules are the default and remain usable without credentials, internet-based LLMs or Nexos. Nexos never establishes eligibility, invents resources, or replaces provider verification.

**Primary user:** Anyone in Macon-Bibb who needs help understanding where to ask about rent, utilities, SNAP or Georgia benefits.

**The differentiator:** A short, understandable first step and practical questions—not an unverified directory or another program finder.

## Explicit, agreed product scope

### Included categories

1. **Rent:** Macon-Bibb EOC rental assistance, intake and questions to ask.
2. **Utilities:** Macon-Bibb EOC utility assistance for gas, electricity and water; seasonal LIHEAP where the provider’s current page refers to it. Confirm enrollment windows and funding.
3. **SNAP and benefits:** Middle Georgia Community Food Bank SNAP application outreach; Georgia Gateway for official state application information.

The interface uses one optional free-text description. Matching and action-plan assembly use the same four curated local records whether AI is off or on. The plan provides useful questions, official phone/site links and up to three numbered actions. Unsupported or ambiguous input gets honest scope messaging rather than made-up results.

### Explicitly out of scope (never silently add)

- Emergency services and 911 guidance.
- Shelter, homelessness referral, food-pantry listings, general food-assistance referral, transit routing, 211, civic issue reporting and broader community-service directories.
- Eligibility decisions; promises or estimates of approval, funding, utility payment, benefit amount, open enrollment or rent coverage.
- Legal/financial advice; professional case assessment.
- Automatic applications, referral submission, documents, accounts, administrative dashboard or database.
- Any AI provider other than Nexos.

A request involving an out-of-scope topic is never sent to Nexos and must not return a matching local recommendation for that topic. Describe what the app does cover and ask the user to keep their description to an included category. The prototype is informational and does not replace any provider.

## Privacy and AI consent contract

- No name, contact details, complete address, date of birth, Social Security number, account information, income, image, attachment or identity question. Prominently ask users not to enter these.
- No login, database, local/session storage, application history, analytics, tracking or application-generated request/body logs. Input exists only in the current UI until reload.
- The local matching/plan path is deterministic, sends no text to any AI service and is the default for every new visitor.
- **Two explicit opt-ins:** (1) choose optional Nexos AI; (2) acknowledge that the text will go to Nexos.ai; (3) read the disclosure and select **Send description to Nexos**. Merely submitting or choosing an example MUST NOT send the text. Out-of-scope descriptions MUST NOT be sent even after opt-in. Never claim consent bypasses Nexos’s processing.
- Nexos API credential is server-only and comes from the machine’s environment. Do not send it to browser code, repository, CI logs or conversation. Do not create credentials in Hermes for this separate-machine project.
- Limit free text to 2,000 characters and requests to one non-streaming response. Use the verified resource catalogue as the only authority. Check the AI response against its schema and allowed categories. On timeout/error/bad response, show the already-computed local plan. Never persist or log user text. Send `store: false` explicitly; this requests non-storage but does not guarantee how Nexos handles data—state that Nexos policies and account settings govern retention. Only enable Nexos when team/provider settings are acceptable.
- AI’s only product role is to help phrase a concise, limited, plain-language suggestion and a category. The existing local rules remain authoritative for category match and record selection; never let a model select a non-catalogued service or overwrite a phone number. AI prose is explicitly identified as AI-generated and a suggestion.

## Initial official resources (research only; verify again at the event)

| Resource | Category | Source checked | Public contact / status |
|---|---|---|---|
| Macon-Bibb Economic Opportunity Council | Rent; utilities | [Official services page](https://www.maconbibbeoc.com/services/) | 478-738-3240 · 456 Bay Street, Macon, GA 31201. Page lists rental assistance, utility assistance (gas/electric/water), and LIHEAP and refers residents to case managers. Call first about current intake, funding, eligibility and hours. |
| Middle Georgia Community Food Bank — SNAP outreach | SNAP; benefits | [Official food/SNAP page](https://mgcfb.org/find-healthy-food/) | 478-342-3218. Official page lists a SNAP outreach coordinator for food-stamp application assistance. Contact coordinator; do not imply that the food bank decides state eligibility or acts as the statewide SNAP program. |
| Georgia Gateway | SNAP; benefits | [Official state portal](https://gateway.ga.gov/access/) | Open in a normal browser before demo. Automated verification returned HTTP 403; mark **needs-check** and avoid unsourced current hours or phone numbers. |

Sources and the first two providers’ listed contact numbers above were checked against live pages on **2026-09-26**. This is a timestamp, not a representation of current funding, intake, enrollment, open hours, personal eligibility or available support. Confirm the information again before presenting it publicly. Do not embed unsupported historical candidate resources.

## Stack and cross-machine delivery

- **Next.js, React, TypeScript**; an npm lockfile checked into the source.
- **Node.js 20.9+ and npm** are enough to reproduce and run the app. No Hermes services, deployment dependencies, separate database, provider SDK, external hosting account or committed API key.
- **CSS** mobile-first accessible single page; use an explicit browser disclosure prior to Nexos submission.
- **Nexos only, optional:** server-side Next.js API route; official endpoint `https://api.nexos.ai/v1/chat/completions`. Set a real, enabled Nexos model by exact name; model names vary, so never assume a particular model.
- **Repo deliverable:** full source, package-lock, safe environment-variable template, setup/usage guide, validated automated tests, project and phased blueprints, lint/typecheck/test/build checks, GitHub Actions CI and a transparent open-source licence. Exclude `node_modules`, build output, credentials and all `.env.local` files.

### AI configuration on another machine

Request an approved Nexos key and account-enabled model from the event team. For local development, copy `.env.example` to Git-ignored `.env.local`; set only `NEXOS_API_KEY` there. The default model is configured server-side from the existing account handoff. Never commit the key to this public repository. In deployment, use the hosting platform’s server-side secrets. Never embed a key or prefix it `NEXT_PUBLIC_`. When there is no approved key/model, test and demo using local matching; no secret is needed.

### Boot-from-clone

```sh
git clone <the published repository URL>
cd macon-resource-navigator
npm ci
npm run dev
```

Open `http://localhost:3000`. Production verification: `npm run check` then `npm start`. Share a public build only if user-directed, provider-approved, private secrets are configured securely, and explicit consent text is retained.

## Hackathon run-of-show and freeze

Thirty-minute networking → fifteen-minute local-problem briefing → three hours of build → forty-five minutes of demonstrations and judging. The on-site problem briefing and direct local-partner or resident evidence outrank pre-event guesses.

**Change-control:** Use the first networking/problem-briefing slot to check the assumed need with actual Macon participants and name a provider to verify it. If community/problem sponsors select a different urgent local issue, update scope explicitly before coding instead of disguising an unrelated problem in benefits messaging. Confirm the venue and device/network constraints once organizers share them. Freeze features with at least 30 minutes of the build window remaining for the phase gate, repeated network-off demo and short presentation rehearsal. Keep the paper/local fallback available if the venue Wi-Fi or provider access fails.

## Demo story

1. Problem: it takes a stressed resident time to understand who to call and what to ask about rent or utility assistance, or how to find SNAP support.
2. Show the form, plain-language local plan and clearly cited contact information without entering personal details.
3. Use an EOC rent/utility case plus SNAP or benefit example to show clear next actions and how both local resources remain in control.
4. Explain limits: the provider determines eligibility, funding, hours and intake; the app does not apply or promise an outcome.
5. If AI approved, demonstrate the two opt-ins and second send, and show the guidance labelled as unverified advice. Otherwise demonstrate the working local-first experience.
6. State impact candidly: effectiveness is a demo hypothesis, not measured community outcomes.

## Unresolved questions for event briefing (do not guess)

- Does the community briefing validate rent, utilities and benefits navigation as a true local priority, or should product scope change?
- Has an attendee, resident or provider partner fact-checked the exact top-two workflows and proposed community benefit?
- Does a team host a Nexos key, available model and approved processing/retention policy? If not, leave AI off.
- Which Node.js/npm versions and demo machine/network will the team use, and can judges use that same device?
- Is Georgia Gateway reachable in the event location’s ordinary browser?
- Who owns data verification, implementation, final acceptance and presenting?

## Release and acceptance gates

1. **Repository access:** accepted owner/private/public repository, code committed and pushed; another teammate can authenticate, clone, install with `npm ci` and launch with no machine-specific dependencies.
2. **Reproducibility:** the clean GitHub checkout passes lint, typecheck, all offline/unit tests and a production build; committed lockfile works on Node.js 20.9+.
3. **Source verification:** two live official sources are individually checked on hackathon day; Gateway is marked/rechecked separately; contact link and current intake warning visible.
4. **Functionality:** rent, electric/water utility, SNAP, mixed needs and neutral benefits requests all give source-matched, three-action plans.
5. **Scope/safety:** unrelated, shelter, food-directory, emergency and emergency-mixed requests are not referred, and are never sent to any model. No 911/emergency copy as implied functionality. No claim about eligibility, funding or provider state.
6. **Consent/privacy:** default mode causes zero network API requests. Selecting Nexos alone or a canned example causes zero Nexos requests. Only explicit second confirmation plus deliberate submit sends once. No browser-visible token, persisted history or user-text logs.
7. **AI resilience:** timeout, non-2xx, invalid JSON and invalid categories leave the local result intact and surface a safe error. Never include a live key or local-only credential in repository source or CI.
8. **UX/accessibility:** narrow phone viewport, keyboard, visible focus, labels, readable contrast, reduced motion, meaningful empty/loading/error states.
9. **Demo rehearsal:** repeat the primary scenario twice; complete once with the model/network unavailable; accurately communicate limits.
10. **Event feedback:** collect a reviewer’s success/concern and revise as agreed, without collecting real clients’ sensitive personal information.

**Do not describe an untested gate as passed.** A public demonstration is a distinct privacy decision: user asks, key is approved, host is approved, sensitive data and generated access logs are addressed, deployment is TLS-protected, AI is opt-in, and the product owner rechecks it. No production deployment to Hermes is in scope.
