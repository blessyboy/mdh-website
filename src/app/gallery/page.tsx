import type { Metadata } from "next";
import { PageIntro, PageCTA } from "@/components/page-intro";
import { Gallery } from "@/components/gallery";
import { fullGallery } from "@/data/hotel";
export const metadata: Metadata = { title: "Gallery | Meridian Drive Hotel", description: "Browse photographs of dining, celebrations, and live music shared by Meridian Drive Hotel.", openGraph: { title: "Gallery | Meridian Drive Hotel", description: "Dining, celebrations, and memorable moments at Meridian Drive Hotel." } };
export default function GalleryPage() {
  return <main id="main-content" tabIndex={-1}><PageIntro label="Gallery" title={<>Picture a<br /><em>little escape.</em></>} description="A taste of our gatherings, celebrations, and shared moments. Explore photographs from the Meridian Drive Hotel collection." image="/images/gallery/traditional-food-display.jpg" alt="Decorated event buffet with woven serving bowls, refreshments, and floral details" imageLabel="From our hotel gallery" /><section className="section collection-section"><div className="container"><p className="collection-note">Dining, celebrations, and moments of connection. Select a photograph to take a closer look.</p><Gallery items={fullGallery} filterable photographyLabel="Meridian Drive Hotel gallery" /></div></section><PageCTA title="Make your own Meridian memories." /></main>;
}

