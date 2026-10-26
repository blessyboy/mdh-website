"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import { useRef, useState } from "react";
import { gallery } from "@/data/hotel";

export function Gallery() {
  const [index, setIndex] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const image = gallery[index];
  const step = (direction: number) => setIndex(value => (value + direction + gallery.length) % gallery.length);
  return <><div className="gallery-grid">{gallery.map((item, i) => <button className="gallery-tile" key={item.src} onClick={event => { trigger.current = event.currentTarget; setIndex(i); dialog.current?.showModal(); }} aria-label={`Enlarge ${item.label}`}><Image src={item.src} alt={item.alt} fill sizes="(max-width: 700px) 100vw, 40vw" /><span className="gallery-caption">{item.label}<Expand size={18} aria-hidden="true" /></span></button>)}</div>
    <dialog className="modal lightbox" ref={dialog} aria-labelledby="gallery-title" onClose={() => trigger.current?.focus()} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }} onKeyDown={e => { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); }}><button className="icon-button modal-close" aria-label="Close gallery" onClick={() => dialog.current?.close()}><X /></button><div className="lightbox-image"><Image src={image.src} alt={image.alt} fill sizes="90vw" /></div><div className="lightbox-controls"><button className="icon-button" aria-label="Previous image" onClick={() => step(-1)}><ArrowLeft /></button><div aria-live="polite"><h2 id="gallery-title">{image.label}</h2><p>Illustrative photography · {index + 1} of {gallery.length}</p></div><button className="icon-button" aria-label="Next image" onClick={() => step(1)}><ArrowRight /></button></div></dialog>
  </>;
}
