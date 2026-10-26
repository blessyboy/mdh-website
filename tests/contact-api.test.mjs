import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { validateContact } from "../src/lib/contact.ts";
import { createContactHandler } from "../src/server/contact-service.ts";
import { sendContactMail, contactMailPayload } from "../src/server/contact-mailer.ts";

const config = { apiKey: "unit-test-secret-not-real", from: "website@example.com", to: "blessyarthur@gmail.com" };
const message = { name: "Test Guest", email: "guest@example.com", phone: "+233244510133", subject: "General enquiry", message: "A test enquiry for local verification only." };
function request(body = message, { origin = "https://hotel.example", key = randomUUID(), headers = {}, raw } = {}) {
  return new Request("https://hotel.example/api/contact", { method: "POST", headers: { Origin: origin, "Content-Type": "application/json", "Idempotency-Key": key, ...headers }, body: raw ?? JSON.stringify(body) });
}
function handler(overrides = {}) {
  return createContactHandler({ config: () => config, validate: validateContact, send: async () => "accepted", ...overrides });
}
test("Resend payload has a fixed recipient and safe sender; visitor email is reply-to", async () => {
  const id = randomUUID(); let sent;
  const result = await sendContactMail(message, config, id, async (url, init) => {
    assert.equal(url, "https://api.resend.com/emails"); sent = JSON.parse(init.body);
    assert.equal(init.headers.Authorization, `Bearer ${config.apiKey}`);
    assert.equal(init.headers["Idempotency-Key"], `hotel-contact/${id}`);
    assert.ok(init.signal);
    return Response.json({ id: "provider-test-id" });
  });
  assert.equal(result, "accepted"); assert.deepEqual(sent.to, ["blessyarthur@gmail.com"]);
  assert.equal(sent.from, "Meridian Drive Hotel <website@example.com>"); assert.equal(sent.reply_to, message.email);
  assert.equal(sent.html, undefined); assert.ok(sent.text.includes(message.message));
  assert.deepEqual(contactMailPayload(message, config, id), sent);
});
test("valid submission succeeds only after the mail adapter accepts it", async () => {
  let sends = 0; const post = handler({ send: async () => { sends++; return "accepted"; } });
  const result = await post(request()); assert.equal(result.status, 200); assert.equal((await result.json()).ok, true);
  assert.equal(result.headers.get("cache-control"), "no-store"); assert.equal(sends, 1);
});
test("missing email configuration fails closed without claiming success", async () => {
  let sends = 0; const post = handler({ config: () => ({ ...config, apiKey: "" }), send: async () => { sends++; return "accepted"; } });
  const result = await post(request()); assert.equal(result.status, 503); assert.equal(sends, 0);
  assert.equal((await result.json()).ok, undefined);
});
test("Resend development sender is restricted to loopback sites", async () => {
  const post = handler({ config: () => ({ ...config, from: "onboarding@resend.dev" }) });
  assert.equal((await post(request())).status, 503);
  const local = new Request("http://localhost:3010/api/contact", { method: "POST", headers: { Host: "127.0.0.1:3010", Origin: "http://127.0.0.1:3010", "Content-Type": "application/json", "Idempotency-Key": randomUUID() }, body: JSON.stringify(message) });
  assert.equal((await post(local)).status, 200);
});
test("server validation rejects blank fields, invalid email and header injection", async () => {
  const post = handler();
  const invalid = await post(request({ ...message, name: " ", email: "bad\r\nBcc: other@example.com", message: "short" }));
  assert.equal(invalid.status, 422); const data = await invalid.json(); assert.ok(data.fields.name && data.fields.email && data.fields.message);
  assert.equal((await post(request({ ...message, email: "<guest>@example.com" }))).status, 422);
});
test("cross-origin, missing-origin, and cross-site requests are refused", async () => {
  const post = handler();
  assert.equal((await post(request(message, { origin: "https://attacker.example" }))).status, 403);
  assert.equal((await post(request(message, { origin: "" }))).status, 403);
  assert.equal((await post(request(message, { headers: { "Sec-Fetch-Site": "cross-site" } }))).status, 403);
});
test("configured public origin is enforced behind a reverse proxy", async () => {
  const post = handler({ config: () => ({ ...config, siteOrigin: "https://public.example" }) });
  assert.equal((await post(request())).status, 403);
  assert.equal((await post(request(message, { origin: "https://public.example" }))).status, 200);
});
test("standalone internal localhost alias uses the actual request Host without accepting a different browser origin", async () => {
  const post = handler();
  const actual = () => new Request("http://localhost:3010/api/contact", { method: "POST", headers: { Host: "127.0.0.1:3010", Origin: "http://127.0.0.1:3010", "Content-Type": "application/json", "Idempotency-Key": randomUUID() }, body: JSON.stringify(message) });
  assert.equal((await post(actual())).status, 200);
  const hostile = actual(); hostile.headers.set("Origin", "http://attacker.example");
  assert.equal((await post(hostile)).status, 403);
});
test("content type, JSON shape, field types, and recipient override are checked", async () => {
  const post = handler();
  assert.equal((await post(request(message, { headers: { "Content-Type": "text/plain" } }))).status, 415);
  assert.equal((await post(request(message, { raw: "{" }))).status, 400);
  assert.equal((await post(request([]))).status, 400);
  assert.equal((await post(request({ ...message, phone: 123 }))).status, 400);
  assert.equal((await post(request({ ...message, to: "attacker@example.com" }))).status, 400);
});
test("oversized declared and streamed bodies are rejected", async () => {
  const post = handler();
  assert.equal((await post(request(message, { headers: { "Content-Length": "20000" } }))).status, 413);
  assert.equal((await post(request({ ...message, message: "x".repeat(20000) }))).status, 413);
});
test("honeypot and malformed idempotency key cannot send mail", async () => {
  let sends = 0; const post = handler({ send: async () => { sends++; return "accepted"; } });
  assert.equal((await post(request({ ...message, website: "spam.example" }))).status, 400);
  assert.equal((await post(request(message, { key: "invalid" }))).status, 400); assert.equal(sends, 0);
});
test("repeated and concurrent sends share a result; changed payload with same key conflicts", async () => {
  let sends = 0; const post = handler({ send: async () => { sends++; await new Promise(resolve => setTimeout(resolve, 15)); return "accepted"; } });
  const key = randomUUID();
  const results = await Promise.all([post(request(message, { key })), post(request(message, { key }))]);
  assert.ok(results.every(result => result.status === 200)); assert.equal(sends, 1);
  assert.equal((await post(request({ ...message, message: "A changed enquiry message." }, { key }))).status, 409);
});
test("provider failure retains retry semantics and does not expose secrets", async () => {
  let sends = 0; const post = handler({ send: async () => ++sends === 1 ? "failed" : "accepted" }); const key = randomUUID();
  const failed = await post(request(message, { key })); assert.equal(failed.status, 502);
  const text = await failed.text(); assert.equal(text.includes(config.apiKey), false); assert.equal(text.includes(config.to), false);
  assert.equal((await post(request(message, { key }))).status, 200); assert.equal(sends, 2);
});
test("provider error, missing acceptance id, and network failure never report success", async () => {
  assert.equal(await sendContactMail(message, config, randomUUID(), async () => Response.json({ error: "denied" }, { status: 403 })), "failed");
  assert.equal(await sendContactMail(message, config, randomUUID(), async () => Response.json({})), "failed");
  assert.equal(await sendContactMail(message, config, randomUUID(), async () => { throw new Error("network unavailable"); }), "failed");
});
test("email and global rate limits apply with retry hints and expire", async () => {
  let clock = 1; const post = handler({ now: () => clock });
  for (let i=0;i<3;i++) assert.equal((await post(request())).status, 200);
  const limited = await post(request()); assert.equal(limited.status, 429); assert.equal(limited.headers.get("retry-after"), "600");
  clock += 600001; assert.equal((await post(request())).status, 200);
  const global = handler();
  for (let i=0;i<30;i++) assert.equal((await global(request({ ...message, email: `guest${i}@example.com` }, { headers: { "X-Forwarded-For": `192.0.2.${i+1}` } }))).status, 200);
  assert.equal((await global(request({ ...message, email: "next@example.com" }))).status, 429);
});
test("trusted-proxy IP limits are opt-in and independent of claimed email", async () => {
  const post = handler({ config: () => ({ ...config, trustProxy: true }) });
  for(let i=0;i<5;i++) assert.equal((await post(request({ ...message, email: `visitor${i}@example.com` }, { headers: { "X-Forwarded-For": "192.0.2.1" } }))).status, 200);
  assert.equal((await post(request({ ...message, email: "another@example.com" }, { headers: { "X-Forwarded-For": "192.0.2.1" } }))).status, 429);
});
