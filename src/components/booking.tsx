"use client";

import { ArrowRight, CalendarDays, Check, X } from "lucide-react";
import { createContext, useContext, useRef, useState, useEffect, type FormEvent, type ReactNode } from "react";
import { roomTypes } from "@/data/hotel";
import { Button } from "./ui";

type Stay = { checkIn?: string; checkOut?: string; guests?: string; room?: string };
const BookingContext = createContext<(stay?: Stay) => void>(() => {});

function localDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function nextDay(value: string) {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + 1);
  return localDate(date);
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [stay, setStay] = useState<Stay>({});
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");
  const [today, setToday] = useState("");
  const trigger = useRef<HTMLElement | null>(null);
  useEffect(() => { setToday(localDate(new Date())); }, []);
  function open(initial: Stay = {}) {
    trigger.current = document.activeElement as HTMLElement | null;
    setStay(initial); setComplete(false); setError("");
    dialog.current?.showModal();
  }
  function close() { dialog.current?.close(); }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const current = localDate(new Date());
    if (!stay.checkIn || !stay.checkOut || stay.checkIn < current || stay.checkOut <= stay.checkIn) {
      setError("Choose a check-in date today or later, and a check-out date after check-in."); return;
    }
    setError(""); setComplete(true);
  }
  return <BookingContext.Provider value={open}>{children}
    <dialog className="modal booking-modal" ref={dialog} aria-labelledby="booking-title" onClose={() => trigger.current?.focus()} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <button className="icon-button modal-close" onClick={close} aria-label="Close booking preview"><X size={22} /></button>
      <p className="eyebrow">Your next escape</p><h2 id="booking-title">Plan your stay.</h2>
      {!complete ? <><p className="modal-intro" id="booking-note">Explore the booking form. This preview does not check availability, send a request, or reserve a room.</p>
        <form onSubmit={submit} aria-describedby="booking-note">
          <div className="form-grid">
            <label>Check-in<input name="checkIn" type="date" required min={today} value={stay.checkIn ?? ""} onChange={e => { const value = e.target.value; setStay({ ...stay, checkIn: value, checkOut: stay.checkOut && stay.checkOut > value ? stay.checkOut : "" }); setError(""); }} /></label>
            <label>Check-out<input name="checkOut" type="date" required min={stay.checkIn ? nextDay(stay.checkIn) : nextDay(today)} value={stay.checkOut ?? ""} onChange={e => { setStay({ ...stay, checkOut: e.target.value }); setError(""); }} /></label>
            <label>Guests<select name="guests" value={stay.guests ?? "2"} onChange={e => setStay({ ...stay, guests: e.target.value })}>{[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>)}</select></label>
            <label>Room preference<select name="room" value={stay.room ?? roomTypes[0]} onChange={e => setStay({ ...stay, room: e.target.value })}>{roomTypes.map(name => <option key={name}>{name}</option>)}</select></label>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <Button type="submit" className="full-width">Preview stay summary<ArrowRight size={17} aria-hidden="true" /></Button>
          <p className="fine-print">Rates, room capacity, and availability are pending confirmation.</p>
        </form></> : <div className="stay-summary" role="status"><span className="success-icon"><Check size={24} /></span><h3>Your stay at a glance</h3><dl><div><dt>Check-in</dt><dd>{stay.checkIn}</dd></div><div><dt>Check-out</dt><dd>{stay.checkOut}</dd></div><div><dt>Guests</dt><dd>{stay.guests ?? "2"}</dd></div><div><dt>Room preference</dt><dd>{stay.room ?? roomTypes[0]}</dd></div></dl><p>This is a preview only. No reservation has been made, no payment has been taken, and no information has been sent.</p><Button onClick={() => setComplete(false)} variant="outline">Edit your stay</Button></div>}
    </dialog>
  </BookingContext.Provider>;
}

export function BookButton({ children = "Book your stay", variant = "primary", className = "", room }: { children?: ReactNode; variant?: "primary" | "outline" | "light"; className?: string; room?: string }) {
  const open = useContext(BookingContext);
  return <Button variant={variant} className={className} onClick={() => open({ room })}>{children}<ArrowUpRightIcon /></Button>;
}

function ArrowUpRightIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>; }

export function BookingBar() {
  const open = useContext(BookingContext);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [today, setToday] = useState("");
  useEffect(() => setToday(localDate(new Date())), []);
  return <div className="booking-bar-wrap container"><form className="booking-bar" onSubmit={e => { e.preventDefault(); open({ checkIn, checkOut, guests: String(new FormData(e.currentTarget).get("guests")) }); }}>
    <div className="booking-bar-intro"><CalendarDays size={23} strokeWidth={1.4} aria-hidden="true" /><span>Your escape<br /><strong>starts here.</strong></span></div>
    <label>Check-in<input type="date" name="checkIn" aria-label="Check-in date" required min={today} value={checkIn} onChange={e => { setCheckIn(e.target.value); if (checkOut <= e.target.value) setCheckOut(""); }} /></label>
    <label>Check-out<input type="date" name="checkOut" aria-label="Check-out date" required min={checkIn ? nextDay(checkIn) : nextDay(today)} value={checkOut} onChange={e => setCheckOut(e.target.value)} /></label>
    <label>Guests<select name="guests" defaultValue="2">{[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>)}</select></label>
    <Button type="submit">Plan your stay<ArrowRight size={17} aria-hidden="true" /></Button>
  </form><p className="booking-disclaimer">Booking preview · availability and rates to be confirmed</p></div>;
}
