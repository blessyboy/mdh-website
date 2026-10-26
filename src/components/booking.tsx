"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUpRight, CalendarDays } from "lucide-react";
import { useState, useEffect, type ReactNode } from "react";
import { localDate, nextDay } from "@/lib/stay";
import { Button } from "./ui";
import { PreviewForm } from "./preview-form";

export function BookButton({ children = "Book your stay", variant = "primary", className = "", room }: { children?: ReactNode; variant?: "primary" | "outline" | "light"; className?: string; room?: string }) {
  const href = room ? `/booking?${new URLSearchParams({ room })}` : "/booking";
  return <Link href={href} className={`button button--${variant} ${className}`}>{children}<ArrowUpRight size={16} aria-hidden="true" /></Link>;
}

export function BookingBar() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [today, setToday] = useState("");
  useEffect(() => setToday(localDate(new Date())), []);
  return <div className="booking-bar-wrap container"><PreviewForm className="booking-bar" onSubmit={event => {
    event.preventDefault();
    const guests = String(new FormData(event.currentTarget).get("guests"));
    router.push(`/booking?${new URLSearchParams({ checkIn, checkOut, guests })}`);
  }}>
    <div className="booking-bar-intro"><CalendarDays size={23} strokeWidth={1.4} aria-hidden="true" /><span>Your escape<br /><strong>starts here.</strong></span></div>
    <label>Check-in<input type="date" name="checkIn" aria-label="Check-in date" required min={today} value={checkIn} onChange={e => { setCheckIn(e.target.value); if (checkOut <= e.target.value) setCheckOut(""); }} /></label>
    <label>Check-out<input type="date" name="checkOut" aria-label="Check-out date" required min={checkIn ? nextDay(checkIn) : nextDay(today)} value={checkOut} onChange={e => setCheckOut(e.target.value)} /></label>
    <label>Guests<select name="guests" defaultValue="2">{[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>)}</select></label>
    <Button type="submit">Plan your stay<ArrowRight size={17} aria-hidden="true" /></Button>
  </PreviewForm><p className="booking-disclaimer">Booking preview · availability and rates to be confirmed</p></div>;
}

