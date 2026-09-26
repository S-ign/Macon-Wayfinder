# Macon Wayfinder

A simple, privacy-conscious guide to Macon-area **rent assistance, utility bills, SNAP, and public-benefit information**. Macon Wayfinder provides practical next steps using a curated local resource list. It does not determine eligibility, submit applications, promise funding, or cover emergencies, shelter, or unrelated services.

## Current handoff status

The repository is `S-ign/Macon-Wayfinder`. Clone it onto your own computer—the app is intended to run there, not on the Hermes server. The public repository can be cloned without GitHub credentials.

## Run locally on Windows

1. Clone the repository using the command: `git clone https://github.com/S-ign/Macon-Wayfinder.git`, then change directory into `Macon-Wayfinder`.
2. Open the project folder in Visual Studio and use **Terminal → New Terminal**; ensure the terminal is in the folder containing `app.py`.
3. Create a virtual environment, install Python dependencies and start the app:

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m streamlit run app.py
```

Open the local URL Streamlit prints, normally `http://localhost:8501`. If PowerShell blocks environment activation, use Command Prompt and run `.venv\Scripts\activate.bat`, or run `.venv\Scripts\python.exe -m pip install -r requirements.txt` and `.venv\Scripts\python.exe -m streamlit run app.py`.

## Optional AI: Nexos only

The local resource planner works without an API key. The only optional LLM provider is Nexos. For local setup, create `.streamlit/secrets.toml`:

```toml
NEXOS_API_KEY = "your-private-key"
```

This secrets file is ignored by Git. Keep the key private; do not put it in Python, commit it, or share it in chat. Restart Streamlit after setting the secret.

Form submission and examples use only local deterministic matching. Nexos is contacted only after a user opts in, sees the data-use disclosure, confirms transmission and presses its separate send button. Requests use a fixed Nexos HTTPS endpoint and are not sent if unsupported/out-of-scope. Do not transmit sensitive or identifying information. No API key is required to use the resource guide.

The app keeps no database or conversation history. This does not guarantee zero third-party retention; Nexos processing and retention follow Nexos policies and account settings. Leave AI off unless the account owner approves those settings.

## Deploy with Streamlit Community Cloud

1. Sign in at [share.streamlit.io](https://share.streamlit.io/) with GitHub and create a new app.
2. Select repository `S-ign/Macon-Wayfinder`, branch `main`, and main file path `app.py`.
3. Deploy. Community Cloud installs the Python packages from `requirements.txt`.
4. Optional: under the deployed app's **Settings → Secrets**, add `NEXOS_API_KEY = "your-private-key"`. Do not add the secret to GitHub or source files. The app works without it.

An account owner must connect and deploy the project through Streamlit Community Cloud; pushing code by itself does not publish a live Streamlit app.

## Checks

```powershell
python -m unittest discover -s tests -v
python -m py_compile app.py planner.py resources.py nexos.py
python -m streamlit run app.py
```

GitHub Actions runs the Python tests and syntax checks on pushes and pull requests.

## Supported scope

Macon-Bibb EOC rent and gas, electricity or water utility assistance; Middle Georgia Community Food Bank SNAP outreach for help applying; and official Georgia Gateway benefits information. Providers—not this app—confirm eligibility, funding, availability, intake, hours and application instructions.

Not supported: 911 or other emergencies, shelters, homelessness, food distribution or pantry directories, 211, transit, civic reports, broad resource directories, legal advice or eligibility determinations. Mixed or unrelated prompts do not produce resource recommendations for excluded needs and are never sent to Nexos.

## Official resource checks

On 2026-09-26 the Macon-Bibb EOC official page https://www.maconbibbeoc.com/services/ listed rent and gas/electric/water utility assistance, phone 478-738-3240, and 456 Bay Street, Macon, GA 31201. The Middle Georgia Community Food Bank official page https://mgcfb.org/find-healthy-food/ listed SNAP outreach at 478-342-3218. Automated access to official Georgia Gateway https://gateway.ga.gov/access/ returned HTTP 403; that resource is expressly marked needs-check until opened in an ordinary browser. Human-verify every phone, intake window, program, funding and detail at the event before demoing.

- Nexos credentials are read server-side from local ignored secrets or Streamlit Community Cloud Secrets. The API call limits text to 2,000 characters, validates response categories, times out after 12 seconds and retains the local result on failures. Do not process real client sensitive details.

See `PROJECT-BLUEPRINT.md` for product scope and `PHASED-BLUEPRINT.md` for migration status. The code is provided under the MIT License in `LICENSE`.
