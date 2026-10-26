import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { BookingForm } from "@/components/booking-form";
import { roomCollection } from "@/data/hotel";
import { normalizeStay } from "@/lib/stay";
export const metadata: Metadata = { title: "Plan your stay | Meridian Drive Hotel", description: "Choose your dates and room preference, then explore a local preview of your Meridian stay. No reservation or payment is made.", openGraph: { title: "Plan your stay | Meridian Drive Hotel", description: "Your next little escape starts here." } };
export default async function BookingPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const initialStay = normalizeStay(await searchParams, roomCollection.map(room => room.name));
  return <main id="main-content" tabIndex={-1}><PageIntro label="Plan your stay" title={<>Your next<br /><em>little escape.</em></>} description="A date to look forward to. A space to call your own. Start picturing your time at Meridian." image="/images/rooms/double-standard.jpg" alt="Standard Double at Meridian Drive Hotel" imageLabel="Hotel photograph" /><section className="section collection-section"><div className="container"><BookingForm key={JSON.stringify(initialStay)} initialStay={initialStay} /></div></section><section className="booking-help container"><p className="eyebrow">A little clarity</p><h2>Before you plan.</h2><div className="faq-list"><details><summary>Does this confirm a reservation?</summary><p>No. This is a website design preview. Choosing dates and previewing your summary does not check availability, contact the hotel, or reserve a room.</p></details><details><summary>Where can I find nightly rates?</summary><p>Nightly rates from the hotel’s rate sheet appear on the Rooms page and in your stay summary. Taxes, fees, inclusions, and payment options must be confirmed with the hotel.</p></details><details><summary>What are the check-in and cancellation policies?</summary><p>Arrival times, departure times, cancellation terms, and other booking policies will be published once confirmed by the hotel.</p></details></div></section></main>;
}

