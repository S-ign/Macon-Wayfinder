# Macon Wayfinder — independently testable build phases

**Event:** Hack for Humanity: Macon\
**Product:** Macon Wayfinder\
**Confirmed scope:** rent, utilities, SNAP and benefits only. No 911/emergencies; no 211, shelter, homelessness, food-pantry listings, or transit.\
**Models:** Nexos only for separately consented requests; local deterministic results are the default.\
**Deployment:** portable code and lockfile pushed to GitHub for teammates to clone and run on a separate machine. Never deploy this MVP on the Hermes server.\
**Working rule:** Phases are independently inspectable and have explicit stop/go acceptance. Finish and verify each phase before its next dependent phase. Leave at least 30 minutes of the three-hour onsite build for freeze, end-to-end checks and demo rehearsal.

## Global safety/acceptance rules

- Do not solicit or store name, contact data, address, SSN, financial details or documents. Do not add sessions, accounts, analytics, advertising, database or chat history.
- Only contact Nexos after the user checks its optional control, reads an accurate data disclosure and explicitly presses its dedicated Nexos-send button. Selecting an example or hitting the ordinary local action button never sends AI text. Never automatically send an unrecognized/out-of-scope prompt.
- Put the Nexos key only in ignored local `.env.local` as `NEXOS_API_KEY`; never hard-code it or commit it to this public repository. `GPT 5.6 Luna` is the server-side model constant backed by the existing Nexos account handoff.
- Only rent, gas/electricity/water utilities, SNAP application help and public benefits. Emergency, housing, food pantries, 211 and every other category are excluded. An out-of-scope phrase must not produce a relevant provider, route to AI, add an emergency CTA or imply nonexistent safety coverage.
- Never assert eligibility, processing status, available funds, service intake, an open LIHEAP season, current appointment or approval. The provider is the sole authority; link and phone first to confirm.
- The curated and date-stamped resource list controls resource selection. AI cannot invent providers, contacts, eligibility or resource facts. Invalid/timeout/model failure must leave local results working.
- Program dates, phone numbers, model/keys, network and repository permissions are rechecked instead of assumed.

## Current implementation verification (2026-09-26)

- A reproducible local `npm ci` succeeded on the current Node 22 environment. `npm run check` passed (lint, typecheck, all 38 tests, and optimized Next.js build) after a clean fix; localhost production smoke returned HTTP 200 and the blank navigator request returned HTTP 400.
- Nexos route uses the documented fixed Gateway URL and keeps its key server-side; real Nexos authentication/model was not testable without owner-provided configuration. It fails closed for unknown/out-of-scope local input before provider transmission, and preserves deterministic on-device plans.
- Local no-match/out-of-scope results return no provider recommendations. The checked resource sources include EOC and MGCFB; Georgia Gateway remains `needs-check` due automated HTTP 403. Recheck human-facing source pages before demo.
- The public repository `S-ign/Macon-Wayfinder` is being prepared for its first push using the authorized `id_ed25519_github_motoko` SSH key. Verify remote commit read-back and a clean teammate clone before calling publication complete.
- No real consumer validation, fresh-host teammate clone, live Nexos request, Gateway browser verification, or event-day rehearsal has yet been recorded.

## Phase 0 — Product lock and isolated repository

**Purpose:** Preserve the five confirmed decisions before implementation and give the app its own portable, secret-free Git repository.

**Tasks**

1. Confirm in the README/project brief: Nexos only for LLM; remote transmission happens only with specific user consent; rent/utilities/SNAP/benefits only; no emergency routing; recommendations are source-grounded; use a private opt-in not public-default AI.
2. Document the explicit event assumptions and invite the actual local briefing to correct the scope. Do not inflate user-answered questions back into undecided work.
3. Produce clean root, source layout, standalone package manifest, Next.js config, npm lockfile, ignore rules for build, dependencies and environment secrets, populated safe-only `.env.example`, developer commands and a no-database local run.
4. Initialise this project’s **own** git repository, check every staged pathname, make a first commit, set up GitHub Actions CI, create/select the user-approved remote visibility, push, read remote commit back and verify an unauthenticated teammate can clone it. Obtain the owner, visibility and credentials deliberately. Do not search unrelated profile/services config, assume the remote or create an unapproved public repository.
5. Ask no one to paste a private PAT/key into conversation. This authorized public repository uses the dedicated GitHub SSH key. Verify its pushed refs and an independent clean clone before treating handoff as complete.

**Test**

- Verify only the intended project files are in source control. Ensure `node_modules`, `.next`, credentials, key-like values and `.env.local` do not stage.
- Check valid lockfile, `npm ci` reproducibility, `git status --short`, commit list, remote push and clone on another independently scoped machine when authenticated.

**Gate 0 — portability passes when** another authorized user can cleanly clone the *published* exact commit, run `npm ci` and start it without host access or credentials. Confirm the named public repository and clean-clone installation before calling remote portability complete.

## Phase 1 — source-backed four-category data contract

**Purpose:** Produce a small dataset an actual resident or provider can check.

**Tasks**

1. Check Macon-Bibb EOC’s own current services page and phone for rent, gas, electricity and water assistance and LIHEAP; mark seasonal/funding detail conditional.
2. Check MGCFB’s own live SNAP outreach page and application-help phone.
3. Open Gateway in an ordinary browser and verify the official portal. An HTTP 403 automation response is not proof the real site works; mark needs-check and do not display made-up Gateway details.
4. Keep precisely four intent values: `rent`, `utilities`, `snap`, `benefits`. Use typed local records for provider name, supported purpose, source URL, date, phone/map if verified and visible confidence/call-first caution.
5. Never reintroduce unused food-bank directory, shelter, transit, 211, medical, employment or general resource candidates from superseded research.

**Test**

- Required fields/nonempty text; unique IDs; valid category; valid HTTPS source/site URLs; syntactically valid verified phone; explicit ISO date; explicit needs-check badge; zero unsupported categories.
- Run an accepted-sources smoke check. A connection or stale-looking date is not accepted as proof of public accessibility.

**Gate 1 passes** when three provider records reflect checked original sources, Gateway caveat appears truthfully, and the dataset validator passes.

## Phase 2 — transparent classification and offline action plan

**Purpose:** Give a deterministic, useful answer with no model key, network, cost or personally identifiable input.

**Tasks**

1. Normalize text and detect phrases for rent (including clearly related rental and eviction paperwork), utilities, SNAP and non-specific state benefits. Detect more than one supported category without narrowing a combined case to just one.
2. Detect out-of-scope and unrelated terms before matching. If any phrase makes the user’s actual need unclear or explicitly mentions an excluded matter, return zero recommendations and a simple clarification. A word that occurs inside another word must not trigger a false category.
3. Rank and select only the curated local source records for the recognized categories. Never synthesize contact data.
4. Compose no more than three simple, clearly numbered steps: contact one appropriate provider, ask its own current program/funding/eligibility questions, then follow the provider’s own instructions. Avoid filler, guarantees, invented required paperwork or repetitive “three steps” just for count’s sake.
5. Make resource provenance and user-facing caveat unambiguous.

**Test**

Fixtures cover rent, rental assistance, electric/water bills, LIHEAP, SNAP/EBT, general public-benefit info, multiple supported needs, antonyms/irrelevant cases, free food/pantries, shelter, crisis/911, mixed in-scope/out-of-scope, incomplete and empty prompts. Assert every matched source belongs to the checked local catalogue; nonmatches return no false-positive recommendation and a safe clarification. `buildPlan` never fetches a remote URL.

**Gate 2 passes** when offline unit tests prove each scenario, unsupported and ambiguous content gives no misleading referral, and each supported result has a locally testable provider action.

## Phase 3 — mobile-first single-page user flow

**Purpose:** Let a community member independently find the first trustworthy step.

**Tasks**

1. Build a labeled free-text-only form, maximum 2,000 characters; show plain language and an assertive not-to-enter-sensitive-information note.
2. Populate examples for only the included topics. An example applies local rules; it must never activate Nexos sending.
3. Render local source-grounded numbered cards, verified contact buttons, visible verification dates/caveats and safe no-match explanations.
4. Default to “no LLM.” State plainly that local calculations keep text on the device. Show the optional Nexos toggle, explicit separate data-sharing acknowledgement and dedicated send button only when a result is in scope. Display provider-processing qualification immediately before sending; consent cannot be implicit.
5. Make examples/contact/site usable by keyboard and screen reader; visible focus, good contrast, responsive phone view and reduced-motion support. No required external font/network for the basic app if offline data must work.

**Test**

- UI tests or documented manual proofs cover empty and max input, edit/example, form submit, no accidental double submits, in-scope plans, no-match and accessibility keyboard navigation.
- Toggle AI and confirm no request; submit an example and confirm no request; AI selection alone and consent acknowledgement alone each send zero requests. Unrelated and mixed requests send zero. Only deliberate supported request and send button produces one POST.
- Verify phone and official provider links and no required external assets at phone widths.

**Gate 3 passes** after an unfamiliar tester identifies the correct first provider action without coaching and the browser has no implicit-send path.

## Phase 4 — Nexos server route, consent and graceful fallback

**Purpose:** Add an optional, replaceable single-provider interpretation improvement without making the community flow depend on AI.

**Tasks**

1. Use official Nexos docs; connect `POST https://api.nexos.ai/v1/chat/completions` with user’s approved model, schema/JSON-mode-constrained category and brief guidance, `n: 1`, non-streaming, `max_completion_tokens` cap and explicit `store: false`. Use server-side `Authorization: Bearer` credentials only. Never select any provider other than Nexos.
2. Verify key and exact enabled model configuration; absent/placeholder credential or model gives a friendly local-mode warning, never causes a fabricated “success.” Add safe ignored local env and secrets docs.
3. Keep classification, mixed scope, resource ranking and actions rules-based from the source catalogue. Ignore malformed and invalid AI classifications. Do not let an unsupported case reach external API.
4. Include an informative pre-send disclosure and separate checkbox and send-button interaction. Ensure the ordinary form, including when AI is enabled, renders local results without triggering a request. Do not preserve history after a refresh. Never capture request bodies or credentials in server logs.
5. Add timeout (12s), input guard (2,000 chars), typed schema checks and terse nonrevealing API errors. On API error keep the full local action plan and tell the user which path is in effect.

**Test**

Mock server route request/response. Verify invalid JSON/blank/oversize input, missing config, valid categories, unknown/malformed/empty/injected response, provider 4xx/5xx, delayed timeout, wrong role/shape, safe fallback, stored=false in every valid completion request, fixed hostname/URL, absence of credentials from returned JSON, and that categories/resources returned never escape local catalogue. Test that UI text goes nowhere until deliberate send.

**Gate 4 passes** with deterministic no-key operation and fake-tested Nexos success/error cases; any unapproved data handling or real key leaves the feature disabled.

## Phase 5 — one-command reproducible build

**Purpose:** Hand off a dependency-contained and repeatable package to the hackathon laptop.

**Tasks**

1. Commit the project-only npm lockfile, explicit supported Node version, clear `README.md` clone/run/env/security guide, local-only `.env.example`, Git ignore for all secrets/build files, licenses and project/product docs.
2. Add clean GitHub Actions CI for Node 20/22: `npm ci`, lint, TypeScript typecheck, unit tests and production build. Do not expose secrets in CI.
3. Perform a real fresh worktree or independent temporary Git clone of the actual commit and run `npm ci` from there (not only existing `node_modules`). Do not publish fake remotes if GitHub is not authenticated.

**Test**

`npm run check` from fresh install; CI workflow syntax and completed status; run `npm start` on a separately available port and HTTP-smoke-check the actual start, local resource rendering, supported examples, API failure response and security headers. Check no API key or sensitive scratch file in tracked source.

**Gate 5 passes** when the same commit starts successfully on a teammate’s independent machine; otherwise accurately mark which network/authentication action blocked it.

## Phase 6 — rehearsal, community feedback and acceptance

**Purpose:** Demonstrate the accepted scope accurately, comfortably and safely on event day.

**Tasks**

1. Re-verify official provider contact on event day and mark what was (and was not) verified. Browser-check Gateway and Nexos reachability on intended device/network. Do not say data is current solely because its stored date exists.
2. Seek consent-based local feedback; never trial the app by collecting real sensitive case histories. Check whether the event problem brief/supporting resident validates rent/utility/SNAP navigation as a significant gap before claiming “the community’s problem.”
3. Use clearly hypothetical neutral example. Show included topics only. Demonstrate AI only after receiving real provider permission and account/model, plus successful controlled end-to-end test. Otherwise demo local mode.
4. Repeat scenario, AI disabled; verify server returns no key/model/AI-required error to normal user; confirm offline resources; practice a concise “current availability determined by provider” message.
5. Freeze changes with 30+ minutes left. During 45-minute demos/judging answer honestly about metrics: research/design intent is not measured outcomes.

**Gate 6 passes** when independent fresh-clone, ordinary supported category, unsupported/out-of-scope category and no-AI fallback all work from the event device, dates/provider/repository are checked, and the team can explain consent and data handling correctly.

## Responsibility/final event decisions

| Decision/owner | Current status | Acceptance action |
|---|---|---|
| User-approved GitHub owner and repository visibility | Must verify | Grant repo owner / auth; preserve privacy preference; verify remote exact commit and fresh clone. |
| Nexos organization/account and API key | Must verify | Event team provides; enter privately into external developer machine. Never request in this chat. |
| Exact model string authorized by account | Must verify | Verify inside authorized Nexos account. the server-side model is the documented `GPT 5.6 Luna` account-handoff model, not another environment variable. |
| Nexos data retention and sharing permission | Must verify | Review provider/workspace terms; keep LLM off without authorization. |
| Local community validation/briefing | Event time | Confirm priority before final feature freeze. |
| Official source/contact day-of refresh | Event time | Assign a human to check and report actual result in fresh clone. |
| Teammate device / Node / network | Event time | Verify clone, `npm ci`, supported browser and venue. |

## Phase record

| Phase | Status | Required verifiable evidence |
|---|---|---|
| 0 · Product lock / repository | Authorized `S-ign/Macon-Wayfinder` remote configured; first commit and push underway | Read back pushed commit, check workflow, test clean teammate clone. |
| 1 · Source data | EOC + MGCFB checked; Georgia Gateway remains marked needs-check (automated HTTP 403) | Event-day official-source recheck; human Gateway verification. |
| 2 · Local safety/rules | Local deterministic planner and scoped-data tests implemented; `npm run check` passed locally | Expand adversarial mixed-content fixtures and event-team review. |
| 3 · UX/privacy | Local-first UI with separate disclosure, checkbox, send action; production homepage smoke passed | Manual keyboard/screenreader and phone-width review remains. |
| 4 · Nexos adapter | Implemented; 12 mocked route tests pass; Nexos remains disabled by default; no live credential/model available | Human privacy/account review; optional authorized controlled test. |
| 5 · portable release | Package files, lockfile, Node 20/22 CI workflow present; clean install/check pass on current machine. No independent fresh clone or CI run. | Authenticated GitHub release and independent teammate clone. |
| 6 · event rehearsals | Not started | Day-of sources and local feedback, offline rehearsal and sign-off. |

### Proposed live milestone boundaries

- **Milestone 1:** clean product boundaries, current source evidence and deterministic matching tests. Pause for review before presenting names or categories outside scope.
- **Milestone 2:** local-first UI and consent affordance. Verify there is no provider request in the ordinary case before adding Nexos.
- **Milestone 3:** optional server-only Nexos route and negative/error tests. Keep consent and no-key fallback.
- **Milestone 4:** fresh-machine, GH CI, day-of check and rehearsed offline judging story. Freeze features.
