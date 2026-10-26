import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { RoomFilters } from "@/components/room-filters";
import { BookButton } from "@/components/booking";
export const metadata: Metadata = { title: "Rooms & suites | Meridian Drive Hotel", description: "Explore five room categories with hotel photographs and nightly rates in Ghana cedis, and plan your Meridian stay.", openGraph: { title: "Rooms & suites | Meridian Drive Hotel", description: "Find your kind of comfort in our room collection." } };
export default function RoomsPage() {
  return <main id="main-content" tabIndex={-1}><PageIntro label="Rooms & suites" title={<>Your space.<br /><em>Your pace.</em></>} description="From a simple escape to a special occasion, find a room that feels like your kind of stay." image="/images/rooms/executive.jpg" alt="Executive Room at Meridian Drive Hotel" imageLabel="Hotel photograph" /><section className="section collection-section"><div className="container"><RoomFilters /></div></section><section className="page-cta"><div className="container"><div><p className="eyebrow">A stay to look forward to</p><h2>Found your favourite?</h2><p>Choose your dates and explore a preview of your stay.</p></div><BookButton>Plan your stay</BookButton></div></section></main>;
}

