# Zoidium Headless Export CLI

フレーム単位の書き出し + ネイティブ ffmpeg による合成で、
ブラウザ内「Export Video」の WASM エンコーダで起きる FPS 低下を回避する CLI。

## なぜこれが必要か

Zoidium の動画エクスポートは内部の WASM (libvpx) エンコーダが律速で、
`cpu_used` / `lag_in_frames` を品質のために上げるとフレームバッファが詰まり、
特に **動画要素を含むプロジェクト** では実 FPS が大きく落ちる既知の不具合がある。

この CLI は次の戦略でこれを完全に回避する:

1. Panzoid 本体に元々存在する `PZ.export.getVideoFrame()` / `getAudioSamples()` で
   WASM encode を経由せず **RGBA バイト列 + Float32 PCM** を直接取り出す
2. その生データをネイティブ ffmpeg の stdin (fd 3 / fd 4) に pipe
3. ffmpeg 側で H.264 / H.265 / VP9 / AV1 など好きな codec で高品質エンコード

ブラウザ側は WebGL で 1 フレーム描画 + readPixels するだけなので
**プロジェクト内容に依らず一定の速度**で進む。

## 前提

- Node.js 20+
- システムに `ffmpeg` (PATH に存在)
- macOS / Linux (Windows は ffmpeg の fd 渡しが異なるため要調整)
- 初回のみ Playwright の Chromium ダウンロードが必要

## セットアップ

```bash
cd tools/headless-export
npm install
npx playwright install chromium
```

## 使い方

### 基本的な使い方

```bash
# プロジェクトルートから
npm run export -- --input path/to/myproject.pz --output out.mp4

# または直接
node tools/headless-export/cli.mjs --input myproject.pz --output out.mp4
```

### 全オプション

```
--input  <path>       入力 .pz プロジェクト (必須)
--output <path>       出力メディア (既定: <input>.mp4)

--fps         <n>     フレームレート (既定: 30)
--width       <n>     出力幅 (既定: 1920)
--height      <n>     出力高さ (既定: 1080)
--video-codec <name>  ffmpeg -c:v (既定: libx264)
--video-bitrate <r>   ffmpeg -b:v (例: 8M, 2500k)
--crf         <n>     ffmpeg -crf (既定: 18)
--preset      <name>  ffmpeg -preset (既定: medium)
--pix-fmt     <name>  ffmpeg -pix_fmt (既定: yuv420p)
--start       <n>     開始フレーム (既定: 0)
--length      <n>     フレーム数 (既定: 末尾まで)

--no-audio            音声トラックをスキップ
--audio-bitrate <r>   ffmpeg -b:a (既定: 192k)

--extra-args "<str>"  ffmpeg に追加の引数 (空白区切り)

--verbose             ブラウザコンソール + ffmpeg stderr を表示
```

### 例

```bash
# 4K 60fps, 高品質 (slow preset, crf 16)
npm run export -- --input project.pz --output out.mp4 \
  --width 3840 --height 2160 --fps 60 \
  --preset slow --crf 16

# VP9 ウェブ向け
npm run export -- --input project.pz --output out.webm \
  --video-codec libvpx-vp9 --crf 31 --preset good \
  --audio-bitrate 128k

# AV1 (超高圧縮、ただし遅い)
npm run export -- --input project.pz --output out.mkv \
  --video-codec libaom-av1 --crf 28 --preset 6

# ビットレート固定 (ストリーミング用)
npm run export -- --input project.pz --output out.mp4 \
  --video-bitrate 6M --audio-bitrate 192k

# 音声なし
npm run export -- --input project.pz --output silent.mp4 --no-audio

# 部分範囲 (フレーム 30〜150)
npm run export -- --input project.pz --output clip.mp4 \
  --start 30 --length 120

# 任意の ffmpeg 引数を追加
npm run export -- --input project.pz --output out.mp4 \
  --extra-args "-tune film -x264-params keyint=60:min-keyint=60"
```

## .pz ファイルを取得する

1. Zoidium をブラウザで開く (`npm run web`)
2. プロジェクトを編集
3. `Ctrl+S` (Mac: `Cmd+S`) で `.pz` として保存

これで `download.html` が開かれ、ブラウザ既定のダウンロード先に
`project.pz` が落ちる。これを CLI 入力に使う。

## 仕組み

```
┌──────────────────────────────────────────┐
│ Node CLI (cli.mjs)                       │
│  arg parse + ffmpeg child process        │
└──────────────┬───────────────────────────┘
               │ exposeFunction
               ▼
┌──────────────────────────────────────────┐
│ Chromium (Playwright, headless)          │
│  http://127.0.0.1:<random>/index.html    │
│                                          │
│  1. fetch /download/_tmp/<hash>.pz       │
│  2. PZ.archive.untar()                   │
│  3. new PZ.project().load()              │
│  4. new PZ.export(seq, opts)             │
│  5. while (await getVideoFrame(buf))     │
│       onFrame(idx, buf.buffer)           │
│  6. await getAudioSamples(numSamples)    │
│       onAudio(interleaved.buffer)        │
└──────────────┬───────────────────────────┘
               │ fd 3 (raw RGBA) / fd 4 (f32le PCM)
               ▼
┌──────────────────────────────────────────┐
│ ffmpeg                                   │
│  -f rawvideo -pix_fmt rgba → libx264     │
│  -f f32le    -ac 2 -ar 48000 → aac       │
│  -vf vflip (WebGL 座標系を画像座標系に)   │
└──────────────────────────────────────────┘
```

- WebGL の `readPixels` は左下原点で読み出すので、ffmpeg 側で `-vf vflip` を入れて
  通常の左上原点に揃えている
- 映像と音声はそれぞれ別の fd (3 と 4) で ffmpeg に渡されるので、
  ページ側で非同期に届いても ffmpeg が固まらない
- `-shortest` で映像尺に音声を揃える

## トラブルシューティング

### `Failed to spawn serve`

Zoidium ルートで実行しているか確認。`npx serve` には `serve` が PATH にあれば OK
(親 `package.json` の devDependencies に既に入っている)。

### `Failed to spawn ffmpeg`

システムに ffmpeg が入っているか確認:

```bash
ffmpeg -version
```

なければ Homebrew (Mac) / apt (Linux) でインストール:

```bash
brew install ffmpeg        # Mac
sudo apt install ffmpeg    # Debian/Ubuntu
```

### フレーム取得で真っ黒 / 真っ白

解像度がプロジェクトと合っていない可能性。プロジェクト設定 (1920×1080 等) に
合わせて `--width` `--height` を指定する。

### `pipe:3` 関連エラーが出る

UNIX 系 OS (Mac / Linux) 専用。Windows では `pipe:3` のかわりに
named pipe など別の渡し方が必要。

### `Cannot read properties of undefined (reading 'getVideoFrame')`

Playwright が PZ 初期化完了を待たずに評価を始めた可能性。
`browser.mjs` の `waitForFunction` で `window.PZ.export` を待っているので
通常は起きないが、Zoidium 本体の読み込み順序が変わると要調整。

## 既知の制約

### レンダリング速度

ヘッドレス Chromium の WebGL は SwiftShader (CPU 実装) にフォールバック
することが多く、1080p/30fps の書き出しだと数 fps 程度に留まることがある
(Mac では `--use-gl=angle` を指定しても Metal バックエンドを掴まず
SwiftShader が選ばれるケースが多い)。

**対処**:

- 解像度を下げる (`--width 1280 --height 720` 等)
- ヘッドレスではなく `--browser-headed` のようなオプションを足して
  GPU アクセラレーションが効く状態で起動する
- 動画のように重いシーケンスはフルの Chromium + GPU の方が圧倒的に速い

### その他の制約

- **音声ありプロジェクト**: 内部で `OfflineAudioContext` を構築するため、
  プロジェクトに音楽ファイルが含まれる場合はそのデコード時間が加算される
- **モーションブラー ON のプロジェクト**: 各フレーム描画に複数回 render が走るため、
  デフォルトプロジェクトより遅くなる
- **大量フレーム (数分以上)**: メモリ使用量は `width × height × 4 bytes` の
  フレームバッファ程度なので 1080p で数十 MB