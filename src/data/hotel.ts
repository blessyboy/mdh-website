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

export const galleryCategories = ["All", "Hotel exterior", "Rooms", "Restaurant", "Events", "Amenities"] as const;
export type GalleryItem = { src: string; label: string; alt: string; category?: string };
export const fullGallery: GalleryItem[] = [
  { src: "/images/hero.webp", label: "An invitation to escape", alt: "Illustrative resort architecture and pool", category: "Hotel exterior" },
  { ...gallery[0], category: "Amenities" },
  { ...gallery[1], category: "Restaurant" },
  { ...gallery[2], category: "Rooms" },
  { src: "/images/deluxe.webp", label: "Comfort in the details", alt: "Illustrative room with a softly lit sitting area", category: "Rooms" },
  { src: "/images/suite.webp", label: "An unhurried evening", alt: "Illustrative suite bedroom with timber finishes", category: "Rooms" },
];

