"use client";

import { useState } from "react";
import { buildPlan, type Action } from "@/lib/planner";
import type { Resource } from "@/lib/resources";

const examples = [
  "I need to talk with someone about SNAP and food benefits.",
  "I am behind on rent and my utility bill. What assistance should I ask about?",
  "I want to know what to ask a provider about rent assistance."
];

function ResourceLinks({ resource }: { resource?: Resource }) {
  if (!resource) return null;
  return (
    <div className="resource-links">
      {resource.phone && <a className="link-button primary-link" href={`tel:${resource.phone.replace(/[^\d+]/g, "")}`}>Call {resource.phone}</a>}
      {resource.website && <a className="link-button" href={resource.website} target="_blank" rel="noreferrer">Open official resource</a>}
    </div>
  );
}

function ActionCard({ action }: { action: Action }) {
  return (
    <article className="action-card">
      <div className="action-number" aria-hidden="true">{action.number.toString().padStart(2, "0")}</div>
      <div className="action-content">
        <span className="eyebrow">{action.label}</span>
        <h3>{action.title}</h3>
        <p>{action.detail}</p>
        {action.resource && (
          <div className="resource-preview">
            <strong>{action.resource.name}</strong>
            {action.resource.address && <span>{action.resource.address}</span>}
            {action.resource.callFirst && <span className="call-first">Call first · confirm availability, hours, and eligibility</span>}
            <ResourceLinks resource={action.resource} />
          </div>
        )}
      </div>
    </article>
  );
}

export default function Navigator() {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [useNexos, setUseNexos] = useState(false);
  const [aiAcknowledged, setAiAcknowledged] = useState(false);
  const [aiGuidance, setAiGuidance] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const plan = submitted ? buildPlan(submitted) : null;

  function processNeed(text: string) {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > 2000) return;
    setSubmitted(trimmed);
    setError("");
    setAiGuidance("");
  }

  async function sendToNexos() {
    if (!useNexos || !aiAcknowledged || !submitted || loading || plan?.ambiguous) return;
    setError("");
    setAiGuidance("");
    setLoading(true);
    try {
      const response = await fetch("/api/navigator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: submitted }),
        cache: "no-store",
      });
      const result: unknown = await response.json();
      if (!response.ok || !result || typeof result !== "object" || !("guidance" in result) || typeof result.guidance !== "string") {
        setError(result && typeof result === "object" && "error" in result && typeof result.error === "string" ? result.error : "Nexos is unavailable. Your local resource plan remains available.");
      } else {
        setAiGuidance(result.guidance);
      }
    } catch {
      setError("Nexos could not connect. Your local resource plan remains available.");
    } finally {
      setLoading(false);
    }
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void processNeed(input);
  }

  function handleExampleClick(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const example = target.dataset.example;
    if (!example) return;
    if (useNexos) { setError("Example text is never sent to Nexos. To try an example, turn off Nexos. To request optional AI guidance, enter your own in-scope description and give separate consent."); return; }
    setInput(example);
    setSubmitted(example);
    setError("");
    setAiGuidance("");
  }

  return (
    <main>
      <section className="hero">
        <div className="hero-inner">
          <p className="kicker">A MACON COMMUNITY RESOURCE GUIDE</p>
          <h1>One less maze.<br /><em>One next step.</em></h1>
          <p className="hero-copy">Plain-language guidance to help you find Macon-area rent and utility assistance, SNAP and benefits support—and work out a practical next step.</p>
          <div className="privacy-note"><span aria-hidden="true">✳</span> Your note stays in this page unless you choose to share it with Nexos AI.</div>
        </div>
      </section>

      <section className="workspace">
        <div className="input-panel">
          <div className="section-heading"><span className="step">01</span><div><h2>What kind of help do you need?</h2><p>Keep it general: for example, rent, utility bills, SNAP applications, or other benefits. Don’t enter your name, address, account information, or sensitive personal details.</p></div></div>
          <form onSubmit={submit}>
            <label htmlFor="need" className="sr-only">Describe your rent, utilities, SNAP, or benefits question</label>
            <textarea id="need" value={input} onChange={(event) => setInput(event.target.value)} placeholder="For example: I’m behind on rent, and I’d like to know who to call about utility assistance, too…" rows={5} maxLength={2000} />
            <div className="input-meta"><span>{input.length}/2,000 characters · No conversation history</span><span>Other questions get a plain-language signpost.</span></div>
            <button className="submit-button" type="submit" disabled={!input.trim() || input.length > 2000 || loading}>{loading ? "Preparing your next steps…" : "Find my next step"} <span aria-hidden="true">→</span></button>
          </form>
          <div className="privacy-choice">
            <label className="consent-row"><input type="checkbox" checked={useNexos} onChange={(event) => { setUseNexos(event.target.checked); setAiAcknowledged(false); setAiGuidance(""); setError(""); }} /><span><strong>Use Nexos AI for this request (optional)</strong><small>Your text stays on your device unless you opt in. Nexos receives your description only after you give a second confirmation and explicitly send.</small></span></label>
          </div>
          <div className="examples" onClick={handleExampleClick}><span>Try an example</span>{examples.map((example) => <button key={example} type="button" data-example={example}>{example}</button>)}</div>
        </div>

        {plan && (
          <section className="results" aria-live="polite">
            <div className="section-heading results-heading"><span className="step">02</span><div><h2>Your next practical steps</h2><p>These are starting points, not a determination of eligibility. Each organization confirms its own requirements, current funding, hours, and availability.</p></div></div>
            {useNexos && !aiAcknowledged && <p className="ai-disclosure">AI remains off until you give separate consent and deliberately select the Nexos send button. The ordinary form, example buttons, and local resource plan never send your description.</p>}
            {useNexos && !plan.ambiguous && <div className="ai-disclosure"><p><strong>Before sending:</strong> This separate button sends the description shown above to Nexos.ai, the only AI provider, for a short suggestion. Your description is not transmitted by the ordinary plan button or by an example. The app does not retain a local history. Nexos processing and retention are subject to Nexos policies and your account settings. Never send sensitive details.</p><button type="button" className="submit-button" disabled={!aiAcknowledged || !submitted || loading} onClick={() => void sendToNexos()}>{loading ? "Asking Nexos…" : "Send description to Nexos →"}</button></div>}
            {useNexos && plan.ambiguous && <p className="ai-disclosure">This description is outside the supported topics and will not be sent to Nexos. Nothing was transmitted.</p>}
            {loading && <p className="loading-message" role="status">Checking this guidance with Nexos. Your local resource plan is ready underneath.</p>}
            {error && <p className="error-message" role="alert">{error}</p>}
            {aiGuidance && <p className="ai-disclosure" role="status"><strong>Nexos guidance (confirm details with the provider):</strong> {aiGuidance}</p>}
            <div className="action-list">{plan.actions.map((action) => <ActionCard action={action} key={action.number} />)}</div>
            {plan.resources.length > 0 && <div className="sources"><h3>Grounded in existing Macon and Georgia resources</h3>{plan.resources.map((resource) => <div className="source-row" key={resource.id}><div><strong>{resource.name}</strong><span>{resource.description}</span><small>Official source · page checked {resource.verifiedAt}{resource.confidence === "needs-check" ? " · Phone first to confirm the current service" : ""}</small></div><ResourceLinks resource={resource} /></div>)}</div>}
          </section>
        )}
      </section>

      <footer><strong>This guide is about rent, utilities, SNAP, and benefits.</strong> It does not cover emergencies. It does not determine eligibility, provide legal or financial advice, promise assistance or funding, or replace speaking to a provider. Never include personal or sensitive information.</footer>
    </main>
  );
}
