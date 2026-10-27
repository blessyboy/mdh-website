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
  { src: "/images/homepage/hotel-exterior.jpg", label: "A warm Meridian welcome", alt: "Meridian Drive Hotel exterior with red roofs, palm trees, and a paved courtyard" },
  { src: "/images/homepage/hotel-gardens.jpg", label: "Room to relax", alt: "Meridian Drive Hotel gardens with lawns, palms, and pathways" },
  { src: "/images/homepage/hotel-entrance.jpg", label: "Make yourself at home", alt: "Meridian Drive Hotel entrance with tropical planting and a paved forecourt" },
] as const;

export type GalleryItem = { src: string; label: string; alt: string; category?: string };
export const fullGallery: GalleryItem[] = [
  { src: "/images/gallery/celebration-buffet.jpg", label: "A table for celebration", alt: "Decorated outdoor buffet with woven baskets, clay pots, and white floral arrangements", category: "Dining" },
  { src: "/images/gallery/traditional-food-display.jpg", label: "Flavours to bring us together", alt: "Traditional food display with woven serving bowls and snacks at a decorated event", category: "Dining" },
  { src: "/images/gallery/red-carpet-arrival.jpg", label: "A warm arrival", alt: "Event guests arriving along a red carpet between palms and decorative display panels", category: "Events" },
  { src: "/images/gallery/event-refreshments.jpg", label: "Details worth savouring", alt: "Event refreshments displayed in woven trays beside a clay serving pot and flowers", category: "Dining" },
  { src: "/images/gallery/live-music.jpg", label: "Moments set to music", alt: "Singer performing outdoors with a live band and drum kit", category: "Events" },
];
