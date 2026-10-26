"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/data/hotel";
import { BookButton } from "./booking";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuButton = useRef<HTMLButtonElement>(null);
  const mobileNav = useRef<HTMLElement>(null);
  useEffect(() => {
    function escape(event: KeyboardEvent) { if (event.key === "Escape") { setOpen(false); menuButton.current?.focus(); } }
    function outside(event: PointerEvent) { if (!mobileNav.current?.contains(event.target as Node) && !menuButton.current?.contains(event.target as Node)) setOpen(false); }
    function resize() { if (window.innerWidth >= 1100) setOpen(false); }
    document.addEventListener("keydown", escape); document.addEventListener("pointerdown", outside); window.addEventListener("resize", resize);
    return () => { document.removeEventListener("keydown", escape); document.removeEventListener("pointerdown", outside); window.removeEventListener("resize", resize); };
  }, []);
  return <header className="site-header"><div className="container header-inner">
    <Link className="logo-link" href="/" onClick={() => setOpen(false)} aria-label="Meridian Drive Hotel home"><Image src="/images/mdh-logo.png" alt="Meridian Drive Hotel" width={118} height={82} priority unoptimized /></Link>
    <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(item => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Link>)}</nav>
    <div className="header-actions"><BookButton className="header-book">Book your stay</BookButton><button className="icon-button menu-toggle" ref={menuButton} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div>
  </div><nav id="mobile-navigation" ref={mobileNav} className="mobile-nav" aria-label="Mobile navigation" hidden={!open}>{navigation.map(item => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} onClick={() => setOpen(false)}>{item.label}</Link>)}</nav></header>;
}
