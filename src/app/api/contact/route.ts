import { validateContact, validEmail } from "@/lib/contact";
import { createContactHandler } from "@/server/contact-service";
import { sendContactMail } from "@/server/contact-mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = createContactHandler({
  validate: validateContact,
  send: sendContactMail,
  config: () => {
    const from = process.env.CONTACT_FROM_EMAIL?.trim() || "";
    const to = process.env.CONTACT_TO_EMAIL?.trim() || "blessyarthur@gmail.com";
    return {
      apiKey: process.env.RESEND_API_KEY?.trim() || "",
      from: validEmail(from) ? from : "",
      to: validEmail(to) ? to : "",
      siteOrigin: process.env.CONTACT_SITE_ORIGIN?.trim() || undefined,
      trustProxy: process.env.CONTACT_TRUST_PROXY === "true",
    };
  },
});
