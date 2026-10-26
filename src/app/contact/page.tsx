import type { Metadata } from "next";
import { ArrowUpRight, Mail, MapPin, Phone, Navigation, MessageSquare } from "lucide-react";
import { PageIntro } from "@/components/page-intro";
import { ContactForm } from "@/components/contact-form";
import { hotelContact } from "@/data/contact";
export const metadata: Metadata = { title: "Contact us | Meridian Drive Hotel", description: "Contact Meridian Drive Hotel in Tetewayo, Ningo Prampram, Greater Accra. Call, email, or send an enquiry. GhanaPostGPS GN-0189-1152.", openGraph: { title: "Contact us | Meridian Drive Hotel", description: "Find us in Prampram or start a conversation about your next stay." } };
export default function ContactPage() {
  const address = hotelContact.address;
  return <main id="main-content" tabIndex={-1}>
    <PageIntro label="Contact us" title={<>A hello is<br /><em>a lovely start.</em></>} description="A question about your stay, a special occasion, or simply getting to know us. Make yourself heard." image="/images/dining.webp" alt="Illustrative welcoming restaurant interior" />
    <section className="section collection-section"><div className="container contact-layout"><aside className="contact-details"><p className="eyebrow">Keep in touch</p><h2>Let's make<br /><em>you feel at home.</em></h2><p>Find us in Tetewayo, Ningo Prampram. Call, email, or send us a message about your stay.</p>
      <div className="contact-detail"><MapPin aria-hidden="true" /><div><h3>Visit us</h3><address>{address.street}<br />{address.locality}<br />{address.region}</address><span className="digital-address">{address.digital}</span></div></div>
      <div className="contact-detail"><Phone aria-hidden="true" /><div><h3>Give us a call</h3><ul className="contact-link-list">{hotelContact.phones.map(phone => <li key={phone.href}><a href={phone.href}>{phone.display}</a></li>)}</ul></div></div>
      <div className="contact-detail"><Mail aria-hidden="true" /><div><h3>Write to us</h3><ul className="contact-link-list">{hotelContact.emails.map(email => <li key={email}><a href={`mailto:${email}`}>{email}</a></li>)}</ul></div></div>
      <div className="social-pending"><h3>Stories from our guests.</h3><a className="text-link" href={hotelContact.reviewsUrl} target="_blank" rel="noopener noreferrer">Read hotel reviews<ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></div>
    </aside><ContactForm /></div></section>
    <section className="container location-section" aria-labelledby="location-title"><div className="location-card"><div><Navigation size={35} strokeWidth={1.1} aria-hidden="true" /><p className="eyebrow">Tetewayo · Prampram · Greater Accra</p><h2 id="location-title">Find your way<br /><em>to Meridian.</em></h2><p>{address.street}<br />{address.locality}<br />{address.region}</p><div className="location-actions"><a className="button button--primary" href={hotelContact.mapUrl} target="_blank" rel="noopener noreferrer">Open GhanaPostGPS map<ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a><a className="text-link" href={hotelContact.reviewsUrl} target="_blank" rel="noopener noreferrer">Read hotel reviews<MessageSquare size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></div></div><div className="digital-location"><MapPin size={48} strokeWidth={1} aria-hidden="true" /><span>Our digital address</span><strong>{address.digital}</strong><p>Use this code in GhanaPostGPS<br />to find our location.</p></div></div></section>
  </main>;
}
