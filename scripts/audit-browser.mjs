import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";

const base = process.env.PREVIEW_URL || "http://127.0.0.1:3010";
const label = process.env.AUDIT_LABEL || "latest";
const executablePath = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
await mkdir("qa", { recursive: true });
const browser = await chromium.launch({ executablePath, headless: true });
const report = { timestamp: new Date().toISOString(), base, browser: browser.version(), pages: [], interactions: [], consoleErrors: [], violations: [] };
const routes = ["/", "/about", "/rooms", "/amenities", "/gallery", "/contact", "/booking"];
const viewports = process.env.AUDIT_INTERACTIONS_ONLY ? [] : [{ width: 1440, height: 1000 }, { width: 390, height: 844 }, { width: 320, height: 800 }];
let page;
async function axe(name) {
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"]).analyze();
  report.violations.push(...result.violations.map(v => ({ name, id: v.id, impact: v.impact, description: v.description, helpUrl: v.helpUrl, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })));
  return result.violations.length;
}
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    page = await context.newPage();
    page.on("pageerror", error => report.consoleErrors.push({ viewport: viewport.width, message: error.message }));
    page.on("console", message => { if (message.type() === "error") report.consoleErrors.push({ viewport: viewport.width, message: message.text() }); });
    for (const route of routes) {
      await page.goto(base + route, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      // Visit the full page to exercise lazy loading before visual inspection.
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight) {
          scrollTo(0, y); await new Promise(resolve => setTimeout(resolve, 70));
        }
        await Promise.all([...document.images].filter(img => img.getClientRects().length).map(img => img.decode().catch(() => {})));
        scrollTo(0, 0);
      });
      const layout = await page.evaluate(() => ({
        width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
        h1: document.querySelectorAll("main h1").length,
        brokenImages: [...document.images].filter(img => img.complete && !img.naturalWidth).map(img => img.src),
      }));
      const violations = await axe(`${route} @ ${viewport.width}`);
      report.pages.push({ route, viewport, ...layout, violations });
      await page.screenshot({ path: `qa/${label}-${route === "/" ? "home" : route.slice(1)}-${viewport.width}.png`, fullPage: true });
      if (route === "/") await page.screenshot({ path: `qa/${label}-home-${viewport.width}-viewport.png` });
      console.log(`${route} @ ${viewport.width}: ${violations} axe violations, overflow=${layout.scrollWidth > layout.width}, h1=${layout.h1}`);
    }
    await context.close();
  }
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  page = await context.newPage();
  page.on("pageerror", error => report.consoleErrors.push({ message: error.message }));
  page.on("console", message => { if (message.type() === "error") report.consoleErrors.push({ message: message.text() }); });
  async function check(name, action) { await action(); report.interactions.push(name); console.log(`PASS ${name}`); }
  await check("mobile menu Escape restores toggle focus", async () => {
    await page.goto(base + "/", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Open menu", exact: true }).click();
    assert.equal(await page.locator("#mobile-navigation").isVisible(), true);
    await axe("mobile menu open");
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#mobile-navigation").isVisible(), false);
    assert.equal(await page.getByRole("button", { name: "Open menu", exact: true }).evaluate(el => el === document.activeElement), true);
  });
  await check("skip link moves focus into main", async () => {
    await page.goto(base + "/", { waitUntil: "networkidle" });
    await page.keyboard.press("Tab");
    assert.equal(await page.getByRole("link", { name: "Skip to content" }).evaluate(el => el === document.activeElement), true);
    await page.keyboard.press("Enter");
    assert.equal(await page.locator("main").evaluate(el => el === document.activeElement), true);
  });
  await check("room filter empty state and reset", async () => {
    await page.goto(base + "/rooms", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Rooms", exact: true }).click();
    await page.locator(".collection-fields select").selectOption("6");
    assert.equal(await page.getByRole("heading", { name: "A different kind of stay?" }).isVisible(), true);
    await axe("empty room collection");
    await page.getByRole("button", { name: "Reset filters" }).click();
    assert.equal(await page.locator(".room-card").count(), 4);
  });
  await check("room dialog keyboard containment, Escape, and focus restoration", async () => {
    const trigger = page.getByRole("button", { name: "Explore room: Standard Room", exact: true });
    await trigger.click();
    assert.equal(await page.getByRole("dialog").isVisible(), true);
    await axe("room dialog open");
    await page.getByRole("button", { name: "Close room details", exact: true }).focus();
    await page.keyboard.press("Shift+Tab");
    assert.equal(await page.getByRole("dialog").evaluate(el => el.contains(document.activeElement)), true);
    for (let i = 0; i < 5; i++) { await page.keyboard.press("Tab"); assert.equal(await page.getByRole("dialog").evaluate(el => el.contains(document.activeElement)), true); }
    await page.keyboard.press("Escape");
    assert.equal(await trigger.evaluate(el => el === document.activeElement), true);
  });
  await check("gallery category, empty state, lightbox keys and focus restoration", async () => {
    await page.goto(base + "/gallery", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Events", exact: true }).click();
    assert.equal(await page.getByRole("heading", { name: "More moments to come." }).isVisible(), true);
    await page.getByRole("button", { name: "View all photographs" }).click();
    const trigger = page.getByRole("button", { name: "Enlarge An invitation to escape", exact: true });
    await trigger.click(); await page.keyboard.press("ArrowRight");
    assert.equal(await page.getByRole("dialog").getByRole("heading", { name: "A moment of calm" }).isVisible(), true);
    await axe("gallery lightbox open");
    await page.keyboard.press("Escape");
    assert.equal(await trigger.evaluate(el => el === document.activeElement), true);
  });
  await check("contact validation, associated errors, and local-only success", async () => {
    await page.goto(base + "/contact", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Preview your enquiry" }).click();
    assert.equal(await page.locator(".form-error[role=alert]").isVisible(), true);
    assert.equal(await page.locator(".form-error[role=alert]").evaluate(el => el === document.activeElement), true);
    await axe("contact validation errors");
    await page.locator("#contact-name").fill("Test Guest"); await page.locator("#contact-email").fill("test@example.com");
    await page.locator("#contact-subject").selectOption("General enquiry"); await page.locator("#contact-message").fill("A local form validation check only.");
    const posts = []; page.on("request", request => { if (request.method() === "POST") posts.push(request.url()); });
    await page.getByRole("button", { name: "Preview your enquiry" }).click();
    assert.equal(await page.getByText("Your enquiry passed validation.", { exact: false }).isVisible(), true);
    assert.equal(posts.length, 0);
  });
  await check("booking prefill, invalid dates, capacity, and local-only completion", async () => {
    await page.goto(base + "/booking?room=Presidential+Suite&guests=6", { waitUntil: "networkidle" });
    assert.equal(await page.locator("#stay-room").inputValue(), "Presidential Suite");
    assert.equal(await page.locator("#stay-guests").inputValue(), "6");
    await page.getByRole("button", { name: "Preview stay summary" }).click();
    assert.equal(await page.locator(".form-error[role=alert]").isVisible(), true);
    await axe("booking validation errors");
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    const later = new Date(); later.setDate(later.getDate() + 3);
    const iso = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    await page.locator("#stay-checkIn").fill(iso(tomorrow)); await page.locator("#stay-checkOut").fill(iso(later));
    await page.locator("#stay-room").selectOption("Standard Room"); await page.getByRole("button", { name: "Preview stay summary" }).click();
    assert.equal(await page.locator("#guests-error").isVisible(), true);
    await page.locator("#stay-room").selectOption("Presidential Suite");
    const posts = []; page.on("request", request => { if (request.method() === "POST") posts.push(request.url()); });
    await page.getByRole("button", { name: "Preview stay summary" }).click();
    assert.equal(await page.getByRole("heading", { name: "Your stay preview is ready." }).isVisible(), true);
    assert.equal(await page.locator(".booking-complete").evaluate(el => el === document.activeElement), true);
    assert.equal(posts.length, 0); await axe("booking complete");
  });
  await check("newsletter requires consent and stays local", async () => {
    await page.goto(base + "/", { waitUntil: "networkidle" });
    await page.locator("#newsletter-email").fill("test@example.com");
    assert.equal(await page.locator(".newsletter form").evaluate(form => form.checkValidity()), false);
    await page.locator(".consent input").check();
    await page.getByRole("button", { name: "Preview newsletter signup" }).click();
    assert.equal(await page.getByText("Preview complete. Your email was not sent or saved.").isVisible(), true);
  });
  await context.close();
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const noJsPage = await noJs.newPage();
  for (const route of ["/", "/contact", "/booking"]) {
    await noJsPage.goto(base + route);
    const safe = await noJsPage.locator("form").evaluateAll(forms => forms.every(form => {
      const controls = [...form.querySelectorAll("input, select, textarea, button")];
      return controls.length > 0 && controls.every(control => control.matches(":disabled"));
    }));
    assert.equal(safe, true, `${route}: forms disabled without JavaScript`);
  }
  report.interactions.push("all demo forms remain disabled with JavaScript unavailable");
  await noJs.close();
} catch (error) {
  report.failure = error.stack; console.error(error.message); process.exitCode = 1;
} finally {
  await writeFile(`qa/browser-${label}.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
if (report.violations.length || report.pages.some(p => p.scrollWidth > p.width || p.h1 !== 1 || p.brokenImages.length) || report.consoleErrors.length) process.exitCode = 1;
console.log(`Saved qa/browser-${label}.json: ${report.violations.length} axe violations, ${report.interactions.length} interaction checks`);

