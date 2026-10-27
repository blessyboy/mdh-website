import type { ContactMessage } from "../lib/contact";
import type { MailConfig, SendResult } from "./contact-service";

// API key, sender and recipient are server-only; never accept them from the form.
export function contactMailPayload(message: ContactMessage, config: MailConfig, id: string) {
  return {
    from: `Meridian Drive Hotel <${config.from}>`,
    to: [config.to],
    reply_to: message.email,
    subject: `Hotel website enquiry: ${message.subject}`,
    text: ["New enquiry from the Meridian Drive Hotel website", `Reference: ${id}`, "", `Name: ${message.name}`, `Email: ${message.email}`, `Phone: ${message.phone || "Not provided"}`, `Subject: ${message.subject}`, `Preferred check-in: ${message.checkIn || "Not specified"}`, `Preferred check-out: ${message.checkOut || "Not specified"}`, `Privacy policy agreed: ${message.privacyConsent === true ? "Yes" : "No"}`, "", message.message].join("\n"),
  };
}

export async function sendContactMail(message: ContactMessage, config: MailConfig, id: string, fetcher: typeof fetch = fetch): Promise<SendResult> {
  if (!config.apiKey || !config.from || !config.to) return "unconfigured";
  try {
    const sent = await fetcher("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `hotel-contact/${id}` },
      body: JSON.stringify(contactMailPayload(message, config, id)),
      signal: AbortSignal.timeout(12_000),
      cache: "no-store",
    });
    if (!sent.ok) {
      const error = await sent.json().catch(() => ({}));
      const message = typeof error.message === "string" ? error.message.toLowerCase() : "";
      const reason = message.includes("domain") && message.includes("not verified") ? "sender_domain_not_verified"
        : message.includes("only send testing emails") ? "resend_testing_restriction"
        : typeof error.name === "string" && /^[a-z_]{1,80}$/.test(error.name) ? error.name : "provider_rejection";
      // No addresses, message bodies, authorization headers, or provider text.
      console.error(JSON.stringify({ event: "contact_mail_rejected", status: sent.status, reason, reference: id }));
      return "failed";
    }
    const body: unknown = await sent.json();
    return body && typeof body === "object" && "id" in body && typeof body.id === "string" && body.id ? "accepted" : "failed";
  } catch {
    console.error(JSON.stringify({ event: "contact_mail_failed", reason: "network_or_timeout", reference: id }));
    return "failed";
  }
}
