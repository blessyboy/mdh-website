import type { Metadata } from "next";
import Link from "next/link";
import localFont from "next/font/local";
import { ExperienceGrid } from "@/components/experience-grid";
const heading = localFont({ src: "../../assets/fonts/playfair.ttf", variable: "--font-experience-heading", display: "swap" });
const body = localFont({ src: "../../assets/fonts/inter.ttf", variable: "--font-experience-body", display: "swap" });
export const metadata: Metadata = { title: "Amenities & Services | Meridian Drive Hotel", description: "Explore dining, relaxation, wellness, business, and travel experiences at Meridian Drive Hotel in Prampram." };
export default function AmenitiesPage() {
  return <main id="main-content" tabIndex={-1} className={`experiences-page ${heading.variable} ${body.variable}`}>
    <nav className="container experiences-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Amenities & Services</span></nav>
    <section className="container experiences-section" aria-labelledby="experiences-title"><header className="experiences-header"><p className="experience-eyebrow"><span />Hotel Experiences<span /></p><h1 id="experiences-title">Everything You Need for<br /><em>a Memorable Stay</em></h1><p>Discover thoughtfully curated amenities designed for comfort, relaxation, productivity, and unforgettable experiences.</p><div className="experiences-ornament" aria-hidden="true"><span />✦<span /></div></header><ExperienceGrid /><p className="experiences-image-note">Conference-room photography supplied by Meridian Drive Hotel. Other images illustrate the experiences. Please confirm service availability and arrangements with our team.</p></section>
  </main>;
}
