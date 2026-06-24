// Page-side export script: runs inside the Chromium page under
// window.__zoidiumExport.*. The Node.js host calls exposeFunction("onFrame", ...)
// etc. so that frames and audio are streamed back through Playwright.
//
// Zoidium supplies `PZ.export` with two key methods that we use:
//   - getVideoFrame(Uint8Array) -> renders one frame, returns 1 (or 0 when done)
//   - getAudioSamples(number)   -> renders the audio into an AudioBuffer
//
// These already bypass the WASM (libvpx) encoder used by the in-browser
// "Export Video" button, so the FPS drop caused by heavy CPU-bound VP8/VP9
// encoding does not apply here.

export const pageExportScript = `
window.__zoidiumExport = {
  callbacks: { onFrame: null, onAudio: null, onDone: null, onFailed: null },
  run: null,
};

window.__zoidiumExport.run = async function runExport(opts) {
  const {
    projectUrl, width, height, fps,
    startFrame, lengthFrames, includeAudio,
  } = opts;

  try {
    // 1. Fetch the .pz archive over the same origin.
    const resp = await fetch(projectUrl);
    if (!resp.ok) throw new Error("Failed to fetch project: HTTP " + resp.status);
    const buffer = await resp.arrayBuffer();
    const blob = new Blob([buffer]);

    // 2. Untar the archive (Panzoid projects are gzipped tarballs).
    const archive = new PZ.archive();
    await archive.untar(blob);

    // 3. Parse project JSON.
    const projectJson = JSON.parse(await archive.getFileString("project"));

    // 4. Build a PZ.project instance from the JSON + archive.
    const project = new PZ.project();
    await project.load(projectJson, archive);

    const sequence = project.sequence;
    const seqLength = sequence.length || 0;
    if (!seqLength) throw new Error("Project has no frames");

    const exportLength = lengthFrames > 0
      ? Math.min(lengthFrames, seqLength - startFrame)
      : (seqLength - startFrame);

    if (exportLength <= 0) throw new Error("Nothing to export (start >= length)");

    // 5. Create the headless exporter. PZ.export ignores the WASM encoder
    //    entirely; getVideoFrame/getAudioSamples drive the compositor
    //    and emit raw RGBA / PCM that we hand straight to ffmpeg.
    const exporter = new PZ.export(sequence, {
      width: width,
      height: height,
      rate: fps,
      quality: 0,
      format: "webm_vp8_opus", // unused, but required by the constructor
      start: startFrame,
      length: exportLength,
    });

    // 6. Stream frames out as ArrayBuffers.
    const frameBytes = width * height * 4;
    let frameIndex = 0;
    while (true) {
      const buf = new Uint8Array(frameBytes);
      const ok = await exporter.getVideoFrame(buf);
      if (!ok) break;
      // Hand a plain array (exposeFunction JSON-serializes ArrayBuffers as
      // an opaque object; we ship a copy as a regular Array for safety).
      const arr = Array.from(buf);
      await window.__zoidiumExport.callbacks.onFrame(frameIndex, arr);
      frameIndex++;
    }

    // 7. Stream audio out as a single interleaved Float32 Array
    //    (left, right, left, right, ...) at 48 kHz stereo.
    let audioSent = false;
    if (includeAudio) {
      try {
        const totalSamples = Math.ceil(exportLength / fps * 48000);
        const audioBuf = await exporter.getAudioSamples(totalSamples);
        if (audioBuf && audioBuf.length > 0) {
          const numChannels = audioBuf.numberOfChannels;
          const ch0 = audioBuf.getChannelData(0);
          const ch1 = numChannels > 1 ? audioBuf.getChannelData(1) : ch0;
          const interleaved = new Float32Array(audioBuf.length * 2);
          for (let i = 0; i < audioBuf.length; i++) {
            interleaved[i * 2]     = ch0[i];
            interleaved[i * 2 + 1] = ch1[i];
          }
          await window.__zoidiumExport.callbacks.onAudio(Array.from(interleaved));
          audioSent = true;
        }
      } catch (e) {
        // No audio tracks — that's fine.
        console.warn("audio export skipped:", e && e.message);
      }
    }

    // 8. Clean up GPU resources.
    try { exporter.unload(); } catch (e) {}

    await window.__zoidiumExport.callbacks.onDone({
      frames: frameIndex,
      audio: audioSent,
    });
  } catch (err) {
    console.error("Zoidium headless export failed:", err);
    if (window.__zoidiumExport.callbacks.onFailed) {
      try { await window.__zoidiumExport.callbacks.onFailed(err.message || String(err)); } catch {}
    }
    throw err;
  }
};
`;