import { chromium } from "playwright";
import { spawn } from "node:child_process";

const port = 18765;
const serve = spawn("npx", ["serve", ".", "-l", String(port), "--no-clipboard"], {
  cwd: "/Users/dia/Projects/GitHub/Zoidium",
  stdio: ["ignore", "pipe", "pipe"],
});

await new Promise((r) => setTimeout(r, 2500));

const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();

page.on("console", (m) => console.log(`[console:${m.type()}]`, m.text()));
page.on("pageerror", (e) => console.log(`[pageerror]`, e.message));
page.on("request", (r) => console.log(`[req]`, r.method(), r.url()));
page.on("response", (r) => console.log(`[resp ${r.status()}]`, r.url()));
page.on("requestfailed", (r) => console.log(`[reqfail]`, r.url(), r.failure()?.errorText));

try {
  await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: "load", timeout: 30000 });
} catch (e) {
  console.log("[goto err]", e.message);
}

console.log("Final URL:", page.url());

const html = await page.content();
console.log("HTML head 500:");
console.log(html.slice(0, 500));
console.log("---");
console.log("HTML has core script:", html.includes("core-1.0.102.js"));
console.log("HTML has 'var PZ = {}':", html.includes("var PZ = {}"));
console.log("HTML has 'initTool':", html.includes("initTool"));
console.log("---");

await browser.close();
serve.kill("SIGTERM");