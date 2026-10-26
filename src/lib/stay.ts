export type Stay = { checkIn: string; checkOut: string; guests: string; room: string };
export type StayErrors = Partial<Record<keyof Stay, string>>;

export function localDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function nextDay(value: string) {
  if (!validDate(value)) return "";
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}
export function stayNights(checkIn: string, checkOut: string) {
  if (!validDate(checkIn) || !validDate(checkOut) || checkOut <= checkIn) return 0;
  return Math.round((Date.parse(`${checkOut}T12:00:00Z`) - Date.parse(`${checkIn}T12:00:00Z`)) / 86400000);
}
export function validateStay(stay: Stay, today: string, capacities: Record<string, number>): StayErrors {
  const errors: StayErrors = {};
  if (!validDate(stay.checkIn) || stay.checkIn < today) errors.checkIn = "Choose a check-in date today or later.";
  if (!validDate(stay.checkOut)) errors.checkOut = "Choose a valid check-out date.";
  else if (validDate(stay.checkIn) && stay.checkOut <= stay.checkIn) errors.checkOut = "Check-out must be after check-in.";
  if (!/^[1-6]$/.test(stay.guests)) errors.guests = "Select between 1 and 6 guests.";
  if (!Object.hasOwn(capacities, stay.room)) errors.room = "Choose a room type.";
  else if (!errors.guests && Number(stay.guests) > capacities[stay.room]) errors.guests = "Choose a larger room or fewer guests for this room concept.";
  return errors;
}
export function normalizeStay(query: Record<string, string | string[] | undefined>, roomNames: readonly string[]): Stay {
  const value = (key: string) => typeof query[key] === "string" ? query[key] : "";
  return {
    checkIn: validDate(value("checkIn")) ? value("checkIn") : "",
    checkOut: validDate(value("checkOut")) ? value("checkOut") : "",
    guests: /^[1-6]$/.test(value("guests")) ? value("guests") : "2",
    room: roomNames.includes(value("room")) ? value("room") : roomNames[0] ?? "",
  };
}
