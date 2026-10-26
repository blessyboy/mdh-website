import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const base = process.env.PREVIEW_URL || "http://127.0.0.1:3010";
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const report = { timestamp: new Date().toISOString(), pages: [], checks: [], violations: [], errors: [] };
const expected = [
  { id: "standard", name: "Standard Room", rate: "GH¢450.00", file: "Single Standard.jpg", output: "single-standard.jpg" },
  { id: "standard-double", name: "Standard Double", rate: "GH¢650.00", file: "Double Standard.jpg", output: "double-standard.jpg" },
  { id: "deluxe", name: "Deluxe Room", rate: "GH¢750.00", file: "Deluxe.jpg", output: "deluxe.jpg" },
  { id: "executive", name: "Executive Room", rate: "GH¢850.00", file: "Executive Suite Room.jpg", output: "executive.jpg" },
  { id: "suite", name: "Suite", rate: "GH¢1,050.00", file: null, output: null },
];
await mkdir("qa", { recursive: true });
try {
  for (const room of expected.filter(room => room.file)) {
    const hash = data => createHash("sha256").update(data).digest("hex");
    assert.equal(hash(await readFile(`Our rooms/${room.file}`)), hash(await readFile(`public/images/rooms/${room.output}`)));
  }
  report.checks.push("All four supplied bedroom photos copied without modification");
  for (const width of [1440,390,320]) {
    const context = await browser.newContext({ viewport: { width, height: 950 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    page.on("pageerror", error => report.errors.push(error.message));
    await page.goto(base + "/rooms", { waitUntil: "networkidle" });
    for (const room of expected) {
      const card = page.locator(`[data-room-id="${room.id}"]`);
      assert.equal(await card.getByRole("heading", { name: room.name, exact: true }).isVisible(), true);
      assert.equal(await card.locator(".room-rate strong").innerText(), room.rate);
      if (room.output) assert.ok((await card.locator(".room-image img").getAttribute("src")).includes(encodeURIComponent(`/images/rooms/${room.output}`)));
      else assert.equal(await card.locator(".room-image img").count(), 0);
    }
    assert.equal(await page.locator(".room-card").count(), 5);
    await page.evaluate(async () => {
      for (let y=0;y<document.documentElement.scrollHeight;y+=innerHeight) { scrollTo(0,y); await new Promise(r=>setTimeout(r,70)); }
      await Promise.all([...document.images].filter(img => img.getClientRects().length).map(img => img.decode().catch(()=>{}))); scrollTo(0,0);
    });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    assert.equal(overflow, false);
    const axe = await new AxeBuilder({ page }).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa","best-practice"]).analyze();
    report.violations.push(...axe.violations.map(v => ({ width, id: v.id, nodes: v.nodes.map(n=>n.target) })));
    await page.screenshot({ path: `qa/room-rates-${width}.png`, fullPage: true });
    report.pages.push({ width, cards: 5, overflow, violations: axe.violations.length });
    if (width===390) {
      await page.locator("#room-rate-filter").selectOption("65000"); assert.equal(await page.locator(".room-card").count(), 2);
      await page.getByRole("button", { name: "Suites", exact: true }).click(); assert.equal(await page.locator(".empty-panel").isVisible(), true);
      await page.getByRole("button", { name: "Reset filters" }).click(); assert.equal(await page.locator(".room-card").count(), 5);
      await page.getByRole("button", { name: "Explore room: Standard Double", exact: true }).click();
      const modal = page.getByRole("dialog"); assert.equal(await modal.locator(".modal-room-rate strong").innerText(), "GH¢650.00");
      await modal.getByRole("link", { name: "Plan a stay in this room" }).click();
      await page.waitForURL("**/booking?room=Standard+Double");
      assert.equal(await page.locator("#stay-room").inputValue(), "Standard Double");
      const date = new Date(); date.setDate(date.getDate()+1); const end = new Date(date); end.setDate(end.getDate()+2);
      const iso = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
      await page.locator("#stay-checkIn").fill(iso(date)); await page.locator("#stay-checkOut").fill(iso(end));
      assert.equal(await page.locator(".summary-total strong").innerText(), "GH¢1,300.00");
      await page.locator("#stay-guests").selectOption("4"); assert.equal(await page.locator(".summary-total strong").innerText(), "GH¢1,300.00");
      await page.locator("#stay-room").selectOption("Suite"); assert.equal(await page.locator(".summary-total strong").innerText(), "GH¢2,100.00");
      assert.equal(await page.locator(".summary-image img").count(), 0);
      await page.getByRole("button", { name: "Preview stay summary" }).click();
      assert.equal(await page.getByRole("heading", { name: "Your stay preview is ready." }).isVisible(), true);
      report.checks.push("Budget/category filters, empty/reset states, detail price, booking room handoff, two-night totals, guest-independent room rate, and Suite placeholder pass");
    }
    await context.close();
  }
  assert.equal(report.violations.length, 0); assert.equal(report.errors.length, 0);
  console.log("PASS supplied photo hashes, all five rate mappings, responsive/axe checks, filters, room details, and booking totals");
} catch(error) { report.failure=error.stack; process.exitCode=1; console.error(error); }
finally { await writeFile("qa/room-rates-check.json",JSON.stringify(report,null,2)); await browser.close(); }
