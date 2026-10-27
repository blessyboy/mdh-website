import type { Metadata } from "next";
import Link from "next/link";
import localFont from "next/font/local";
import { ArrowUpRight, Mail, MapPin, Phone, Clock3, MessageCircle, Check, Sparkles } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { ContactMap } from "@/components/contact-map";
import { HotelSocials } from "@/components/hotel-socials";
import { hotelContact } from "@/data/contact";
const heading = localFont({ src: "../../assets/fonts/playfair.ttf", variable: "--font-inquiry-heading", display: "swap" });
const body = localFont({ src: "../../assets/fonts/inter.ttf", variable: "--font-inquiry-body", display: "swap" });
export const metadata: Metadata = { title: "Contact Us | Meridian Drive Hotel", description: "Plan your stay at Meridian Drive Hotel in Prampram. Speak with our team about rooms, events, and travel plans." };
export default function ContactPage() {
  const address = hotelContact.address;
  return <main id="main-content" tabIndex={-1} className={`inquiry-page ${heading.variable} ${body.variable}`}>
    <div className="container inquiry-breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>Contact Us</span></div>
    <section className="container inquiry-layout" aria-label="Contact Meridian Drive Hotel">
      <aside className="inquiry-welcome contact-details"><div className="inquiry-welcome-heading"><p className="inquiry-eyebrow">Your stay begins with a conversation</p><h1>Let's Plan Your<br /><em>Perfect Stay</em></h1><p>Whether you're planning a relaxing getaway, family vacation, business trip, or special event, our team is ready to assist.</p><span className="inquiry-trust"><MessageCircle size={16} aria-hidden="true" /> We will contact you shortly.</span><a href="#contact-inquiry" className="inquiry-jump">Send an Inquiry<ArrowUpRight size={18} aria-hidden="true" /></a></div>
        <div className="inquiry-contact-cards">
          <div className="inquiry-contact-card"><MapPin aria-hidden="true" /><div><h2>Location</h2><address>{address.street}<br />{address.locality}<br />{address.region}</address><span className="inquiry-digital">{address.digital}</span></div></div>
          <div className="inquiry-contact-card"><Phone aria-hidden="true" /><div><h2>Phone Numbers</h2><ul>{hotelContact.phones.map(phone => <li key={phone.href}><a href={phone.href}>{phone.display}</a></li>)}</ul></div></div>
          <div className="inquiry-contact-card"><Mail aria-hidden="true" /><div><h2>Email Address</h2><ul>{hotelContact.emails.map(email => <li key={email}><a href={`mailto:${email}`}>{email}</a></li>)}</ul></div></div>
          <div className="inquiry-contact-card"><Clock3 aria-hidden="true" /><div><h2>Reception Hours</h2><p>Please call our team to confirm reception hours and arrange your arrival.</p></div></div>
        </div><div className="inquiry-social-row"><HotelSocials /><a href={hotelContact.reviewsUrl} target="_blank" rel="noopener noreferrer">Read guest reviews<ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></div><ContactMap />
      </aside>
      <div className="inquiry-form-panel" id="contact-inquiry" tabIndex={-1}><div className="inquiry-highlight"><div><Sparkles size={20} aria-hidden="true" /><h2>Why Contact Us?</h2></div><ul>{["Connect with our team", "Personalized assistance", "Explore direct booking options", "Help planning your reservation"].map(text => <li key={text}><Check size={15} aria-hidden="true" />{text}</li>)}</ul></div><ContactForm /><p className="inquiry-booking-note">Already found your favourite room? <Link href="/rooms">Explore rooms & suites<ArrowUpRight size={14} aria-hidden="true" /></Link></p></div>
    </section>
  </main>;
}
