"use client";
import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { contactSubjects, validateContact, type ContactMessage } from "@/lib/contact";
import { Button } from "./ui";
import { PreviewForm } from "./preview-form";
const empty: ContactMessage = { name: "", email: "", phone: "", subject: "", message: "" };
export function ContactForm() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactMessage, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const errorSummary = useRef<HTMLDivElement>(null);
  function change(field: keyof ContactMessage, value: string) { setValues(current => ({ ...current, [field]: value })); setErrors(current => ({ ...current, [field]: undefined })); setSubmitted(false); }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const nextErrors = validateContact(values); setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) { setSubmitted(true); setValues(empty); }
    else { setSubmitted(false); requestAnimationFrame(() => errorSummary.current?.focus()); }
  }
  const hasErrors = Object.values(errors).some(Boolean);
  return <PreviewForm className="contact-form" noValidate onSubmit={submit} aria-describedby="contact-form-note"><p className="eyebrow">Let’s start a conversation</p><h2>We’d love to hear from you.</h2><p id="contact-form-note" className="form-description">This is a form preview. Your message will not be sent or saved.</p>
    {hasErrors && <div className="form-error" role="alert" tabIndex={-1} ref={errorSummary}><strong>Please check the highlighted fields.</strong><ul>{Object.entries(errors).filter(([, error]) => error).map(([field, error]) => <li key={field}><a href={`#contact-${field}`}>{error}</a></li>)}</ul></div>}
    <div className="form-grid"><label htmlFor="contact-name">Name <span aria-hidden="true">*</span><input id="contact-name" name="name" autoComplete="name" required maxLength={100} value={values.name} onChange={e => change("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />{errors.name && <span className="field-error" id="name-error">{errors.name}</span>}</label><label htmlFor="contact-email">Email <span aria-hidden="true">*</span><input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} value={values.email} onChange={e => change("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />{errors.email && <span className="field-error" id="email-error">{errors.email}</span>}</label><label htmlFor="contact-phone">Phone <span className="optional">(optional)</span><input id="contact-phone" name="phone" type="tel" autoComplete="tel" maxLength={30} value={values.phone} onChange={e => change("phone", e.target.value)} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} />{errors.phone && <span className="field-error" id="phone-error">{errors.phone}</span>}</label><label htmlFor="contact-subject">Subject <span aria-hidden="true">*</span><select id="contact-subject" name="subject" required value={values.subject} onChange={e => change("subject", e.target.value)} aria-invalid={!!errors.subject} aria-describedby={errors.subject ? "subject-error" : undefined}><option value="">Select a subject</option>{contactSubjects.map(subject => <option key={subject}>{subject}</option>)}</select>{errors.subject && <span className="field-error" id="subject-error">{errors.subject}</span>}</label></div>
    <label className="message-label" htmlFor="contact-message">Your message <span aria-hidden="true">*</span><textarea id="contact-message" name="message" rows={6} required minLength={10} maxLength={3000} value={values.message} onChange={e => change("message", e.target.value)} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : "message-help"} />{errors.message ? <span className="field-error" id="message-error">{errors.message}</span> : <span id="message-help" className="field-hint">10–3,000 characters. Please leave out sensitive personal information.</span>}</label>
    <div className="contact-form-bottom"><p className="fine-print">* Required fields</p><Button type="submit">Preview your enquiry<ArrowRight size={17} aria-hidden="true" /></Button></div><div role="status" className="contact-status">{submitted && <p><Check size={18} aria-hidden="true" />Your enquiry passed validation. This preview did not send or save it.</p>}</div>
  </PreviewForm>;
}

