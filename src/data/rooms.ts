export type HotelRoom = {
  id: string;
  name: string;
  category: string;
  kind: "room" | "suite";
  image: string | null;
  description: string;
  detail: string;
  nightlyRateMinor: number;
  capacity: number | null;
};

// Room Rates.docx is the price authority. Amounts are integer Ghana pesewas.
// Occupancy and a separate Suite photo were not supplied; do not invent them.
export const roomCollection: readonly HotelRoom[] = [
  { id: "standard", name: "Standard Room", category: "Single standard", kind: "room", image: "/images/rooms/single-standard.jpg", nightlyRateMinor: 45000, capacity: null, description: "A simple, welcoming space for a comfortable stay.", detail: "A single-bed room with a wardrobe and desk area, as shown in the hotel photograph. Contact the hotel to confirm occupancy and included amenities." },
  { id: "standard-double", name: "Standard Double", category: "Double standard", kind: "room", image: "/images/rooms/double-standard.jpg", nightlyRateMinor: 65000, capacity: null, description: "A double-bed room with a warm, familiar feel.", detail: "A double-bed room with seating and air conditioning, as shown in the hotel photograph. Confirm occupancy and rate inclusions with the hotel before booking." },
  { id: "deluxe", name: "Deluxe Room", category: "A little more comfort", kind: "room", image: "/images/rooms/deluxe.jpg", nightlyRateMinor: 75000, capacity: null, description: "An inviting room for relaxing at your own pace.", detail: "A double-bed room with bedside lighting and a seating area, as shown in the hotel photograph. Please confirm amenities and occupancy with the hotel." },
  { id: "executive", name: "Executive Room", category: "Executive comfort", kind: "room", image: "/images/rooms/executive.jpg", nightlyRateMinor: 85000, capacity: null, description: "A restful setting for your next visit to Meridian.", detail: "A calm room with a double-bed setup and bedside lighting, as shown in the hotel photograph. Confirm occupancy, facilities, and inclusions with the hotel." },
  { id: "suite", name: "Suite", category: "Your suite stay", kind: "suite", image: null, nightlyRateMinor: 105000, capacity: null, description: "A separate suite category in the hotel's room collection.", detail: "Suite accommodation is listed separately from our Executive Room. A dedicated photograph, room layout, and occupancy details are coming soon." },
];

export const rooms = roomCollection.filter(room => ["standard", "deluxe", "executive"].includes(room.id));
export const roomTypes = ["Any room type", ...roomCollection.map(room => room.name)];
