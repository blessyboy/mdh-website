import assert from "node:assert/strict";

const base = process.env.PREVIEW_URL || "http://127.0.0.1:3000";
const paths = ["/", "/about", "/rooms", "/amenities", "/gallery", "/contact", "/booking"];
const pages = new Map();
const assets = new Set();
const links = new Set();
async function getPage(path) {
  if (pages.has(path)) return pages.get(path);
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, `${path}: expected HTTP 200`);
  const html = await response.text();
  pages.set(path, html);
  return html;
}
for (const path of paths) {
  const html = await getPage(path);
  // Streamed responses can contain both the loading fallback and final page.
  assert.ok(/<h1\b/.test(html), `${path}: page heading present`);
  assert.ok(html.includes('id="main-content"'), `${path}: skip link target`);
  assert.ok(html.includes('id="top"'), `${path}: back to top target`);
  assert.ok(html.includes('name="robots" content="noindex, nofollow"'), `${path}: preview noindex`);
  if (path !== "/") assert.ok(html.includes('aria-label="Breadcrumb"'), `${path}: breadcrumbs`);
  for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const url = new URL(match[1].replaceAll("&amp;", "&"), new URL(path, base));
    if (url.origin === new URL(base).origin) links.add(url.pathname + url.search + url.hash);
  }
  for (const match of html.matchAll(/<img\b[^>]*src="([^"]+)"/g)) assets.add(match[1].replaceAll("&amp;", "&"));
  console.log(`PASS ${path}: page, heading, navigation targets, and metadata`);
}
for (const link of links) {
  const url = new URL(link, base);
  const html = await getPage(url.pathname + url.search);
  if (url.hash) assert.ok(html.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${link}: fragment target`);
}
for (const asset of assets) {
  const response = await fetch(new URL(asset, base));
  assert.equal(response.status, 200, `${asset}: image HTTP 200`);
  assert.ok(response.headers.get("content-type")?.startsWith("image/"), `${asset}: image content type`);
  await response.arrayBuffer();
}
const selected = await getPage("/booking?room=Suite&guests=6&checkIn=2027-01-01&checkOut=2027-01-03");
assert.ok(selected.includes('value="2027-01-01"'), "booking link preserves check-in");
assert.ok(selected.includes('value="2027-01-03"'), "booking link preserves check-out");
assert.ok(/<option[^>]*selected[^>]*>Suite<\/option>/.test(selected), "booking link preselects room");
assert.ok(/<option[^>]*value="6"[^>]*selected/.test(selected), "booking link preselects guests");
const repeated = await getPage("/booking?room=Standard+Room&room=Executive+Suite&guests=999&checkIn=invalid");
assert.ok(repeated.includes("Your stay, your way."), "malformed/repeated query renders safely");
const missing = await fetch(new URL("/this-page-does-not-exist", base));
assert.equal(missing.status, 404, "unknown page returns HTTP 404");
console.log(`PASS ${links.size} internal links, ${assets.size} image variants, booking prefills, malformed queries, and 404 behavior`);
