import test from "node:test";
import assert from "node:assert/strict";
import { validDate, nextDay, stayNights, normalizeStay, validateStay } from "../src/lib/stay.ts";
import { validateContact } from "../src/lib/contact.ts";

const capacities = { "Standard Room": 2, "Executive Suite": 4, "Presidential Suite": 6 };
const stay = { checkIn: "2026-10-26", checkOut: "2026-10-28", guests: "2", room: "Standard Room" };
test("dates reject calendar rollover and accept real leap dates", () => {
  assert.equal(validDate("2026-02-29"), false);
  assert.equal(validDate("2028-02-29"), true);
  assert.equal(validDate("2026-04-31"), false);
  assert.equal(validDate("26-10-26"), false);
  assert.equal(validDate(""), false);
  assert.equal(nextDay("2026-12-31"), "2027-01-01");
  assert.equal(nextDay("invalid"), "");
});
test("night counts are stable over daylight-saving and year boundaries", () => {
  assert.equal(stayNights("2026-03-07", "2026-03-09"), 2);
  assert.equal(stayNights("2026-10-31", "2026-11-02"), 2);
  assert.equal(stayNights("2026-12-31", "2027-01-02"), 2);
  assert.equal(stayNights(stay.checkOut, stay.checkIn), 0);
  assert.equal(stayNights(stay.checkIn, stay.checkIn), 0);
});
test("stay validation rejects past dates, reversed dates, invalid rooms, and over-capacity guests", () => {
  assert.deepEqual(validateStay(stay, "2026-10-26", capacities), {});
  assert.ok(validateStay(stay, "2026-10-27", capacities).checkIn);
  assert.ok(validateStay({ ...stay, checkOut: stay.checkIn }, "2026-10-26", capacities).checkOut);
  assert.ok(validateStay({ ...stay, guests: "3" }, "2026-10-26", capacities).guests);
  assert.ok(validateStay({ ...stay, room: "__proto__" }, "2026-10-26", capacities).room);
  assert.ok(validateStay({ ...stay, guests: "2.5" }, "2026-10-26", capacities).guests);
  assert.deepEqual(validateStay({ ...stay, guests: "6", room: "Presidential Suite" }, "2026-10-26", capacities), {});
});
test("booking links preserve valid selections and normalize hostile or repeated query values", () => {
  assert.deepEqual(normalizeStay(stay, Object.keys(capacities)), stay);
  assert.deepEqual(normalizeStay({ room: ["Standard Room", "Executive Suite"], guests: "999", checkIn: "2026-02-30", checkOut: "<script>" }, Object.keys(capacities)), { room: "Standard Room", guests: "2", checkIn: "", checkOut: "" });
});
const message = { name: "A Guest", email: "guest@example.com", phone: "", subject: "Rooms & reservations", message: "I would like to ask about a future stay." };
test("contact validation accepts an optional phone and catches all required fields", () => {
  assert.deepEqual(validateContact(message), {});
  assert.equal(Object.keys(validateContact({ name: " ", email: "invalid", phone: "abcdefg", subject: "unexpected", message: "short" })).length, 5);
  assert.deepEqual(validateContact({ ...message, phone: "+233 20 123 4567" }), {});
  assert.ok(validateContact({ ...message, message: "a".repeat(3001) }).message);
});
