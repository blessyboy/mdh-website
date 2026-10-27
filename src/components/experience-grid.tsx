"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CarFront, Check, Dumbbell, Flower2, Plane, Presentation, Utensils, Waves, Wifi, X } from "lucide-react";
import { hotelExperiences, type HotelExperience } from "@/data/experiences";
import { Modal } from "./modal";
const icons = { dining: Utensils, pool: Waves, fitness: Dumbbell, wellness: Flower2, meetings: Presentation, wifi: Wifi, shuttle: Plane, parking: CarFront };

export function ExperienceGrid({ experiences = hotelExperiences }: { experiences?: HotelExperience[] }) {
  const grid = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<HotelExperience | null>(null);
  useEffect(() => {
    if (!grid.current || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("experience-visible"); observer.unobserve(entry.target); }
    }), { threshold: .08 });
    grid.current.querySelectorAll(".experience-card").forEach(card => { card.classList.add("experience-reveal"); observer.observe(card); });
    return () => observer.disconnect();
  }, []);
  function open(experience: HotelExperience) { setSelected(experience); dialog.current?.showModal(); }
  return <><div className="experience-grid" ref={grid}>{experiences.map((experience, index) => {
    const Icon = icons[experience.id as keyof typeof icons] || Flower2;
    return <article className="experience-card" id={experience.id} key={experience.id} style={{ "--experience-delay": `${index % 3 * 85}ms` } as CSSProperties}>
      <div className="experience-image"><Image src={experience.image} alt={`${experience.hotelPhoto ? "" : "Illustrative photograph: "}${experience.alt}`} fill sizes="(max-width: 699px) 100vw, (max-width: 999px) 50vw, 33vw" />{experience.hotelPhoto && <span className="experience-photo-label">At Meridian Drive Hotel</span>}</div>
      <div className="experience-body"><span className="experience-icon"><Icon size={24} strokeWidth={1.4} aria-hidden="true" /></span><h3>{experience.title}</h3><p>{experience.description}</p><button type="button" className="experience-more" aria-label={`Learn more about ${experience.title}`} aria-haspopup="dialog" onClick={() => open(experience)}>Learn More<ArrowRight size={17} aria-hidden="true" /></button></div>
    </article>;
  })}<article className="experience-stay-card"><p className="experience-eyebrow">Make it your own</p><h3>A little escape.<br /><em>A lasting feeling.</em></h3><p>Find the room that feels right, then let us help you plan the rest.</p><Link href="/booking">Plan Your Stay<ArrowRight size={18} aria-hidden="true" /></Link><Link href="/rooms" className="experience-stay-secondary">Explore Rooms</Link></article></div>
    <Modal ref={dialog} className="modal experience-dialog" aria-labelledby="experience-dialog-title" onClose={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) { const box = event.currentTarget.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) event.currentTarget.close(); } }}>
      <button type="button" className="icon-button experience-close" aria-label="Close experience details" autoFocus onClick={() => dialog.current?.close()}><X size={21} aria-hidden="true" /></button>
      {selected && <><div className="experience-dialog-image"><Image src={selected.image} alt={selected.hotelPhoto ? selected.alt : `Illustrative photograph: ${selected.alt}`} fill sizes="(max-width: 650px) 100vw, 650px" /></div><div className="experience-dialog-copy"><p className="experience-eyebrow">Meridian Drive Hotel · Hotel Experiences</p><h2 id="experience-dialog-title">{selected.title}</h2><p>{selected.details}</p><h3>Plan your experience</h3><ul>{selected.planning.map(item => <li key={item}><Check size={17} aria-hidden="true" />{item}</li>)}</ul><Link href="/contact" className="experience-enquire">{selected.enquiry}<ArrowRight size={17} aria-hidden="true" /></Link></div></>}
    </Modal></>;
}
