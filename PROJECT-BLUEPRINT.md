# Product Blueprint: Macon Wayfinder

## Summary

Macon Wayfinder is a privacy-conscious local guide to Macon-area rent, utilities, SNAP, and public-benefit resources. It provides next steps and official provider information; it does not decide eligibility, submit applications, promise assistance, or cover emergencies/shelter.

## Confirmed boundaries

- Included: rent assistance, utility bills, SNAP application help, and public benefits information.
- Excluded: 911/emergencies, shelter, homelessness, food pantry/directory referrals, transit, and unrelated services.
- Local deterministic matching works without credentials and never sends text to an AI provider.
A zero-cost, offline-capable local planner is the default. Nexos is the only optional AI provider; user descriptions are transmitted only after opt-in, disclosure confirmation, and a separate send action.

- Do not request sensitive details or persist descriptions in accounts/databases. Never store API keys in source or public Git.
- Providers—not the app—confirm current programs, eligibility, funding, hours, and instructions.

## Resources

The current curated list uses Macon-Bibb EOC for rent/utilities, Middle Georgia Community Food Bank for SNAP outreach, and the official Georgia Gateway benefits portal. The Gateway entry is marked for caution because automated access previously returned HTTP 403; verify provider details before public use.

## Implementation

- `app.py`: Streamlit user interface.
- `resources.py`: curated records and local matching.
- `planner.py`: deterministic action plan.
- `nexos.py`: optional fixed-endpoint Nexos adapter, bounded response and timeout.
- `tests/`: planner, API and Streamlit UI checks.
- `requirements.txt`: Python dependency declaration.
- `.github/workflows/ci.yml`: Python tests, syntax check, and Streamlit smoke check.

## Run and deploy

Local: create a Python virtual environment, install `requirements.txt`, then run `python -m streamlit run app.py`. Nexos credentials, if used, belong in ignored `.streamlit/secrets.toml`.

Cloud: connect `S-ign/Macon-Wayfinder` to Streamlit Community Cloud and set `app.py` as the entry point. Store any Nexos key only in the private Cloud Secrets panel. A repository push alone does not create a cloud deployment.

## Acceptance

Run the complete Python test suite, syntax check, and Streamlit app startup. Verify the pushed commit in the existing GitHub repository and separately confirm any Cloud deployment before calling them complete. Recheck source details before a public demo.
