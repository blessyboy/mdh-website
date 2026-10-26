export type ContactMessage = { name: string; email: string; phone: string; subject: string; message: string };
export const contactSubjects = ["General enquiry", "Rooms & reservations", "Dining & amenities", "Meetings & events", "Other"] as const;
export function validEmail(value: string) {
  return value.length <= 254 && /^[A-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,63}$/i.test(value);
}
export function validateContact(values: ContactMessage) {
  const errors: Partial<Record<keyof ContactMessage, string>> = {};
  if (values.name.trim().length < 2 || values.name.length > 100) errors.name = "Enter your name (2–100 characters).";
  if (!validEmail(values.email.trim())) errors.email = "Enter a valid email address.";
  if (values.phone.trim() && (!/^[+()\d\s.-]{7,30}$/.test(values.phone.trim()) || values.phone.replace(/\D/g, "").length < 7)) errors.phone = "Enter a valid phone number, or leave this optional field blank.";
  if (!(contactSubjects as readonly string[]).includes(values.subject)) errors.subject = "Choose an enquiry subject.";
  if (values.message.trim().length < 10 || values.message.length > 3000) errors.message = "Write a message between 10 and 3,000 characters.";
  return errors;
}
