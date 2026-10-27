export type ContactMessage = { name: string; email: string; phone: string; subject: string; message: string; checkIn?: string; checkOut?: string; privacyConsent?: boolean };
export const contactSubjects = ["Room Reservation", "Event Booking", "Corporate Stay", "General Inquiry", "Feedback", "Other"] as const;
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
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Accra" });
  for (const field of ["checkIn", "checkOut"] as const) {
    const date = values[field];
    if (date && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date || date < today)) errors[field] = "Choose a valid date today or later.";
  }
  if (values.checkOut && !values.checkIn) errors.checkIn = "Choose a check-in date first.";
  if (values.checkIn && values.checkOut && values.checkOut <= values.checkIn) errors.checkOut = "Check-out must be after check-in.";
  if (values.privacyConsent !== true) errors.privacyConsent = "Please agree to the Privacy Policy to send your enquiry.";
  return errors;
}
