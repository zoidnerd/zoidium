import { chromium } from "playwright";

const PZ_READY_TIMEOUT_MS = 30000;

export async function startBrowser({ port, verbose = false, headless = true }) {
  const browser = await chromium.launch({
    headless,
    args: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      // Use the system GL backend when available (Metal on macOS, GL on
      // Linux). Falls back to SwiftShader automatically if no GPU.
      "--use-gl=angle",
      "--enable-webgl",
      "--ignore-gpu-blocklist",
      "--enable-features=Vulkan",
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    serviceWorkers: "block",
  });
  const page = await context.newPage();

  if (verbose) {
    page.on("console", (msg) => {
      process.stdout.write(`[browser:${msg.type()}] ${msg.text()}\n`);
    });
  } else {
    page.on("console", () => {});
  }

  page.on("pageerror", (err) => {
    process.stderr.write(`[browser:pageerror] ${err.message}\n`);
  });

  await page.goto(`http://127.0.0.1:${port}/index.html`, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });

  await page.waitForFunction(
    () => window.PZ && window.PZ.export && window.CM,
    null,
    { timeout: PZ_READY_TIMEOUT_MS }
  );

  // initTool() 内の defaultProject ロード + asset preset fetch を待つ
  await page.waitForFunction(
    () => window.CM && window.CM.defaultProject && window.CM.project,
    null,
    { timeout: PZ_READY_TIMEOUT_MS }
  );

  return { browser, context, page };
}

export async function stopBrowser(browser) {
  if (!browser) return;
  try {
    await browser.close();
  } catch {}
}