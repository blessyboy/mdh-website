import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Leaf, MapPin, Mail, Phone } from "lucide-react";
import { navigation } from "@/data/hotel";
import { BookButton } from "./booking";

export function SiteFooter() {
  return <footer id="contact" className="site-footer"><div className="container">
    <div className="footer-top"><div><p className="eyebrow">We look forward to welcoming you</p><h2>Your next chapter<br />starts with a stay.</h2></div><BookButton variant="light">Plan your escape</BookButton></div>
    <div className="footer-grid"><div className="footer-brand"><Link href="/" className="footer-logo" aria-label="Meridian Drive Hotel home"><Image src="/images/mdh-logo.png" alt="Meridian Drive Hotel" width={144} height={100} sizes="144px" /></Link><p>A welcoming place to rest,<br />reconnect, and feel at home.</p><span className="footer-signoff"><Leaf size={16} aria-hidden="true" />Make room for a little calm.</span></div>
      <div><h3>Explore</h3><nav aria-label="Footer navigation">{navigation.slice(1).map(item => <Link key={item.href} href={item.href}>{item.label}<ArrowUpRight size={14} aria-hidden="true" /></Link>)}<Link href="/booking">Plan your stay<ArrowUpRight size={14} aria-hidden="true" /></Link></nav></div>
      <div className="footer-contact"><h3>Find us</h3><p><MapPin size={17} aria-hidden="true" /><span>Hotel address<br /><small>Details coming soon</small></span></p><p><Phone size={17} aria-hidden="true" /><span>Reservations telephone<br /><small>Details coming soon</small></span></p><p><Mail size={17} aria-hidden="true" /><span>Hotel email<br /><small>Details coming soon</small></span></p></div>
      <div className="footer-note"><h3>A warm welcome awaits.</h3><p>Our contact information and official social channels will be available here once confirmed.</p><Link href="/about">Get to know Meridian<ArrowUpRight size={16} aria-hidden="true" /></Link></div>
    </div><div className="footer-bottom"><p>© {new Date().getFullYear()} Meridian Drive Hotel.</p><p>Design preview · Some photographs are illustrative</p><a href="#top">Back to top ↑</a></div>
  </div></footer>;
}

