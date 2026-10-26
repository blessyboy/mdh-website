"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Clock3, Leaf, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { roomCollection } from "@/data/hotel";
import { localDate, nextDay, stayNights, validDate, validateStay, type Stay, type StayErrors } from "@/lib/stay";
import { Button } from "./ui";
const capacities = Object.fromEntries(roomCollection.map(room => [room.name, room.capacity]));
function prettyDate(value: string) { return validDate(value) ? new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`)) : "Choose a date"; }

export function BookingForm({ initialStay }: { initialStay: Stay }) {
  const [stay, setStay] = useState(initialStay);
  const [today, setToday] = useState("");
  const [errors, setErrors] = useState<StayErrors>({});
  const [complete, setComplete] = useState(false);
  const errorSummary = useRef<HTMLDivElement>(null);
  const completedSummary = useRef<HTMLDivElement>(null);
  useEffect(() => { setToday(localDate(new Date())); }, []);
  useEffect(() => { if (Object.values(errors).some(Boolean)) errorSummary.current?.focus(); }, [errors]);
  useEffect(() => { if (complete) completedSummary.current?.focus(); }, [complete]);
  const room = roomCollection.find(item => item.name === stay.room) ?? roomCollection[0];
  const nights = stayNights(stay.checkIn, stay.checkOut);
  function change(field: keyof Stay, value: string) {
    setStay(current => ({ ...current, [field]: value, ...(field === "checkIn" && current.checkOut <= value ? { checkOut: "" } : {}) }));
    setErrors({}); setComplete(false);
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateStay(stay, localDate(new Date()), capacities);
    setErrors(nextErrors); setComplete(Object.keys(nextErrors).length === 0);
  }
  return <div className="booking-page-grid"><div><div className="booking-steps" aria-label="Booking preview steps"><span className={!complete ? "current" : ""}><b>01</b>Choose your stay</span><span className={complete ? "current" : ""}><b>02</b>Preview summary</span></div>
    <form className="stay-form" noValidate onSubmit={submit} aria-describedby="stay-form-note"><p className="eyebrow">Let the planning begin</p><h2>Your stay, your way.</h2><p className="form-description" id="stay-form-note">Select your dates, guests, and preferred room. This preview does not check live availability or make a reservation.</p>
      {Object.values(errors).some(Boolean) && <div className="form-error" role="alert" tabIndex={-1} ref={errorSummary}><strong>A few details need your attention.</strong><ul>{Object.entries(errors).map(([field, error]) => <li key={field}><a href={`#stay-${field}`}>{error}</a></li>)}</ul></div>}
      <div className="form-grid"><label htmlFor="stay-checkIn">Check-in date<input id="stay-checkIn" name="checkIn" type="date" required min={today} value={stay.checkIn} onChange={e => change("checkIn", e.target.value)} aria-invalid={!!errors.checkIn} aria-describedby={errors.checkIn ? "checkIn-error" : undefined} />{errors.checkIn && <span className="field-error" id="checkIn-error">{errors.checkIn}</span>}</label><label htmlFor="stay-checkOut">Check-out date<input id="stay-checkOut" name="checkOut" type="date" required min={stay.checkIn ? nextDay(stay.checkIn) : nextDay(today)} value={stay.checkOut} onChange={e => change("checkOut", e.target.value)} aria-invalid={!!errors.checkOut} aria-describedby={errors.checkOut ? "checkOut-error" : undefined} />{errors.checkOut && <span className="field-error" id="checkOut-error">{errors.checkOut}</span>}</label><label htmlFor="stay-guests">Number of guests<select id="stay-guests" name="guests" required value={stay.guests} onChange={e => change("guests", e.target.value)} aria-invalid={!!errors.guests} aria-describedby={errors.guests ? "guests-error" : "guest-help"}>{[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>)}</select>{errors.guests && <span className="field-error" id="guests-error">{errors.guests}</span>}</label><label htmlFor="stay-room">Room type<select id="stay-room" name="room" required value={stay.room} onChange={e => change("room", e.target.value)} aria-invalid={!!errors.room} aria-describedby={errors.room ? "room-error" : "guest-help"}>{roomCollection.map(item => <option key={item.id}>{item.name}</option>)}</select>{errors.room && <span className="field-error" id="room-error">{errors.room}</span>}</label></div>
      <p className="field-hint" id="guest-help">This room concept accommodates up to {room.capacity} guests using sample capacity data. Final capacity is subject to hotel confirmation.</p><Button className="full-width" type="submit">Preview stay summary<ArrowRight size={17} aria-hidden="true" /></Button><p className="fine-print">All fields are required. No payment or personal details are collected.</p>
    </form>
    {complete && <div className="booking-complete" tabIndex={-1} ref={completedSummary} role="status"><Check size={24} aria-hidden="true" /><div><h3>Your stay preview is ready.</h3><p>{prettyDate(stay.checkIn)} to {prettyDate(stay.checkOut)} · {nights} {nights === 1 ? "night" : "nights"} · {stay.guests} {stay.guests === "1" ? "guest" : "guests"} · {stay.room}</p><p>No reservation has been made and no information has been sent. Live availability and rates will be added when the hotel’s booking service is connected.</p></div></div>}
    <div className="booking-reassurance"><span><ShieldCheck aria-hidden="true" />No payment taken</span><span><Clock3 aria-hidden="true" />Plan at your own pace</span><span><Leaf aria-hidden="true" />A calmer kind of stay</span></div>
  </div><aside className="booking-summary" aria-labelledby="summary-title"><div className="summary-image"><Image src={room.image} alt={`Illustrative ${room.name} interior`} fill sizes="(max-width: 800px) 100vw, 40vw" /><span className="image-label">Room concept</span></div><div className="summary-body"><p className="eyebrow">Your little escape</p><h2 id="summary-title">Stay at a glance.</h2><p className="summary-room-name">{room.name}</p><dl><div><dt>Check-in</dt><dd>{prettyDate(stay.checkIn)}</dd></div><div><dt>Check-out</dt><dd>{prettyDate(stay.checkOut)}</dd></div><div><dt>Duration</dt><dd>{nights ? `${nights} ${nights === 1 ? "night" : "nights"}` : "Select your dates"}</dd></div><div><dt>Guests</dt><dd>{stay.guests}</dd></div><div><dt>Nightly rate</dt><dd>To be confirmed</dd></div></dl><div className="summary-total"><span>Estimated total</span><strong>Rates pending</strong></div><p className="fine-print">This is a planning summary, not an availability check or price quote. Taxes, fees, and booking policies are pending.</p><Link href="/rooms" className="text-link">Compare room concepts<ArrowRight size={15} aria-hidden="true" /></Link></div></aside></div>;
}
