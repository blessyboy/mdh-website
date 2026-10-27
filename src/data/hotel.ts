export const navigation = [
  { label: "Home", href: "/" },
  { label: "Our story", href: "/about" },
  { label: "Rooms & suites", href: "/rooms" },
  { label: "Amenities", href: "/amenities" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
] as const;

export { roomCollection, rooms, roomTypes } from "./rooms";

export const gallery = [
  { src: "/images/retreat.webp", label: "A moment of calm", alt: "Illustrative garden pool surrounded by greenery" },
  { src: "/images/dining.webp", label: "Gather around the table", alt: "Illustrative restaurant with warm wood and natural light" },
  { src: "/images/standard.webp", label: "Your own little retreat", alt: "Illustrative bedroom with warm timber and a garden view" },
] as const;

export type GalleryItem = { src: string; label: string; alt: string; category?: string };
export const fullGallery: GalleryItem[] = [
  { src: "/images/gallery/celebration-buffet.jpg", label: "A table for celebration", alt: "Decorated outdoor buffet with woven baskets, clay pots, and white floral arrangements", category: "Dining" },
  { src: "/images/gallery/traditional-food-display.jpg", label: "Flavours to bring us together", alt: "Traditional food display with woven serving bowls and snacks at a decorated event", category: "Dining" },
  { src: "/images/gallery/red-carpet-arrival.jpg", label: "A warm arrival", alt: "Event guests arriving along a red carpet between palms and decorative display panels", category: "Events" },
  { src: "/images/gallery/event-refreshments.jpg", label: "Details worth savouring", alt: "Event refreshments displayed in woven trays beside a clay serving pot and flowers", category: "Dining" },
  { src: "/images/gallery/live-music.jpg", label: "Moments set to music", alt: "Singer performing outdoors with a live band and drum kit", category: "Events" },
];
