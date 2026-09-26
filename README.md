# Macon Wayfinder

A privacy-conscious, portable guide to Macon-area rent, utilities, SNAP and benefits resources. Built for Hack for Humanity: Macon.

## Current handoff status

The repository is `S-ign/Macon-Wayfinder`. Clone it onto your own computer—the app is intended to run there, not on the Hermes server. GitHub access is through SSH.

## Run on a separate machine

Requires Node.js 20.9+ and npm.

```sh
git clone git@github.com:S-ign/Macon-Wayfinder.git
cd Macon-Wayfinder
npm ci
cp .env.example .env.local
# Edit .env.local and set NEXOS_API_KEY to your private Nexos key.
npm run dev
```

Open http://localhost:3000. Node.js 20.9+ and npm are required. The app works without an API key; local resource matching stays on your computer.

## Optional AI: Nexos only

Uses the OpenAI-compatible Nexos endpoint only after the user separately opts in and confirms transmission. The server-side default model, `GPT 5.6 Luna`, is from the existing Nexos account handoff.

Optional Nexos setup uses one spot only: copy `.env.example` to `.env.local` and put your private `NEXOS_API_KEY` on its single setting line. Do not put the key in application source code. `.env.local` is ignored by Git; never commit or share it. Restart `npm run dev` after adding the key. The server-side model defaults to the model recorded in the account handoff; only the single API-key setting must be supplied locally. Never use `NEXT_PUBLIC_` for a key.

By default, form submission and canned examples run only local deterministic code. They do not trigger an LLM. Nexos is optional and only sends a request after the visitor enables the feature, acknowledges the disclosure and explicitly presses its separate Send description to Nexos button. An unrelated or explicitly out-of-scope message is never sent. Do not transmit sensitive or identifying information.

The app itself keeps no conversation history and sends store=false. This does not guarantee zero third-party retention; the Nexos provider and account settings govern data processing. Leave AI off unless the account owner approves the applicable settings.

## Checks

- npm ci — reproducible install from the committed lockfile
- npm run dev — local server
- npm run lint — ESLint
- npm run typecheck — TypeScript
- npm test — local scope, source and safety tests
- npm run build — production build
- npm run check — run every check above except starting the app

## Supported scope

Macon-Bibb EOC rent and gas, electricity or water utility assistance; Middle Georgia Community Food Bank SNAP outreach for help applying; and official Georgia Gateway benefits information. Providers—not this app—confirm eligibility, funding, availability, intake, hours and application instructions.

Not supported: 911 or other emergencies, shelters, homelessness, food distribution or pantry directories, 211, transit, civic reports, broad resource directories, legal advice or eligibility determinations. Mixed or unrelated prompts do not produce resource recommendations for excluded needs and are never sent to Nexos.

## Official resource checks

On 2026-09-26 the Macon-Bibb EOC official page https://www.maconbibbeoc.com/services/ listed rent and gas/electric/water utility assistance, phone 478-738-3240, and 456 Bay Street, Macon, GA 31201. The Middle Georgia Community Food Bank official page https://mgcfb.org/find-healthy-food/ listed SNAP outreach at 478-342-3218. Automated access to official Georgia Gateway https://gateway.ga.gov/access/ returned HTTP 403; that resource is expressly marked needs-check until opened in an ordinary browser. Human-verify every phone, intake window, program, funding and detail at the event before demoing.

No accounts, analytics, database or browser-storage history. Page text remains in temporary UI memory until refresh. Nexos credentials are used only server-side. The API route limits text to 2,000 characters, validates response categories, times out after 12 seconds and retains the local result on failures. Do not process real client sensitive details.

See PROJECT-BLUEPRINT.md for scope and PHASED-BLUEPRINT.md for testable phases. The code is provided under the MIT License in `LICENSE`.
