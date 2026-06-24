import { spawn } from "node:child_process";
import http from "node:http";

const SERVE_STARTUP_TIMEOUT_MS = 30000;
const SERVE_POLL_INTERVAL_MS = 200;
const SERVE_PORT_RANGE = [9000, 19000];

function pickRandomPort() {
  const [min, max] = SERVE_PORT_RANGE;
  return Math.floor(Math.random() * (max - min)) + min;
}

function waitForHttp(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const tick = () => {
      const req = http.get(url, (res) => {
        res.resume();
        if (res.statusCode && res.statusCode < 500) {
          resolve();
        } else if (Date.now() > deadline) {
          reject(new Error(`serve responded with ${res.statusCode}`));
        } else {
          setTimeout(tick, SERVE_POLL_INTERVAL_MS);
        }
      });
      req.on("error", () => {
        if (Date.now() > deadline) {
          reject(new Error("serve startup timeout"));
        } else {
          setTimeout(tick, SERVE_POLL_INTERVAL_MS);
        }
      });
      req.setTimeout(1000, () => req.destroy());
    };
    tick();
  });
}

export async function startServe({ rootDir, verbose = false }) {
  const port = pickRandomPort();
  const proc = spawn(
    "npx",
    ["serve", rootDir, "-l", String(port), "--no-clipboard", "--no-port-switching"],
    {
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, BROWSER: "none" },
    }
  );

  proc.on("error", (err) => {
    throw new Error(`failed to spawn serve: ${err.message}`);
  });

  if (verbose) {
    proc.stdout.on("data", (d) => process.stdout.write(`[serve] ${d}`));
    proc.stderr.on("data", (d) => process.stderr.write(`[serve] ${d}`));
  } else {
    proc.stdout.on("data", () => {});
    proc.stderr.on("data", () => {});
  }

  const url = `http://127.0.0.1:${port}/index.html`;
  await waitForHttp(url, SERVE_STARTUP_TIMEOUT_MS);

  return { port, proc };
}

export async function stopServe(serve) {
  if (!serve?.proc || serve.proc.killed) return;
  return new Promise((resolve) => {
    const t = setTimeout(() => {
      try {
        serve.proc.kill("SIGKILL");
      } catch {}
      resolve();
    }, 3000);
    serve.proc.on("exit", () => {
      clearTimeout(t);
      resolve();
    });
    try {
      serve.proc.kill("SIGTERM");
    } catch {
      clearTimeout(t);
      resolve();
    }
  });
}