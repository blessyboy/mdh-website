import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, BedDouble, Coffee, Dumbbell, Leaf, MoveRight, Quote, Sparkles, Utensils, Waves, Wifi } from "lucide-react";
import { BookButton, BookingBar } from "@/components/booking";
import { Gallery } from "@/components/gallery";
import { Newsletter } from "@/components/newsletter";
import { RoomCard } from "@/components/room-card";
import { SectionHeading, TextLink } from "@/components/ui";
import { rooms } from "@/data/hotel";

const amenities = [
  { icon: Utensils, name: "Restaurant & dining", copy: "Good food. Even better company." },
  { icon: Waves, name: "Swimming pool", copy: "Take a dip. Let the day slow down." },
  { icon: Dumbbell, name: "Fitness & wellness", copy: "A little time to feel your best." },
  { icon: Wifi, name: "Stay connected", copy: "Room to switch off. Space to connect." },
];

export default function Home() {
  return <main id="main-content" tabIndex={-1}>
    <section id="home" className="hero" aria-labelledby="hero-title"><Image className="hero-image" src="/images/hero.webp" alt="Illustrative tropical resort pool framed by palms and warm timber architecture" fill sizes="100vw" loading="eager" fetchPriority="high" /><div className="hero-shade" /><div className="container hero-content"><p className="eyebrow"><span />Welcome to Meridian Drive Hotel</p><h1 id="hero-title">A little escape.<br />A lasting <em>feeling.</em></h1><p className="hero-description">Settle into comfort. Reconnect with the moment.<br className="desktop-break" /> Find your own pace at Meridian.</p><div className="hero-actions"><BookButton variant="light">Book your stay</BookButton><a className="hero-explore" href="#rooms">Explore our rooms<MoveRight size={20} aria-hidden="true" /></a></div></div><span className="preview-label">Design preview · Illustrative photography</span><a href="#about" className="hero-scroll" aria-label="Discover Meridian Drive Hotel"><span>Take a moment. Look around.</span><ArrowDown size={18} aria-hidden="true" /></a></section>
    <BookingBar />
    <div className="welcome-strip container" aria-label="Our design philosophy"><span><Leaf />Inspired by nature</span><i /><span><BedDouble />Comfort, thoughtfully considered</span><i /><span><Coffee />A warm welcome, always</span></div>
    <section id="about" className="section about-section"><div className="container about-grid"><div className="about-visual"><div className="about-image"><Image src="/images/retreat.webp" alt="Illustrative tranquil swimming pool tucked among lush garden planting" fill sizes="(max-width: 800px) 100vw, 50vw" /></div><div className="about-note"><Leaf size={25} strokeWidth={1.2} aria-hidden="true" /><span>A place to pause.<br />A reason to return.</span></div><span className="vertical-caption">The Meridian state of mind</span></div><div className="about-copy"><p className="eyebrow">A warm welcome</p><h2>Some places invite you<br />to <em>stay a little longer.</em></h2><p>Welcome to Meridian Drive Hotel. A place imagined around the simple pleasures of a good stay: a comfortable room, a welcoming atmosphere, and time to make your own.</p><p>Whether you’re here to unwind, reconnect, or find a change of scene, we look forward to making you feel at home.</p><TextLink href="/about">Discover the Meridian experience</TextLink><div className="about-signature">Your stay. Your pace.<span>Meridian Drive Hotel</span></div></div></div></section>
    <section id="rooms" className="section rooms-section"><div className="container"><SectionHeading eyebrow="Rest comes naturally" title={<>Find your kind of <em>comfort.</em></>} description="From a simple escape to something a little more special, discover a space that feels like you."><Link href="/rooms" className="button button--outline">Explore all room types<ArrowUpRight size={17} aria-hidden="true" /></Link></SectionHeading><div className="rooms-grid">{rooms.map((room, index) => <RoomCard key={room.id} room={room} index={index} />)}</div><p className="section-footnote">A first look at our room collection. Images and descriptions are illustrative; rates and features will be confirmed.</p></div></section>
    <section id="amenities" className="amenities-section"><div className="amenities-photo"><Image src="/images/dining.webp" alt="Illustrative restaurant interior with natural light and inviting tables" fill sizes="(max-width: 900px) 100vw, 45vw" /><div className="amenities-photo-caption"><span className="eyebrow">Make time for the good things</span><p>Good company.<br /><em>Unhurried moments.</em></p></div></div><div className="amenities-content"><p className="eyebrow">More than a room</p><h2>Make the most<br />of your <em>time away.</em></h2><p className="amenities-intro">A taste of the experiences planned for the Meridian website. Discover what your stay could look like.</p><div className="amenities-grid">{amenities.map(({ icon: Icon, name, copy }) => <div key={name}><Icon size={27} strokeWidth={1.3} aria-hidden="true" /><h3>{name}</h3><p>{copy}</p></div>)}</div><p className="amenities-note">Amenities shown follow the PRD and await hotel confirmation.</p><TextLink href="/amenities" light>Explore all amenities</TextLink></div></section>
    <section id="gallery" className="section gallery-section"><div className="container"><SectionHeading eyebrow="Picture your stay" title={<>Little moments. <em>Beautiful memories.</em></>} description="A visual mood for the Meridian experience. Select a photograph to take a closer look."><TextLink href="/gallery">View the full gallery</TextLink></SectionHeading><Gallery /></div></section>
    <section className="guest-section" aria-labelledby="guest-title"><div className="container guest-inner"><div className="guest-mark"><Quote size={42} strokeWidth={1} aria-hidden="true" /></div><p className="eyebrow">The guest experience</p><h2 id="guest-title">Every stay has <em>a story.</em></h2><p>We look forward to sharing the moments that make<br className="desktop-break" /> Meridian special, in our guests’ own words.</p><span className="reviews-pending">Verified guest reviews coming soon</span></div><Leaf className="guest-leaf" size={230} strokeWidth={.4} aria-hidden="true" /></section>
    <Newsletter />
  </main>;
}



