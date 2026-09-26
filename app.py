from __future__ import annotations

import html
import streamlit as st
from nexos import request_guidance
from planner import build_plan

st.set_page_config(page_title="Macon Wayfinder", page_icon="✳", layout="centered")
st.markdown("""<style>
.stApp { background: #f4f1e9; color: #173d3a; }
.block-container { max-width: 900px; padding-top: 2rem; }
.hero { background: #0d2927; color: #f4f1e9; padding: 2.7rem 3rem; border-radius: 5px; margin-bottom: 1.4rem; }
.hero h1 { color: #f4f1e9; font-size: clamp(2.7rem, 7vw, 4.6rem); line-height: 1; margin: .7rem 0; }
.hero em { color: #ff927b; }
.kicker { color: #f3ca63; letter-spacing: .13em; text-transform: uppercase; font-size: .75rem; }
.hero p { color: #e4ece8; line-height: 1.6; }
.hero .privacy { color: #ffdc78; font-size: .85rem; }
.step { color: #a53c2b; font-size: .75rem; letter-spacing: .12em; font-weight: 700; }
[data-testid=stVerticalBlockBorderWrapper] { background: #fbfaf5; border-color: #d0d8d0; }
footer { color: #465b53; font-size: .9rem; }
</style>""", unsafe_allow_html=True)
st.markdown("""<header class=hero><div class=kicker>A Macon community resource guide</div><h1>One less maze.<br><em>One next step.</em></h1><p>Plain-language guidance to help you find Macon-area rent and utility assistance, SNAP and benefits support, and a practical next step.</p><p class=privacy>✳ Your note stays on this page unless you choose to share it with Nexos AI.</p></header>""", unsafe_allow_html=True)
st.markdown("<span class=step>01 — YOUR QUESTION</span>", unsafe_allow_html=True)
st.subheader("What kind of help do you need?")
st.write("Keep it general: rent, utility bills, SNAP applications, or other benefits. Do not enter your name, address, account information, or sensitive personal details.")

if "submitted_text" not in st.session_state:
    st.session_state["submitted_text"] = ""
if "ai_guidance" not in st.session_state:
    st.session_state["ai_guidance"] = ""
if "ai_error" not in st.session_state:
    st.session_state["ai_error"] = ""

with st.form("wayfinder_form"):
    text = st.text_area("Describe your question (keep it general)", key="need_input", max_chars=2000, height=130, placeholder="For example: I am behind on rent and need help with a utility bill.")
    submitted = st.form_submit_button("Find my next step →", type="primary", use_container_width=True)
if submitted:
    st.session_state["submitted_text"] = text.strip()
    st.session_state["ai_guidance"] = ""
    st.session_state["ai_error"] = ""
st.caption(str(len(st.session_state.get("need_input", ""))) + "/2,000 characters · No conversation history")

with st.expander("Try an example (local matching only)"):
    examples = [
        ("SNAP application help", "I need help applying for SNAP and food benefits."),
        ("Rent and utilities", "I am behind on rent and my utility bill."),
        ("Rent assistance", "I want to ask a provider about rent assistance."),
    ]
    cols = st.columns(len(examples))
    for col, (label, example) in zip(cols, examples):
        if col.button(label, use_container_width=True):
            st.session_state["submitted_text"] = example
            st.session_state["need_input"] = example
            st.session_state["ai_guidance"] = ""
            st.session_state["ai_error"] = ""

st.divider()
if st.session_state["submitted_text"]:
    plan = build_plan(st.session_state["submitted_text"])
    st.markdown("<span class=step>02 — YOUR NEXT STEPS</span>", unsafe_allow_html=True)
    st.subheader("Your next practical steps")
    st.write("These are starting points, not a determination of eligibility. Each organization confirms its own requirements, funding, hours, and availability.")
    if not plan["ambiguous"]:
        st.markdown("**Optional AI is separate from the local plan.** Your description stays on this device unless you opt into Nexos, check the disclosure, and press the separate send button. Never send sensitive details. Nexos processing and retention follow Nexos policies and account settings.")
        if st.checkbox("Use Nexos AI for this request (optional)", key="use_nexos"):
            confirmed = st.checkbox("I understand my description will be sent to Nexos only if I press the separate button below.", key="nexos_confirmed")
            if st.button("Send description to Nexos →", disabled=not confirmed, key="send_nexos"):
                with st.spinner("Asking Nexos; the local resource plan remains below."):
                    result = request_guidance(st.session_state["submitted_text"])
                if result.get("ok"):
                    st.session_state["ai_guidance"] = result["guidance"]
                    st.session_state["ai_error"] = ""
                else:
                    st.session_state["ai_error"] = result.get("error", "Nexos unavailable. The local plan remains available.")
    else:
        st.info("This description is outside supported topics or needs clarification. Nothing was sent to Nexos.")
    if st.session_state["ai_error"]:
        st.warning(st.session_state["ai_error"])
    if st.session_state["ai_guidance"]:
        st.markdown("**Nexos guidance is an AI-generated suggestion, not a verified source. Confirm all information with the provider.** " + html.escape(st.session_state["ai_guidance"]))
    for action in plan["actions"]:
        number = action["number"]
        label = html.escape(action["label"])
        title = html.escape(action["title"])
        detail = html.escape(action["detail"])
        st.markdown("**" + str(number).zfill(2) + " — " + label + ": " + title + "**\n\n" + detail)
        resource = action.get("resource")
        if resource:
            with st.container(border=True):
                st.markdown("**" + html.escape(resource["name"]) + "**")
                st.write(resource["description"])
                if resource.get("address"):
                    st.caption(resource["address"])
                if resource.get("call_first"):
                    st.caption("Call first · confirm availability, hours, and eligibility")
                left, right = st.columns(2)
                if resource.get("phone"):
                    left.link_button("Call " + resource["phone"], "tel:" + resource["phone"], use_container_width=True)
                right.link_button("Open official resource", resource["website"], use_container_width=True)
                checked = "Official source · page checked " + resource["verified_at"]
                if resource["confidence"] == "needs-check":
                    checked += " · confirm service in a browser"
                st.caption(checked)
    if plan["resources"]:
        st.markdown("### Sources for this request")
        for resource in plan["resources"]:
            name = html.escape(resource["name"])
            url = resource["website"]
            checked = "Official source · page checked " + resource["verified_at"]
            st.markdown("- **" + name + "** — [Official site](" + url + "), " + checked)

with st.expander("Privacy, scope, and AI details"):
    st.write("No accounts, analytics, database, or browser-storage history. The description is held in temporary page state until refresh. Local matching does not send text to AI. Nexos is optional and is contacted only after opt-in, disclosure confirmation, and a separate send button. Do not submit sensitive details.")
    st.write("This guide covers Macon-area rent, utilities, SNAP application help, and public-benefit information. It does not cover emergencies, shelter, homelessness, general food distribution, or unrelated services, and does not determine eligibility or promise funding.")
st.markdown("**This guide is about rent, utilities, SNAP, and benefits.** It does not cover emergencies, determine eligibility, provide legal or financial advice, or promise assistance or funding. Never include personal or sensitive information.")
