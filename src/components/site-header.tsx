"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/data/hotel";
import { BookButton } from "./booking";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const menuButton = useRef<HTMLButtonElement>(null);
  const mobileNav = useRef<HTMLElement>(null);
  useEffect(() => {
    function escape(event: KeyboardEvent) { if (event.key === "Escape") { setOpen(false); menuButton.current?.focus(); } }
    function outside(event: PointerEvent) { if (!mobileNav.current?.contains(event.target as Node) && !menuButton.current?.contains(event.target as Node)) setOpen(false); }
    function resize() { if (window.innerWidth >= 1100) setOpen(false); }
    document.addEventListener("keydown", escape); document.addEventListener("pointerdown", outside); window.addEventListener("resize", resize);
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) setActive(`#${entry.target.id}`); }), { rootMargin: "-15% 0px -65% 0px", threshold: 0 });
    navigation.forEach(item => { const target = document.querySelector(item.href); if (target) observer.observe(target); });
    return () => { document.removeEventListener("keydown", escape); document.removeEventListener("pointerdown", outside); window.removeEventListener("resize", resize); observer.disconnect(); };
  }, []);
  return <header className="site-header"><div className="container header-inner">
    <a className="logo-link" href="#home" aria-label="Meridian Drive Hotel home"><Image src="/images/mdh-logo.png" alt="Meridian Drive Hotel" width={118} height={82} priority unoptimized /></a>
    <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(item => <a key={item.href} href={item.href} aria-current={active === item.href ? "location" : undefined}>{item.label}</a>)}</nav>
    <div className="header-actions"><BookButton className="header-book">Book your stay</BookButton><button className="icon-button menu-toggle" ref={menuButton} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div>
  </div><nav id="mobile-navigation" ref={mobileNav} className="mobile-nav" aria-label="Mobile navigation" hidden={!open}>{navigation.map(item => <a key={item.href} href={item.href} aria-current={active === item.href ? "location" : undefined} onClick={() => setOpen(false)}>{item.label}</a>)}</nav></header>;
}
