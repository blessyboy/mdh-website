import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
const base = process.env.PREVIEW_URL || "http://127.0.0.1:3010";
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const result = { timestamp: new Date().toISOString(), pages: [], scenarios: [], violations: [], errors: [], realMailSent: false };
await mkdir("qa", { recursive: true });
try {
  for(const width of [1440,390,320]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    page.on("pageerror", error => result.errors.push(error.message));
    await page.goto(base+"/contact", { waitUntil: "networkidle" });
    await page.evaluate(async()=>{
      for(let y=0;y<document.documentElement.scrollHeight;y+=innerHeight){scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}
      await Promise.all([...document.images].filter(img=>img.getClientRects().length).map(img=>img.decode().catch(()=>{})));scrollTo(0,0);
    });
    for(const email of ["info@meridiandrivehotel.com","meridiandrivehotel@gmail.com"]) assert.equal(await page.locator(`.contact-details a[href="mailto:${email}"]`).count(),1);
    for(const phone of ["+233244510133","+233264657812","+233550761141"]) assert.equal(await page.locator(`.contact-details a[href="tel:${phone}"]`).count(),1);
    assert.equal(await page.locator('.inquiry-map a[href="https://ghanapostgps.com/map?gps=GN01891152"]').count(),1);
    assert.equal(await page.getByText("GN-0189-1152",{exact:true}).count(),2);
    const overflow = await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth); assert.equal(overflow,false);
    const axe=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa","best-practice"]).analyze();
    result.violations.push(...axe.violations.map(v=>({width,id:v.id,nodes:v.nodes.map(n=>n.target)})));
    await page.screenshot({path:`qa/contact-updated-${width}.png`,fullPage:true});
    result.pages.push({width,overflow,violations:axe.violations.length});
    if(width===390) {
      let mode="failure", release; const keys=[]; const gate=new Promise(resolve=>{release=resolve;});
      await page.route("**/api/contact", async route=>{
        keys.push(route.request().headers()["idempotency-key"]);
        const body=route.request().postDataJSON(); assert.equal(body.to,undefined); assert.equal(body.email,"test@example.com"); assert.equal(body.privacyConsent,true); assert.equal(body.checkIn,"2028-12-10"); assert.equal(body.checkOut,"2028-12-12");
        if(mode==="success") await gate;
        await route.fulfill({status:mode==="success"?200:503,contentType:"application/json",body:JSON.stringify(mode==="success"?{ok:true,reference:"browser-test"}:{error:"We cannot send your message right now. Please call or email the hotel directly."})});
      });
      await page.getByRole("button",{name:"Send Inquiry",exact:true}).click(); assert.equal(keys.length,0);
      await page.locator("#contact-name").fill("Browser test"); await page.locator("#contact-email").fill("test@example.com");
      await page.locator("#contact-subject").selectOption("General Inquiry"); await page.locator("#contact-privacyConsent").check(); await page.locator("#contact-checkIn").fill("2028-12-10"); await page.locator("#contact-checkOut").fill("2028-12-12"); await page.locator("#contact-message").fill("A simulated browser test; no email will be sent.");
      await page.getByRole("button",{name:"Send Inquiry",exact:true}).click(); await page.locator(".contact-server-error").waitFor();
      assert.equal(await page.locator("#contact-message").inputValue(),"A simulated browser test; no email will be sent.");
      const failedAxe=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]).analyze(); result.violations.push(...failedAxe.violations.map(v=>({state:"provider failure",id:v.id})));
      mode="success";
      await page.getByRole("button",{name:"Send Inquiry",exact:true}).click();
      const sending=page.getByRole("button",{name:"Sending Inquiry",exact:true}); await sending.waitFor(); assert.equal(await sending.isDisabled(),true);
      assert.equal(await page.locator("#contact-name").isDisabled(),true);
      release(); await page.getByText("Thank you. Your message has been submitted to the hotel.",{exact:false}).waitFor();
      assert.equal(keys.length,2); assert.equal(keys[0],keys[1]); assert.equal(await page.locator("#contact-email").inputValue(),"");
      result.scenarios.push("Client validation, retained inputs on 503, disabled sending state, safe retry with same idempotency key, and simulated success");
    }
    await context.close();
  }
  // These integration requests cannot send mail: they fail before the sender.
  const invalid=await fetch(base+"/api/contact",{method:"POST",headers:{Origin:new URL(base).origin,"Content-Type":"application/json"},body:JSON.stringify({name:"",email:"bad",phone:"",subject:"",message:""})}); assert.equal(invalid.status,422);
  const hostile=await fetch(base+"/api/contact",{method:"POST",headers:{Origin:"https://attacker.example","Content-Type":"application/json"},body:"{}"}); assert.equal(hostile.status,403);
  assert.equal((await fetch(base+"/api/contact")).status,405);
  result.scenarios.push("Real API returns 422 for invalid fields, 403 for foreign origin, and 405 for GET without sending mail");
  assert.equal(result.violations.length,0); assert.equal(result.errors.length,0);
  console.log("PASS contact details, location/review links, 3 responsive/axe checks, simulated form states, retries, and real API input/origin/method guards");
} catch(error) { result.failure=error.stack;console.error(error);process.exitCode=1; }
finally {await writeFile("qa/contact-page-check.json",JSON.stringify(result,null,2));await browser.close();}
