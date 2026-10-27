"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { contactSubjects, validateContact, type ContactMessage } from "@/lib/contact";
import Link from "next/link";
import { Button } from "./ui";
import { PreviewForm } from "./preview-form";
const empty: ContactMessage = { name: "", email: "", phone: "", subject: "", message: "", checkIn: "", checkOut: "", privacyConsent: false };
export function ContactForm() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactMessage, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [serverError, setServerError] = useState("");
  const [website, setWebsite] = useState("");
  const requestKey = useRef<string | null>(null);
  const sending = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const serverErrorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const errorSummary = useRef<HTMLDivElement>(null);
  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => { if (status === "sent") successRef.current?.focus(); if (status === "failed") serverErrorRef.current?.focus(); }, [status]);
  function change(field: keyof ContactMessage, value: string | boolean) {
    if (sending.current) return;
    setValues(current => ({ ...current, [field]: value })); setErrors(current => ({ ...current, [field]: undefined }));
    setStatus("idle"); setServerError(""); requestKey.current = null;
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const nextErrors = validateContact(values); setErrors(nextErrors);
    if (sending.current) return;
    if (Object.keys(nextErrors).length) { setStatus("idle"); setServerError(""); requestAnimationFrame(() => errorSummary.current?.focus()); return; }
    sending.current = true; setStatus("sending"); setServerError("");
    requestKey.current ??= crypto.randomUUID();
    controller.current = new AbortController();
    const timeout = window.setTimeout(() => controller.current?.abort(), 18_000);
    try {
      const sent = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": requestKey.current }, body: JSON.stringify({ ...values, website }), signal: controller.current.signal });
      const body = await sent.json();
      if (!sent.ok || body.ok !== true) {
        if (body.fields && typeof body.fields === "object") {
          const fieldErrors: Partial<Record<keyof ContactMessage, string>> = {};
          for (const field of Object.keys(empty) as (keyof ContactMessage)[]) if (typeof body.fields[field] === "string") fieldErrors[field] = body.fields[field];
          setErrors(fieldErrors);
        }
        setServerError(typeof body.error === "string" ? body.error : "We could not send your message. Please try again or contact the hotel directly."); setStatus("failed");
        return;
      }
      setStatus("sent"); setValues(empty); setWebsite(""); requestKey.current = null;
    } catch {
      setServerError("We could not confirm your message was sent. Please retry, or call or email the hotel directly."); setStatus("failed");
    } finally { window.clearTimeout(timeout); sending.current = false; controller.current = null; }
  }
  const hasErrors = Object.values(errors).some(Boolean);
  return <PreviewForm className="contact-form inquiry-form" noValidate onSubmit={submit} busy={status === "sending"} noScriptMessage="Enable JavaScript to send this form, or use the phone numbers and email links on this page." aria-describedby="contact-form-note"><p className="inquiry-eyebrow">Make room for something memorable</p><h2>Send Us a Message</h2><p id="contact-form-note" className="form-description">We would love to hear from you. Tell us about your travel plans and we will get back to you shortly.</p>
    <div className="contact-trap" aria-hidden="true"><label htmlFor="contact-website">Leave this field empty<input id="contact-website" name="website" autoComplete="off" tabIndex={-1} value={website} onChange={event => setWebsite(event.target.value)} /></label></div>
    {hasErrors && <div className="form-error" role="alert" tabIndex={-1} ref={errorSummary}><strong>Please check the highlighted fields.</strong><ul>{Object.entries(errors).filter(([, error]) => error).map(([field, error]) => <li key={field}><a href={`#contact-${field}`}>{error}</a></li>)}</ul></div>}
    <div className="form-grid"><label htmlFor="contact-name">Full Name <span aria-hidden="true">*</span><input id="contact-name" name="name" autoComplete="name" required maxLength={100} value={values.name} onChange={e => change("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />{errors.name && <span className="field-error" id="name-error">{errors.name}</span>}</label><label htmlFor="contact-email">Email Address <span aria-hidden="true">*</span><input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} value={values.email} onChange={e => change("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />{errors.email && <span className="field-error" id="email-error">{errors.email}</span>}</label><label htmlFor="contact-phone">Phone Number <span className="optional">(optional)</span><input id="contact-phone" name="phone" type="tel" autoComplete="tel" maxLength={30} value={values.phone} onChange={e => change("phone", e.target.value)} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} />{errors.phone && <span className="field-error" id="phone-error">{errors.phone}</span>}</label><label htmlFor="contact-subject">Subject <span aria-hidden="true">*</span><select id="contact-subject" name="subject" required value={values.subject} onChange={e => change("subject", e.target.value)} aria-invalid={!!errors.subject} aria-describedby={errors.subject ? "subject-error" : undefined}><option value="">Select a subject</option>{contactSubjects.map(subject => <option key={subject}>{subject}</option>)}</select>{errors.subject && <span className="field-error" id="subject-error">{errors.subject}</span>}</label>
      <label htmlFor="contact-checkIn">Preferred Check-in Date <span className="optional">(optional)</span><input id="contact-checkIn" name="checkIn" type="date" min={new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Accra" })} value={values.checkIn || ""} onChange={e => change("checkIn", e.target.value)} aria-invalid={!!errors.checkIn} aria-describedby={errors.checkIn ? "checkIn-error" : undefined} />{errors.checkIn && <span className="field-error" id="checkIn-error">{errors.checkIn}</span>}</label>
      <label htmlFor="contact-checkOut">Preferred Check-out Date <span className="optional">(optional)</span><input id="contact-checkOut" name="checkOut" type="date" min={values.checkIn || new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Accra" })} value={values.checkOut || ""} onChange={e => change("checkOut", e.target.value)} aria-invalid={!!errors.checkOut} aria-describedby={errors.checkOut ? "checkOut-error" : undefined} />{errors.checkOut && <span className="field-error" id="checkOut-error">{errors.checkOut}</span>}</label>
    </div>
    <label className="message-label" htmlFor="contact-message">Your message <span aria-hidden="true">*</span><textarea id="contact-message" name="message" placeholder="Tell us how we can help..." rows={5} required minLength={10} maxLength={3000} value={values.message} onChange={e => change("message", e.target.value)} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : "message-help"} />{errors.message ? <span className="field-error" id="message-error">{errors.message}</span> : <span id="message-help" className="field-hint">10–3,000 characters. Please leave out sensitive personal information.</span>}</label>
    <div className="inquiry-consent"><div><input id="contact-privacyConsent" type="checkbox" name="privacyConsent" required checked={values.privacyConsent === true} onChange={e => change("privacyConsent", e.target.checked)} aria-invalid={!!errors.privacyConsent} aria-describedby={errors.privacyConsent ? "privacyConsent-error" : undefined} /><label htmlFor="contact-privacyConsent">I agree to the <Link href="/policies/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy<span className="sr-only"> (opens in a new tab)</span></Link> <span aria-hidden="true">*</span></label></div>{errors.privacyConsent && <span className="field-error" id="privacyConsent-error">{errors.privacyConsent}</span>}</div>
    <div className="contact-form-bottom"><p className="fine-print">* Required fields</p><Button type="submit" disabled={status === "sending"}>{status === "sending" ? <>Sending Inquiry<LoaderCircle className="sending-spinner" size={17} aria-hidden="true" /></> : <>Send Inquiry<ArrowRight size={17} aria-hidden="true" /></>}</Button></div>
    {serverError && <div className="form-error contact-server-error" role="alert" tabIndex={-1} ref={serverErrorRef}>{serverError}<p>You can also use the email links or phone numbers on this page.</p></div>}
    <div role="status" aria-live="polite" className="contact-status" tabIndex={-1} ref={successRef}>{status === "sent" && <p><Check size={18} aria-hidden="true" />Thank you. Your message has been submitted to the hotel. We’ll reply using your email address.</p>}</div>
  </PreviewForm>;
}

