import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
const base = process.env.PREVIEW_URL || "http://127.0.0.1:3010";
const checks = [];
for (const path of ["/", "/about", "/rooms", "/amenities", "/gallery", "/contact", "/booking"]) {
  const response = await fetch(base + path);
  const headers = Object.fromEntries(response.headers);
  assert.equal(response.status, 200);
  assert.equal(headers["x-content-type-options"], "nosniff");
  assert.equal(headers["x-frame-options"], "DENY");
  assert.equal(headers["referrer-policy"], "strict-origin-when-cross-origin");
  assert.equal(headers["x-robots-tag"], "noindex, nofollow");
  assert.equal(headers["x-powered-by"], undefined);
  assert.equal(headers["set-cookie"], undefined);
  assert.ok(headers["strict-transport-security"]?.includes("max-age=31536000"));
  const csp = headers["content-security-policy"] || "";
  for (const directive of ["default-src 'self'", "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'"]) assert.ok(csp.includes(directive), `${path}: ${directive}`);
  assert.equal(csp.includes("unsafe-eval"), false, `${path}: production CSP excludes eval`);
  if (path === "/booking") assert.ok(/private|no-store/.test(headers["cache-control"] || ""), "booking query data is not publicly cached");
  await response.text();
  checks.push({ path, status: "pass", headers });
}
for (const url of [
  "/_next/image?url=https%3A%2F%2Fexample.com%2Fimage.jpg&w=640&q=75",
  "/_next/image?url=%2Fapi%2Fhealth&w=640&q=75",
  "/_next/image?url=%2Fimages%2Fhero.webp%3Funexpected%3D1&w=640&q=75",
  "/_next/image?url=%2Fimages%2Fhero.webp&w=99999&q=75",
]) {
  const response = await fetch(base + url);
  assert.equal(response.status, 400, "unapproved optimizer request is rejected");
  checks.push({ path: url, status: "pass", httpStatus: response.status });
}
const health = await fetch(base + "/api/health");
assert.deepEqual(await health.json(), { status: "ok", mode: "design-preview" });
const favicon = await fetch(base + "/favicon.ico");
assert.equal(favicon.status, 200);
const image = await fetch(base + "/images/hero.webp");
assert.ok(image.headers.get("cache-control")?.includes("max-age=86400"));
await mkdir("qa", { recursive: true });
await writeFile("qa/security-http.json", JSON.stringify({ timestamp: new Date().toISOString(), checks, health: "pass", favicon: "pass", imageCache: "pass", note: "CSP permits inline scripts/styles for statically rendered Next.js bootstrap. This is defense in depth, not a strict XSS prevention policy. HTTPS termination and HSTS enforcement require deployment verification." }, null, 2));
console.log("PASS security headers on seven routes, four rejected optimizer requests, health, favicon, and image caching");
