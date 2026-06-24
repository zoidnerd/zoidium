import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { spawn } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT_DIR   = path.resolve(__dirname, "..", "..", "..");

const OUT = path.resolve(process.argv[2] || path.join(ROOT_DIR, "test-project.pz"));

const port = 19900 + Math.floor(Math.random() * 1000);
const serve = spawn("npx", ["serve", ROOT_DIR, "-l", String(port), "--no-clipboard"], {
  stdio: ["ignore", "pipe", "pipe"],
});

// HTTP polling
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

const dump = await page.evaluate(() => ({
  hasPZ: typeof window.PZ !== "undefined",
  hasCM: typeof window.CM !== "undefined",
  hasArchive: window.PZ && typeof window.PZ.archive,
  hasProject: window.CM && typeof window.CM.project,
  hasDefault: window.CM && typeof window.CM.defaultProject,
  scriptCount: document.scripts.length,
  docReadyState: document.readyState,
}));
console.log("DUMP:", JSON.stringify(dump, null, 2));

if (!dump.hasPZ) {
  console.error("PZ not initialized, aborting");
  await browser.close();
  serve.kill("SIGTERM");
  process.exit(1);
}

const bytes = await page.evaluate(async () => {
  const archive = new PZ.archive();
  await PZ.project.save(archive, window.CM.project);
  window.CM.project.assets.saveAll && await window.CM.project.assets.saveAll(archive);
  const blob = await archive.tar();
  const ab = await blob.arrayBuffer();
  return Array.from(new Uint8Array(ab));
});

fs.writeFileSync(OUT, Buffer.from(bytes));
console.log(`saved: ${OUT}  (${(fs.statSync(OUT).size / 1024).toFixed(1)} KB)`);

await browser.close();
serve.kill("SIGTERM");