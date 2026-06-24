#!/usr/bin/env node
//
// Zoidium headless frame-by-frame export CLI.
//
// Usage:
//   node cli.mjs --input project.pz --output out.mp4
//
// Architecture:
//   ┌──────────────────────────────────────────┐
//   │  Node CLI (this file)                    │
//   │   - arg parsing, ffmpeg child process    │
//   │   - exposes onFrame / onAudio / onDone   │
//   └──────────────┬───────────────────────────┘
//                  │ Playwright exposeFunction
//                  ▼
//   ┌──────────────────────────────────────────┐
//   │  Chromium (Playwright, headless)         │
//   │  http://127.0.0.1:<port>/index.html      │
//   │   - loads PZ.* from /js/*.js             │
//   │   - fetches projectUrl (.pz)             │
//   │   - calls PZ.export.getVideoFrame()      │
//   │   - calls PZ.export.getAudioSamples()    │
//   └──────────────┬───────────────────────────┘
//                  │ stdin via fd 3 (raw RGBA) / fd 4 (f32le PCM)
//                  ▼
//   ┌──────────────────────────────────────────┐
//   │  ffmpeg                                  │
//   │   -f rawvideo -pix_fmt rgba   → libx264  │
//   │   -f f32le    -ac 2 -ar 48000 → aac      │
//   └──────────────────────────────────────────┘
//

import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { startServe, stopServe } from "./lib/serve.mjs";
import { startBrowser, stopBrowser } from "./lib/browser.mjs";
import { pageExportScript } from "./lib/page-export.mjs";
import { startFFmpeg } from "./lib/ffmpeg.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT_DIR   = path.resolve(__dirname, "..", "..");
const TMP_PZ_DIR = path.join(ROOT_DIR, "download", "_tmp");

// ---------------------------------------------------------------------------
// arg parsing (kept dependency-free)
// ---------------------------------------------------------------------------

const USAGE = `Zoidium headless frame export

Usage:
  node cli.mjs --input <project.pz> --output <out.mp4> [options]

Required:
  --input  <path>       Input .pz project file
  --output <path>       Output media file (default: <input>.mp4)

Video:
  --fps         <n>     Frame rate              (default: 30)
  --width       <n>     Output width            (default: 1920)
  --height      <n>     Output height           (default: 1080)
  --video-codec <name>  ffmpeg -c:v value       (default: libx264)
  --video-bitrate <r>   ffmpeg -b:v value       (e.g. 8M, 2500k)
  --crf         <n>     ffmpeg -crf value       (default: 18)
  --preset      <name>  ffmpeg -preset value    (default: medium)
  --pix-fmt     <name>  ffmpeg -pix_fmt value   (default: yuv420p)
  --start       <n>     Start frame             (default: 0)
  --length      <n>     Length in frames        (default: full)
  --extra-args  <str>   Extra ffmpeg args (space-separated, quoted)

Audio:
  --no-audio            Skip audio track
  --audio-bitrate <r>   ffmpeg -b:a value       (default: 192k)

Debug:
  --verbose             Forward browser console + ffmpeg stderr
  --help                Show this help
`;

function parseArgs(argv) {
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") {
      console.log(USAGE);
      process.exit(0);
    }
    if (a === "--no-audio") { opts.audio = false; continue; }
    if (a === "--verbose" || a === "-v") { opts.verbose = true; continue; }
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const val = argv[i + 1];
      if (val === undefined || val.startsWith("--")) {
        opts[key] = true;
      } else {
        opts[key] = val;
        i++;
      }
    }
  }
  return opts;
}

function intOr(v, dflt) {
  if (v === undefined || v === null || v === "") return dflt;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : dflt;
}

function floatOr(v, dflt) {
  if (v === undefined || v === null || v === "") return dflt;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : dflt;
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

const args = parseArgs(process.argv.slice(2));

if (!args.input) {
  console.error("Error: --input <project.pz> is required\n");
  console.log(USAGE);
  process.exit(1);
}

const projectPath = path.resolve(args.input);
const outputPath  = path.resolve(
  args.output || projectPath.replace(/\.pz$/i, "") + ".mp4"
);

const width       = intOr(args.width, 1920);
const height      = intOr(args.height, 1080);
const fps         = floatOr(args.fps, 30);
const startFrame  = intOr(args.start, 0);
const lengthFrames = intOr(args.length, 0);
const includeAudio = args.audio !== false;

const videoCodec   = args["video-codec"] || "libx264";
const videoBitrate = args["video-bitrate"] || null;
const crf          = args.crf != null ? intOr(args.crf, 18) : 18;
const preset       = args.preset || "medium";
const pixFmt       = args["pix-fmt"] || "yuv420p";
const audioBitrate = args["audio-bitrate"] || "192k";
const extraArgs    = args["extra-args"]
  ? String(args["extra-args"]).split(/\s+/).filter(Boolean)
  : [];

const verbose = args.verbose === true;

if (!fs.existsSync(projectPath)) {
  console.error(`Error: input file not found: ${projectPath}`);
  process.exit(1);
}

// state shared with cleanup
let serve, browser, ffmpeg, tmpProjectPath;
let framesProcessed = 0;
let totalFrames = 0;
let startedAt = 0;
let lastLineLen = 0;

function progressTick() {
  if (framesProcessed === 1) startedAt = Date.now();
  const elapsed = (Date.now() - startedAt) / 1000;
  const fpsActual = elapsed > 0 ? framesProcessed / elapsed : 0;
  let eta = "";
  if (fpsActual > 0 && totalFrames > 0) {
    const remain = (totalFrames - framesProcessed) / fpsActual;
    eta = `  eta ${remain.toFixed(1)}s`;
  }
  const line = totalFrames > 0
    ? `[Frame ${framesProcessed}/${totalFrames}  ${(framesProcessed / totalFrames * 100).toFixed(1)}%  ${fpsActual.toFixed(1)} f/s]${eta}`
    : `[Frame ${framesProcessed}]`;
  process.stdout.write("\r" + line + " ".repeat(Math.max(0, lastLineLen - line.length)));
  lastLineLen = line.length;
}

function progressFinish() {
  process.stdout.write("\n");
}

async function copyProjectToServe() {
  fs.mkdirSync(TMP_PZ_DIR, { recursive: true });
  const baseName = `${Date.now()}-${process.pid}-${path.basename(projectPath)}`;
  tmpProjectPath = path.join(TMP_PZ_DIR, baseName);
  fs.copyFileSync(projectPath, tmpProjectPath);
  return `/download/_tmp/${baseName}`;
}

function cleanupTmp() {
  if (tmpProjectPath) {
    try { fs.unlinkSync(tmpProjectPath); } catch {}
  }
}

async function run() {
  console.log("Zoidium headless export");
  console.log(`  Input:    ${projectPath}`);
  console.log(`  Output:   ${outputPath}`);
  console.log(`  Size:     ${width}x${height} @ ${fps}fps`);
  console.log(`  Codec:    ${videoCodec}  crf=${crf}  preset=${preset}`);
  if (videoBitrate) console.log(`  VBR:      ${videoBitrate}`);
  console.log(`  PixFmt:   ${pixFmt}`);
  console.log(`  Audio:    ${includeAudio ? audioBitrate : "disabled"}`);
  console.log(`  Frames:   start=${startFrame}  length=${lengthFrames || "(full)"}`);
  console.log("");

  // ---- 1. npx serve (delivers index.html + the .pz file)
  serve = await startServe({ rootDir: ROOT_DIR, verbose });
  console.log(`[1/4] serve ready  http://127.0.0.1:${serve.port}`);

  const projectUrl = await copyProjectToServe();
  console.log(`        project served at ${projectUrl}`);

  // ---- 2. Playwright headless Chromium
  browser = await startBrowser({ port: serve.port, verbose });
  console.log("[2/4] browser ready");

  const { page } = browser;

  // Inject the page-side export logic BEFORE any user script runs.
  await page.addInitScript(pageExportScript);
  // Re-load so the init script applies.
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => window.PZ && window.PZ.export && window.__zoidiumExport,
    null,
    { timeout: 30000 }
  );

  // ---- 3. ffmpeg child process
  const ffmpegOpts = {
    width, height, fps, outputPath,
    videoCodec, videoBitrate, crf, preset, pixFmt,
    audioBitrate, includeAudio, extraArgs,
  };
  ffmpeg = startFFmpeg(ffmpegOpts);
  console.log("[3/4] ffmpeg spawned");

  if (verbose) {
    ffmpeg.stderr.on("data", (d) => process.stderr.write(`[ffmpeg] ${d}`));
  } else {
    ffmpeg.stderr.on("data", () => {});
  }

  let ffmpegExitCode = null;
  ffmpeg.on("exit", (code, signal) => {
    ffmpegExitCode = code;
    if (code !== 0 && code !== null) {
      process.stderr.write(`\n[ffmpeg] exited with code ${code}${signal ? " (" + signal + ")" : ""}\n`);
    }
  });

  let ffmpegError = null;
  ffmpeg.on("error", (err) => {
    ffmpegError = err;
    process.stderr.write(`\n[ffmpeg] error: ${err.message}\n`);
  });

  // ---- 4. expose host callbacks to the page
  let exportFailed = null;

  await page.exposeFunction("__hostOnFrame", async (_index, buffer) => {
    if (!ffmpeg || ffmpegExitCode !== null) return;
    const u8 = Uint8Array.from(buffer);
    const ok = ffmpeg.videoStream.write(u8);
    framesProcessed++;
    progressTick();
    if (!ok) {
      // Backpressure: wait for drain before the next frame.
      await new Promise((resolve) => ffmpeg.videoStream.once("drain", resolve));
    }
  });

  await page.exposeFunction("__hostOnAudio", async (buffer) => {
    if (!ffmpeg || !includeAudio || ffmpegExitCode !== null) return;
    const f32 = Float32Array.from(buffer);
    const u8 = new Uint8Array(f32.buffer);
    const ok = ffmpeg.audioStream.write(u8);
    if (!ok) {
      await new Promise((resolve) => ffmpeg.audioStream.once("drain", resolve));
    }
  });

  await page.exposeFunction("__hostOnDone", async () => {
    if (!ffmpeg || ffmpegExitCode !== null) return;
    ffmpeg.videoStream.end();
    if (includeAudio) ffmpeg.audioStream.end();
  });

  await page.exposeFunction("__hostOnFailed", async (msg) => {
    exportFailed = msg;
    if (ffmpeg && ffmpegExitCode === null) {
      try { ffmpeg.videoStream.end(); } catch {}
      try { ffmpeg.audioStream && ffmpeg.audioStream.end(); } catch {}
    }
  });

  // Wire the callbacks into the page-side export.
  await page.evaluate(() => {
    window.__zoidiumExport.callbacks.onFrame  = (i, b) => window.__hostOnFrame(i, b);
    window.__zoidiumExport.callbacks.onAudio  = (b)    => window.__hostOnAudio(b);
    window.__zoidiumExport.callbacks.onDone   = ()     => window.__hostOnDone();
    window.__zoidiumExport.callbacks.onFailed = (msg)  => window.__hostOnFailed(msg);
  });

  // ---- 5. determine total frame count up front for progress %
  totalFrames = await page.evaluate(async ({ url, start, length }) => {
    const resp = await fetch(url);
    const buf  = await resp.arrayBuffer();
    const blob = new Blob([buf]);
    const archive = new PZ.archive();
    await archive.untar(blob);
    const json = JSON.parse(await archive.getFileString("project"));
    const seqLen = json.sequence.length || 0;
    if (length > 0) return Math.min(length, Math.max(0, seqLen - start));
    return Math.max(0, seqLen - start);
  }, { url: projectUrl, start: startFrame, length: lengthFrames });

  if (totalFrames <= 0) {
    throw new Error("Project has no frames to export (check --start / --length)");
  }

  console.log(`[4/4] exporting ${totalFrames} frames (${(totalFrames / fps).toFixed(2)}s)`);
  startedAt = Date.now();

  // ---- 6. run the page-side export
  await page.evaluate(
    (opts) => window.__zoidiumExport.run(opts),
    {
      projectUrl,
      width, height, fps,
      startFrame, lengthFrames,
      includeAudio,
    }
  );

  progressFinish();

  if (exportFailed) {
    throw new Error("page-side export failed: " + exportFailed);
  }

  // ---- 7. wait for ffmpeg to finalize the container
  await new Promise((resolve, reject) => {
    if (ffmpegExitCode !== null) {
      if (ffmpegExitCode === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${ffmpegExitCode}`));
      return;
    }
    ffmpeg.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });

  const totalElapsed = (Date.now() - startedAt) / 1000;
  console.log(`✓ done in ${totalElapsed.toFixed(1)}s  (${(framesProcessed / totalElapsed).toFixed(1)} f/s avg)`);
  console.log(`  ${outputPath}`);
}

async function cleanup() {
  await stopBrowser(browser);
  await stopServe(serve);
  cleanupTmp();
}

let cleanupStarted = false;
async function safeCleanup() {
  if (cleanupStarted) return;
  cleanupStarted = true;
  try {
    if (ffmpeg && ffmpeg.exitCode === null) {
      try { ffmpeg.videoStream.end(); } catch {}
      try { ffmpeg.audioStream && ffmpeg.audioStream.end(); } catch {}
      try { ffmpeg.kill("SIGTERM"); } catch {}
    }
  } catch {}
  await cleanup();
}

process.on("SIGINT", async () => {
  process.stderr.write("\nInterrupted (SIGINT)\n");
  await safeCleanup();
  process.exit(130);
});
process.on("SIGTERM", async () => {
  process.stderr.write("\nTerminated (SIGTERM)\n");
  await safeCleanup();
  process.exit(143);
});

run()
  .then(async () => {
    await cleanup();
    process.exit(0);
  })
  .catch(async (err) => {
    progressFinish();
    process.stderr.write(`\n✗ Export failed: ${err.message}\n`);
    if (verbose && err.stack) process.stderr.write(err.stack + "\n");
    await safeCleanup();
    process.exit(1);
  });