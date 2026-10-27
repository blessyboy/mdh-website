import { HotelSocials } from "./hotel-socials";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { ArrowRight, ArrowUp, ArrowUpRight, MapPin, Mail, Phone } from "lucide-react";
import { hotelContact } from "@/data/contact";
const heading = localFont({ src: "../assets/fonts/playfair.ttf", variable: "--font-footer-heading", display: "swap", preload: false });
const body = localFont({ src: "../assets/fonts/inter.ttf", variable: "--font-footer-body", display: "swap", preload: false });
const explore = [["About Us", "/about"], ["Rooms & Suites", "/rooms"], ["Amenities", "/amenities"], ["Gallery", "/gallery"], ["Restaurant", "/amenities#dining"], ["Contact", "/contact"], ["Book Now", "/booking"]] as const;
export function SiteFooter() {
  return <footer id="contact" className={`site-footer luxury-footer ${heading.variable} ${body.variable}`}><div className="container">
    <div className="luxury-footer-grid">
      <div className="luxury-brand"><Link href="/" className="luxury-logo" aria-label="Meridian Drive Hotel home"><Image src="/images/mdh-logo.png" alt="Meridian Drive Hotel" width={156} height={108} sizes="156px" /></Link><p>A welcoming place to rest, reconnect, and feel at home.</p><HotelSocials /></div>
      <div className="luxury-explore"><h2>Explore</h2><nav aria-label="Footer navigation">{explore.map(([label, href]) => <Link className="luxury-link" key={href} href={href}>{label}</Link>)}</nav></div>
      <div className="luxury-contact"><h2>Contact</h2><div className="luxury-contact-item"><MapPin size={18} aria-hidden="true" /><div><address>Tetewayo 7 Prampram 18g,<br />Tetewayo-Ningo Prampram,<br />Greater Accra, Ghana</address><span className="luxury-gps">{hotelContact.address.digital}</span></div></div><div className="luxury-contact-item"><Phone size={17} aria-hidden="true" /><ul>{hotelContact.phones.map(phone => <li key={phone.href}><a className="luxury-link" href={phone.href}>{phone.display}</a></li>)}</ul></div><div className="luxury-contact-item"><Mail size={17} aria-hidden="true" /><ul>{hotelContact.emails.map(email => <li key={email}><a className="luxury-link luxury-email" href={`mailto:${email}`}>{email}</a></li>)}</ul></div><a className="luxury-map luxury-link" href={hotelContact.mapUrl} target="_blank" rel="noopener noreferrer">View map & directions<ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></div>
      <div className="luxury-stay"><h2>Plan Your Stay</h2><p className="luxury-invitation">Make yourself<br /><em>at home.</em></p><p>Settle into welcoming rooms and enjoy a little time away in Prampram. Your next stay starts here.</p><Link className="luxury-book" href="/booking">Book Your Stay<ArrowRight size={18} aria-hidden="true" /></Link><Link className="luxury-view luxury-link" href="/rooms">View Rooms<ArrowUpRight size={16} aria-hidden="true" /></Link></div>
    </div><div className="luxury-bottom"><p>© {new Date().getFullYear()} Meridian Drive Hotel.<br className="luxury-copyright-break" /> All Rights Reserved.</p><nav aria-label="Policies"><Link className="luxury-link" href="/policies/privacy">Privacy Policy</Link><span aria-hidden="true">|</span><Link className="luxury-link" href="/policies/terms">Terms & Conditions</Link><span aria-hidden="true">|</span><Link className="luxury-link" href="/policies/cookies">Cookie Policy</Link></nav><a className="luxury-back" href="#top">Back to Top<ArrowUp size={16} aria-hidden="true" /></a></div>
  </div></footer>;
}
