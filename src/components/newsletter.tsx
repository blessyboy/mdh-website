"use client";

import { ArrowRight, Check } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "./ui";
import { PreviewForm } from "./preview-form";

export function Newsletter() {
  const [submitted, setSubmitted] = useState(false);
  const [consent, setConsent] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); event.currentTarget.reset(); setConsent(false); setSubmitted(true); }
  return <section className="newsletter" aria-labelledby="newsletter-title"><div className="container newsletter-inner"><div><p className="eyebrow">A little something to look forward to</p><h2 id="newsletter-title">Stay in the know.</h2><p>Hotel news, seasonal inspiration, and future offers.</p></div><div className="newsletter-form-area"><PreviewForm onSubmit={submit}><label htmlFor="newsletter-email">Your email address</label><div className="newsletter-input"><input id="newsletter-email" name="email" type="email" autoComplete="email" maxLength={254} required placeholder="you@example.com" onChange={() => setSubmitted(false)} /><Button type="submit" aria-label="Preview newsletter signup"><ArrowRight size={21} aria-hidden="true" /></Button></div><label className="consent"><input type="checkbox" required checked={consent} onChange={e => { setConsent(e.target.checked); setSubmitted(false); }} />I’d like to receive hotel news and offers.</label></PreviewForm><div className="newsletter-status" role="status">{submitted ? <p><Check size={16} aria-hidden="true" />Preview complete. Your email was not sent or saved.</p> : <p>Design preview only. No email is sent or stored.</p>}</div></div></div></section>;
}

