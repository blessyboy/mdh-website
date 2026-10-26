"use client";

import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";
import { useRef } from "react";
import { rooms } from "@/data/hotel";
import { BookButton } from "./booking";

type Room = (typeof rooms)[number];
export function RoomCard({ room, index }: { room: Room; index: number }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  return <article className="room-card"><div className="room-image"><Image src={room.image} alt={`Illustrative interior for the ${room.name} concept`} fill sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw" /><span className="image-label">Room concept</span></div>
    <div className="room-body"><p className="room-category"><span>0{index + 1}</span>{room.category}</p><h3>{room.name}</h3><p>{room.description}</p><div className="room-bottom"><span>Rates coming soon</span><button ref={trigger} onClick={() => dialog.current?.showModal()} className="room-details" aria-label={`Explore ${room.name}`}>Explore room<ArrowUpRight size={17} aria-hidden="true" /></button></div></div>
    <dialog className="modal room-modal" ref={dialog} aria-labelledby={`title-${room.id}`} onClose={() => trigger.current?.focus()} onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }}><button className="icon-button modal-close" aria-label="Close room details" onClick={() => dialog.current?.close()}><X /></button><div className="room-modal-image"><Image src={room.image} alt={`Illustrative ${room.name} interior`} fill sizes="600px" /></div><div className="room-modal-body"><p className="eyebrow">Room concept · Illustrative photograph</p><h2 id={`title-${room.id}`}>{room.name}</h2><p>{room.detail}</p><p className="fine-print">Final features, capacity, and nightly rates are pending confirmation.</p><BookButton room={room.name}>Plan a stay in this room</BookButton></div></dialog>
  </article>;
}
