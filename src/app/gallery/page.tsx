import type { Metadata } from "next";
import { PageIntro, PageCTA } from "@/components/page-intro";
import { Gallery } from "@/components/gallery";
import { fullGallery } from "@/data/hotel";
export const metadata: Metadata = { title: "Gallery | Meridian Drive Hotel", description: "Explore the visual mood of Meridian Drive Hotel through our illustrative room, dining, and amenities collections.", openGraph: { title: "Gallery | Meridian Drive Hotel", description: "A visual collection of little escapes and moments of calm." } };
export default function GalleryPage() {
  return <main id="main-content"><PageIntro label="Gallery" title={<>Picture a<br /><em>little escape.</em></>} description="Light, texture, and room to breathe. Explore the visual inspiration for your Meridian stay." image="/images/hero.webp" alt="Illustrative resort scene with palms and a swimming pool" /><section className="section collection-section"><div className="container"><p className="collection-note">These photographs are illustrative references and do not show Meridian Drive Hotel. Official property photography is coming soon.</p><Gallery items={fullGallery} filterable /></div></section><PageCTA title="Turn a little inspiration into a stay." /></main>;
}
