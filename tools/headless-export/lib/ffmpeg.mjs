import { spawn } from "node:child_process";

const VIDEO_CODECS_PRESET = {
  libx264: { defaultPreset: "medium", defaultCrf: 18 },
  libx265: { defaultPreset: "medium", defaultCrf: 20 },
  libvpx: { defaultPreset: "good", defaultCrf: 31 },
  libvpx_vp9: { defaultPreset: "good", defaultCrf: 31 },
  libaom_av1: { defaultPreset: "6", defaultCrf: 28 },
  mpeg4: { defaultPreset: null, defaultCrf: null },
  copy: { defaultPreset: null, defaultCrf: null },
};

function buildArgs(opts) {
  const {
    width, height, fps, outputPath,
    videoCodec, videoBitrate, crf, preset, pixFmt,
    audioBitrate, includeAudio, extraArgs,
  } = opts;

  const args = [
    "-y",
    "-hide_banner",
    "-loglevel", "error",
    "-f", "rawvideo",
    "-pix_fmt", "rgba",
    "-s", `${width}x${height}`,
    "-r", String(fps),
    "-i", "pipe:3",
  ];

  if (includeAudio) {
    args.push(
      "-f", "f32le",
      "-ac", "2",
      "-ar", "48000",
      "-i", "pipe:4",
    );
  }

  const codecMeta = VIDEO_CODECS_PRESET[videoCodec] || {};

  args.push(
    "-c:v", videoCodec,
    "-pix_fmt", pixFmt,
  );

  if (videoCodec === "copy") {
    // rawvideo already encodes nothing; .mp4 container can't take rawvideo
    // directly so copy is essentially a no-op here. Keep options minimal.
  } else {
    if (videoBitrate) args.push("-b:v", videoBitrate);
    const useCrf = crf != null;
    const usePreset = preset != null && codecMeta.defaultPreset != null;
    if (useCrf) args.push("-crf", String(crf));
    if (usePreset) args.push("-preset", preset);
  }

  if (includeAudio) {
    args.push("-c:a", "aac", "-b:a", audioBitrate || "192k");
    args.push("-shortest");
  }

  args.push("-vf", "vflip");
  args.push("-movflags", "+faststart");

  if (Array.isArray(extraArgs)) args.push(...extraArgs);

  args.push(outputPath);

  return args;
}

export function startFFmpeg(opts) {
  const args = buildArgs(opts);

  const proc = spawn("ffmpeg", args, {
    stdio: ["pipe", "pipe", "pipe", "pipe", "pipe"],
  });

  // fd 3 = video pipe, fd 4 = audio pipe
  proc.videoStream = proc.stdio[3];
  proc.audioStream = proc.stdio[4];

  proc.videoStream.on("error", () => {});
  proc.audioStream.on("error", () => {});

  return proc;
}

export function describeFFmpegArgs(opts) {
  return buildArgs(opts).join(" ");
}