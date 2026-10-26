"use client";
import Image from "next/image";
import { ArrowUpRight, BedDouble, X } from "lucide-react";
import { useRef } from "react";
import type { HotelRoom } from "@/data/rooms";
import { formatGhs } from "@/lib/rates";
import { Modal } from "./modal";
import { BookButton } from "./booking";

export function RoomCard({ room, index, headingLevel = 3 }: { room: HotelRoom; index: number; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const photo = room.image;
  return <article className="room-card" data-room-id={room.id}>
    <div className="room-image">{photo ? <><Image src={photo} alt={`${room.name} at Meridian Drive Hotel`} fill sizes="(max-width: 600px) 100vw, 50vw" /><span className="image-label">Hotel photograph</span></> : <div className="room-photo-pending"><BedDouble size={42} strokeWidth={1.1} aria-hidden="true" /><span>Suite photograph coming soon</span></div>}</div>
    <div className="room-body"><p className="room-category"><span aria-hidden="true">0{index + 1}</span>{room.category}</p><Heading className="room-title">{room.name}</Heading><p>{room.description}</p><div className="room-bottom"><span className="room-rate"><strong>{formatGhs(room.nightlyRateMinor)}</strong><small> / night</small></span><button ref={trigger} onClick={() => dialog.current?.showModal()} className="room-details" aria-label={`Explore room: ${room.name}`}>Explore room<ArrowUpRight size={17} aria-hidden="true" /></button></div><BookButton room={room.name} className="room-book">Plan your stay</BookButton></div>
    <Modal className="modal room-modal" ref={dialog} aria-labelledby={`title-${room.id}`} onClose={() => trigger.current?.focus()} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}><button className="icon-button modal-close" aria-label="Close room details" onClick={() => dialog.current?.close()}><X /></button><div className="room-modal-image">{photo ? <Image src={photo} alt={`${room.name} at Meridian Drive Hotel`} fill sizes="600px" /> : <div className="room-photo-pending"><BedDouble size={42} aria-hidden="true" /><span>Suite photograph coming soon</span></div>}</div><div className="room-modal-body"><p className="eyebrow">Meridian Drive Hotel · {room.kind === "suite" ? "Suite" : "Our rooms"}</p><h2 id={`title-${room.id}`}>{room.name}</h2><p>{room.detail}</p><div className="modal-room-rate"><strong>{formatGhs(room.nightlyRateMinor)}</strong><span>per night</span></div><p className="fine-print">Please confirm occupancy, availability, taxes, fees, and rate inclusions with the hotel. Booking is currently a preview.</p><BookButton room={room.name}>Plan a stay in this room</BookButton></div></Modal>
  </article>;
}
