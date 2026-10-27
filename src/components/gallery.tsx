"use client";
import Image from "next/image";
import { Modal } from "./modal";
import { ArrowLeft, ArrowRight, Expand, Images, X } from "lucide-react";
import { useRef, useState } from "react";
import { gallery, type GalleryItem } from "@/data/hotel";

export function Gallery({ items = gallery, filterable = false, photographyLabel }: { items?: readonly GalleryItem[]; filterable?: boolean; photographyLabel?: string }) {
  const [category, setCategory] = useState("All");
  const [index, setIndex] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const galleryCategories = ["All", ...new Set(items.map(item => item.category).filter((value): value is string => !!value))];
  const filtered = category === "All" ? items : items.filter(item => item.category === category);
  const image = filtered[index];
  const step = (direction: number) => setIndex(value => (value + direction + filtered.length) % filtered.length);
  return <>
    {filterable && <><div className="filter-chips gallery-filters" role="group" aria-label="Gallery category">{galleryCategories.map(name => <button key={name} className="filter-chip" aria-pressed={category === name} onClick={() => { setCategory(name); setIndex(0); }}>{name}</button>)}</div><p className="results-count" role="status">{filtered.length} {filtered.length === 1 ? "photograph" : "photographs"}{category !== "All" ? ` · ${category}` : ""}</p></>}
    {filtered.length ? <div className={`gallery-grid${filterable ? " gallery-grid--collection" : ""}`}>{filtered.map((item, i) => <button className="gallery-tile" key={item.src} onClick={event => { trigger.current = event.currentTarget; setIndex(i); dialog.current?.showModal(); }} aria-label={`Enlarge ${item.label}`}><Image src={item.src} alt={item.alt} fill sizes="(max-width: 700px) 100vw, 40vw" /><span className="gallery-caption">{item.label}<Expand size={18} aria-hidden="true" /></span></button>)}</div> : <div className="empty-panel"><Images size={36} strokeWidth={1.2} aria-hidden="true" /><h2>More moments to come.</h2><p>Photographs for this collection are coming soon. Explore the other collections in the meantime.</p><button className="button button--outline" onClick={() => setCategory("All")}>View all photographs</button></div>}
    <Modal className="modal lightbox" ref={dialog} aria-labelledby="gallery-title" onClose={() => trigger.current?.focus()} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }} onKeyDown={e => { if (filtered.length && e.key === "ArrowRight") step(1); if (filtered.length && e.key === "ArrowLeft") step(-1); }}><button className="icon-button modal-close" aria-label="Close gallery" onClick={() => dialog.current?.close()}><X /></button>{image && <><div className="lightbox-image"><Image src={image.src} alt={image.alt} fill sizes="90vw" /></div><div className="lightbox-controls"><button className="icon-button" aria-label="Previous image" onClick={() => step(-1)}><ArrowLeft /></button><div aria-live="polite"><h2 id="gallery-title">{image.label}</h2><p>{photographyLabel && <>{photographyLabel} / </>}{index + 1} of {filtered.length}</p></div><button className="icon-button" aria-label="Next image" onClick={() => step(1)}><ArrowRight /></button></div></>}</Modal>
  </>;
}

