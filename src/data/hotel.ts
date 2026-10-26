export const navigation = [
  { label: "Home", href: "#home" },
  { label: "Our story", href: "#about" },
  { label: "Rooms & suites", href: "#rooms" },
  { label: "Amenities", href: "#amenities" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
] as const;

export const rooms = [
  { id: "standard", name: "Standard Room", category: "Simply comfortable", image: "/images/standard.webp", description: "A welcoming space to settle in, slow down, and enjoy a restful stay.", detail: "Our starting point for an effortless escape. This room concept pairs warm materials with a calm, uncluttered atmosphere." },
  { id: "deluxe", name: "Deluxe Room", category: "A little more indulgence", image: "/images/deluxe.webp", description: "Thoughtful touches and an inviting atmosphere for your time away.", detail: "A room concept for lingering a little longer. Soft textures and considered details set the mood for a relaxed stay." },
  { id: "suite", name: "Executive Suite", category: "Stay a little longer", image: "/images/suite.webp", description: "An elegant retreat for unhurried mornings and peaceful evenings.", detail: "A suite concept with a composed, private feel. Final room dimensions, amenities, and guest capacity will be confirmed by the hotel." },
] as const;

export const roomTypes = ["Any room type", ...rooms.map(room => room.name), "Presidential Suite"];

export const gallery = [
  { src: "/images/retreat.webp", label: "A moment of calm", alt: "Illustrative garden pool surrounded by greenery" },
  { src: "/images/dining.webp", label: "Gather around the table", alt: "Illustrative restaurant with warm wood and natural light" },
  { src: "/images/standard.webp", label: "Your own little retreat", alt: "Illustrative bedroom with warm timber and a garden view" },
] as const;
