"use client";
import { useState } from "react";
import { BedDouble, RotateCcw } from "lucide-react";
import { roomCollection } from "@/data/hotel";
import { RoomCard } from "./room-card";
import { Button } from "./ui";

export function RoomFilters() {
  const [kind, setKind] = useState("all");
  const [guests, setGuests] = useState("1");
  const [search, setSearch] = useState("");
  const filtered = roomCollection.filter(room => (kind === "all" || room.kind === kind) && room.capacity >= Number(guests) && `${room.name} ${room.category}`.toLowerCase().includes(search.trim().toLowerCase()));
  function reset() { setKind("all"); setGuests("1"); setSearch(""); }
  return <><div className="collection-toolbar"><div className="filter-chips" role="group" aria-label="Room category">{[{ id: "all", label: "All rooms" }, { id: "room", label: "Rooms" }, { id: "suite", label: "Suites" }].map(item => <button key={item.id} className="filter-chip" aria-pressed={kind === item.id} onClick={() => setKind(item.id)}>{item.label}</button>)}</div><div className="collection-fields"><label>Guests<select value={guests} onChange={event => setGuests(event.target.value)}>{[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>)}</select></label><label>Find a room<input type="search" value={search} maxLength={100} onChange={event => setSearch(event.target.value)} placeholder="Search room names" /></label></div></div><p className="results-count" role="status">{filtered.length} {filtered.length === 1 ? "room concept" : "room concepts"} · Capacities and features shown are sample data.</p>{filtered.length ? <div className="rooms-grid full-room-grid">{filtered.map(room => <RoomCard headingLevel={2} key={room.id} room={room} index={roomCollection.findIndex(item => item.id === room.id)} />)}</div> : <div className="empty-panel"><BedDouble size={35} strokeWidth={1.2} aria-hidden="true" /><h2>A different kind of stay?</h2><p>No room concepts match these filters. Try fewer guests or explore the full collection.</p><Button variant="outline" onClick={reset}><RotateCcw size={16} aria-hidden="true" />Reset filters</Button></div>}</>;
}

