import Link from "next/link";
import { notFound } from "next/navigation";
import { hotelContact } from "@/data/contact";

const policies = {
  privacy: { title: "Privacy Policy", sections: [
    ["Contact enquiries", "When you submit our contact form, we use your name, email address, optional phone number, subject, optional stay dates, privacy consent, and message to respond to your enquiry. Messages are delivered through Resend to the hotel's designated inbox. Please do not include payment card details or sensitive personal information."],
    ["Technical safeguards", "The contact service checks submissions for validity and abuse. Temporary request identifiers and rate-limit records help prevent duplicate messages and excessive requests."],
    ["Your information", "Contact the hotel using the details below to ask about your enquiry information or request a correction or deletion. The hotel can explain any retention requirements that apply to your correspondence."],
  ] },
  terms: { title: "Terms & Conditions", sections: [
    ["Planning your visit", "This website provides information to help you plan a stay. The current booking flow prepares a stay summary; it does not confirm availability, take payment, or create a reservation. Please contact the hotel for confirmation."],
    ["Rates and reservations", "Room rates are displayed in Ghana cedis per night. Confirm availability, taxes, fees, inclusions, payment requirements, and cancellation conditions with the hotel before making a reservation. A contact-form submission is an enquiry, not a booking confirmation."],
    ["Website information", "Some website photographs are illustrative. Facilities and service details marked as awaiting confirmation should be checked with the hotel before travel."],
  ] },
  cookies: { title: "Cookie Policy", sections: [
    ["Current website", "The current website does not include advertising trackers, analytics integrations, or optional cookie-based marketing tools. Fonts are hosted locally. The contact form uses a request identifier to prevent duplicate submissions."],
    ["External services", "Map and review links open external websites. Those websites have their own privacy and cookie practices. The optional Google Maps preview loads only when you select Load Google Maps. Loading it connects your browser to Google, whose privacy and cookie policies apply."],
    ["Browser controls", "You can manage cookies and site data in your browser settings. Contact the hotel if you have questions about the technologies used on this website."],
  ] },
} as const;
export function generateStaticParams() { return Object.keys(policies).map(policy => ({ policy })); }
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ policy: string }> }) {
  const { policy } = await params;
  return { title: `${policies[policy as keyof typeof policies]?.title || "Policy"} | Meridian Drive Hotel` };
}
export default async function PolicyPage({ params }: { params: Promise<{ policy: string }> }) {
  const { policy } = await params;
  if (!(policy in policies)) notFound();
  const content = policies[policy as keyof typeof policies];
  return <main id="main-content" className="container policy-page"><p className="eyebrow">Meridian Drive Hotel</p><h1>{content.title}</h1>{content.sections.map(([title, text]) => <section key={title}><h2>{title}</h2><p>{text}</p></section>)}<h2>Contact the hotel</h2><p><a href={`mailto:${hotelContact.emails[0]}`}>{hotelContact.emails[0]}</a></p><Link href="/contact">View all contact details</Link></main>;
}
