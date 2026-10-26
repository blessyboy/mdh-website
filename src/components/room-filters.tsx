"use client";
import { useState } from "react";
import { BedDouble, RotateCcw } from "lucide-react";
import { roomCollection } from "@/data/hotel";
import { formatGhs } from "@/lib/rates";
import { RoomCard } from "./room-card";
import { Button } from "./ui";

export function RoomFilters() {
  const [kind, setKind] = useState("all");
  const [maxRate, setMaxRate] = useState("all");
  const [search, setSearch] = useState("");
  const filtered = roomCollection.filter(room => (kind === "all" || room.kind === kind) && (maxRate === "all" || room.nightlyRateMinor <= Number(maxRate)) && `${room.name} ${room.category}`.toLowerCase().includes(search.trim().toLowerCase()));
  function reset() { setKind("all"); setMaxRate("all"); setSearch(""); }
  return <><div className="collection-toolbar"><div className="filter-chips" role="group" aria-label="Room category">{[{ id: "all", label: "All rooms" }, { id: "room", label: "Rooms" }, { id: "suite", label: "Suites" }].map(item => <button key={item.id} className="filter-chip" aria-pressed={kind === item.id} onClick={() => setKind(item.id)}>{item.label}</button>)}</div><div className="collection-fields"><label htmlFor="room-rate-filter">Nightly budget<select id="room-rate-filter" value={maxRate} onChange={event => setMaxRate(event.target.value)}><option value="all">All rates</option>{[45000,65000,75000,85000,105000].map(rate => <option key={rate} value={rate}>Up to {formatGhs(rate)}</option>)}</select></label><label htmlFor="room-search">Find a room<input id="room-search" type="search" value={search} maxLength={100} onChange={event => setSearch(event.target.value)} placeholder="Search room names" /></label></div></div><p className="results-count" role="status">{filtered.length} {filtered.length === 1 ? "room category" : "room categories"} · Rates in Ghana cedis, per night.</p>{filtered.length ? <div className="rooms-grid full-room-grid">{filtered.map(room => <RoomCard headingLevel={2} key={room.id} room={room} index={roomCollection.findIndex(item => item.id === room.id)} />)}</div> : <div className="empty-panel"><BedDouble size={35} strokeWidth={1.2} aria-hidden="true" /><h2>A different kind of stay?</h2><p>No rooms match these filters. Try a different nightly budget or explore the full collection.</p><Button variant="outline" onClick={reset}><RotateCcw size={16} aria-hidden="true" />Reset filters</Button></div>}<p className="section-footnote room-rate-note">Rates follow the hotel’s supplied room rate sheet. Availability, occupancy, taxes, fees, and inclusions are subject to confirmation.</p></>;
}
