"use client";
import { useState } from "react";
import { MapPin, ArrowUpRight } from "lucide-react";
import { hotelContact } from "@/data/contact";
export function ContactMap() {
  const [loaded, setLoaded] = useState(false);
  return <div className="inquiry-map">{loaded ? <iframe title="Google Maps search for Meridian Drive Hotel, Prampram" src="https://www.google.com/maps?q=Meridian%20Drive%20Hotel%20Prampram%20Ghana&output=embed" loading="lazy" referrerPolicy="no-referrer" allowFullScreen /> : <div className="inquiry-map-cover"><MapPin size={28} aria-hidden="true" /><strong>Find your way to Meridian</strong><p>Load Google Maps to explore the area. Google’s privacy and cookie policies apply.</p><button type="button" onClick={() => setLoaded(true)}>Load Google Maps<ArrowUpRight size={16} aria-hidden="true" /></button></div>}<a href={hotelContact.mapUrl} target="_blank" rel="noopener noreferrer">Exact directions · GhanaPostGPS {hotelContact.address.digital}<ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></div>;
}
