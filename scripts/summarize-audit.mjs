import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import assert from "node:assert/strict";
const readJson = async path => JSON.parse((await readFile(path, "utf8")).replace(/^\uFEFF/, ""));
const browser = await readJson("qa/browser-final.json");
const performance = await readJson("qa/performance-final.json");
const http = await readJson("qa/security-http.json");
const dependencies = await readJson("qa/npm-audit.json");
assert.equal(browser.failure, undefined);
assert.equal(browser.violations.length, 0);
assert.equal(browser.consoleErrors.length, 0);
assert.equal(browser.pages.length, 21);
assert.equal(browser.interactions.length, 9);
assert.ok(browser.pages.every(page => page.scrollWidth <= page.width && page.h1 === 1 && !page.brokenImages.length));
assert.equal(performance.length, 7);
assert.ok(performance.every(page => !page.runtimeError && page.scores.performance >= 90));
assert.equal(http.optimizer.status, "pass");
assert.equal(http.optimizer.width, 640);
assert.equal(dependencies.metadata.vulnerabilities.total, 0);
const summary = {
  generatedAt: new Date().toISOString(),
  productionBuildId: (await readFile(".next/BUILD_ID", "utf8")).trim(),
  environment: { node: process.version, chrome: browser.browser, lighthouse: performance[0].lighthouseVersion, platform: process.platform, testedRuntime: "Next.js standalone Node server on localhost" },
  accessibility: { axeViolations: 0, pageViewportCombinations: 21, viewportWidths: [320, 390, 1440], horizontalOverflow: false, brokenImages: 0, javaScriptErrors: 0, interactionChecks: browser.interactions },
  performance: performance.map(page => ({ route: page.route, fetchTime: page.fetchTime, scores: page.scores, metrics: page.metrics, warnings: page.warnings })),
  httpSecurity: { checkedAt: http.timestamp, pageHeadersChecked: 7, rejectedOptimizerRequests: 4, health: http.health, favicon: http.favicon, imageCache: http.imageCache, optimizer: http.optimizer, cspLimitation: http.note },
  dependencies: { auditFileModifiedAt: (await stat("qa/npm-audit.json")).mtime.toISOString(), vulnerabilities: dependencies.metadata.vulnerabilities, dependencyCounts: dependencies.metadata.dependencies },
  launchReady: false,
  releaseGates: ["Verified hotel content, property imagery, rates and policies", "Real booking/enquiry/newsletter integration or an approved informational-only scope", "Screen-reader, Safari/Firefox and physical-device verification", "Hosted staging performance and real-user Core Web Vitals", "Node 24 and Docker/container execution; GitHub-hosted workflow execution", "TLS/edge configuration, monitoring and rollback validation", "Final domain, sharing assets, sitemap/structured data, and deliberate removal of preview noindex"],
};
await mkdir("docs", { recursive: true });
await writeFile("docs/audit-summary.json", JSON.stringify(summary, null, 2) + "\n");
console.log("Saved docs/audit-summary.json; all recorded automated gates pass, public launch gates remain open.");
