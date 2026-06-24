import { chromium } from "playwright";
import { spawn } from "node:child_process";

const port = 18766;
const serve = spawn("npx", ["serve", ".", "-l", String(port), "--no-clipboard"], {
  cwd: "/Users/dia/Projects/GitHub/Zoidium",
  stdio: ["ignore", "pipe", "pipe"],
});
// Wait for "Accepting connections" or http readiness
const http = await import("node:http");
const deadline = Date.now() + 15000;
while (Date.now() < deadline) {
  try {
    await new Promise((resolve, reject) => {
      const req = http.get(`http://127.0.0.1:${port}/`, (res) => { res.resume(); resolve(); });
      req.on("error", reject);
      req.setTimeout(500, () => req.destroy(new Error("timeout")));
    });
    break;
  } catch {
    await new Promise((r) => setTimeout(r, 300));
  }
}

const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();

page.on("console", (m) => console.log(`[c:${m.type()}]`, m.text()));
page.on("pageerror", (e) => console.log(`[pe]`, e.message));

await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: "load", timeout: 30000 });

await new Promise((r) => setTimeout(r, 4000));

const dump = await page.evaluate(() => {
  const out = {};
  out.windowKeys = Object.keys(window).filter((k) => !k.startsWith("webkit") && !k.startsWith("chrome")).slice(0, 60);
  out.hasPZ = typeof window.PZ !== "undefined";
  out.PZtype = typeof window.PZ;
  out.PZkeys = window.PZ ? Object.keys(window.PZ).slice(0, 30) : null;
  out.hasCM = typeof window.CM !== "undefined";
  out.CMtype = typeof window.CM;
  out.CMkeys = window.CM ? Object.keys(window.CM).slice(0, 30) : null;
  out.hasTHREE = typeof window.THREE !== "undefined";
  out.THREErevision = window.THREE ? window.THREE.REVISION : null;
  out.scriptCount = document.scripts.length;
  out.docReadyState = document.readyState;
  return out;
});

console.log(JSON.stringify(dump, null, 2));

await browser.close();
serve.kill("SIGTERM");