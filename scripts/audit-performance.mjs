import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.PREVIEW_URL || "http://127.0.0.1:3010";
const label = process.env.AUDIT_LABEL || "latest";
const routes = process.env.AUDIT_ROUTES ? process.env.AUDIT_ROUTES.split(",") : ["/", "/about", "/rooms", "/amenities", "/gallery", "/contact", "/booking"];
const chrome = await launch({ chromePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", chromeFlags: ["--headless=new", "--disable-gpu", "--no-first-run"] });
const results = [];
await mkdir("qa", { recursive: true });
try {
  for (const route of routes) {
    const result = await lighthouse(new URL(route, base).href, { port: chrome.port, output: ["json", "html"], logLevel: "error", onlyCategories: ["performance", "accessibility", "best-practices", "seo"], formFactor: "mobile" });
    if (!result) throw new Error(`No Lighthouse result for ${route}`);
    const name = route === "/" ? "home" : route.slice(1);
    await writeFile(`qa/lighthouse-${label}-${name}.json`, result.report[0]);
    await writeFile(`qa/lighthouse-${label}-${name}.html`, result.report[1]);
    const lhr = result.lhr;
    const entry = { route, fetchTime: lhr.fetchTime, lighthouseVersion: lhr.lighthouseVersion, scores: Object.fromEntries(Object.entries(lhr.categories).map(([key, value]) => [key, value.score === null ? null : Math.round(value.score * 100)])), metrics: Object.fromEntries(["first-contentful-paint", "largest-contentful-paint", "speed-index", "total-blocking-time", "cumulative-layout-shift", "server-response-time"].map(key => [key, { value: lhr.audits[key]?.numericValue, display: lhr.audits[key]?.displayValue }])), failedAudits: Object.values(lhr.audits).filter(a => a.score !== null && a.score < 1).map(a => ({ id: a.id, title: a.title, display: a.displayValue, score: a.score })), runtimeError: lhr.runtimeError, warnings: lhr.runWarnings };
    results.push(entry);
    console.log(JSON.stringify({ route, scores: entry.scores, metrics: entry.metrics }));
    await writeFile(`qa/performance-${label}.json`, JSON.stringify(results, null, 2));
  }
} finally { await chrome.kill(); }
if (results.some(r => r.runtimeError || (r.scores.performance ?? 0) < 90)) process.exitCode = 1;
