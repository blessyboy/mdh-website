export const navigation = [
  { label: "Home", href: "/" },
  { label: "Our story", href: "/about" },
  { label: "Rooms & suites", href: "/rooms" },
  { label: "Amenities", href: "/amenities" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
] as const;

export const rooms = [
  { id: "standard", name: "Standard Room", category: "Simply comfortable", image: "/images/standard.webp", description: "A welcoming space to settle in, slow down, and enjoy a restful stay.", detail: "Our starting point for an effortless escape. This room concept pairs warm materials with a calm, uncluttered atmosphere." },
  { id: "deluxe", name: "Deluxe Room", category: "A little more indulgence", image: "/images/deluxe.webp", description: "Thoughtful touches and an inviting atmosphere for your time away.", detail: "A room concept for lingering a little longer. Soft textures and considered details set the mood for a relaxed stay." },
  { id: "suite", name: "Executive Suite", category: "Stay a little longer", image: "/images/suite.webp", description: "An elegant retreat for unhurried mornings and peaceful evenings.", detail: "A suite concept with a composed, private feel. Final room dimensions, amenities, and guest capacity will be confirmed by the hotel." },
] as const;

export const roomCollection = [
  { ...rooms[0], kind: "room", capacity: 2, features: ["Restful sleeping area", "Private bathroom", "Everyday essentials"] },
  { ...rooms[1], kind: "room", capacity: 2, features: ["Inviting bedroom", "Comfortable seating", "Private bathroom"] },
  { ...rooms[2], kind: "suite", capacity: 4, features: ["Suite-style accommodation", "Space to unwind", "Private bathroom"] },
  { id: "presidential", name: "Presidential Suite", category: "Make it an occasion", image: "/images/deluxe.webp", description: "A generous suite concept for a stay that deserves something special.", detail: "The most spacious concept in our collection, imagined for memorable occasions and a little extra privacy. Final layout and amenities await confirmation.", kind: "suite", capacity: 6, features: ["Generous suite concept", "Space for shared moments", "Private retreat"] },
] as const;
export const roomTypes = ["Any room type", ...roomCollection.map(room => room.name)];

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
