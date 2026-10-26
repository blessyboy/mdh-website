import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export function PageIntro({ label, title, description, image, alt, imageLabel = "Illustrative photography" }: { label: string; title: ReactNode; description: string; image: string; alt: string; imageLabel?: string }) {
  return <><section className="page-intro" aria-labelledby="page-title"><div className="page-intro-copy"><div><p className="eyebrow">Meridian Drive Hotel · {label}</p><h1 id="page-title">{title}</h1><p>{description}</p></div></div><div className="page-intro-image"><Image src={image} alt={alt} fill loading="eager" fetchPriority="high" sizes="(max-width: 700px) 100vw, 45vw" /><span className="image-label">{imageLabel}</span></div></section><nav className="container breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight size={12} aria-hidden="true" /><span aria-current="page">{label}</span></nav></>;
}

export function PageCTA({ title = "Make a little room for yourself.", description = "Find your kind of comfort in our room collection." }: { title?: string; description?: string }) {
  return <section className="page-cta"><div className="container"><div><p className="eyebrow">Your next chapter</p><h2>{title}</h2><p>{description}</p></div><Link href="/rooms" className="button button--primary">Explore rooms<ChevronRight size={17} aria-hidden="true" /></Link></div></section>;
}

