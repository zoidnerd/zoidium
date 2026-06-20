# Custom Effects (Zoidium)

開発者がカスタムエフェクトを追加するためのディレクトリ。 既存の Panzoid ランタイムは触らず、 `loader.js` に1行追加するだけで UI の Effects パネルに新エフェクトが並ぶ。 エンドユーザーはそれを検索してシーケンスにドロップする。

Zoidium は **3 種類のカスタムエフェクト** をサポートする:

| 種類 | 使う場面 | 開発者が書くもの |
|---|---|---|
| **GLSL プリセット** | 1本のフラグメントシェーダで完結する画像処理（色調補正、ぼかし、トゥーン、etc） | シェーダファイル 1 本 + ファクトリ JS 1 本 |
| **JS ロジック** | 複数パス、追加レンダーターゲット、影 / マスク生成などの重い処理 | dropshadow.js のような複雑な JS（シェーダ 1 本以上） |
| **Group プリセット** | Panzoid 純正 Twitch のような「子エフェクト束ね + 式で連動」コンテナ | `effect-custom/groups/<name>.json` 1 本 |

---

## クイックスタート

### 共通セットアップ（両タイプ共通）

1. `loader.js` の `ZOIDIUM_CUSTOM_EFFECTS` 配列にエフェクト名を追加:
   ```js
   const ZOIDIUM_CUSTOM_EFFECTS = [
     "dropshadow",
     "sepia",
     "my-effect",     // ← 追加
   ];
   ```

2. リロード → シーケンスの Effects パネルに新エフェクトが現れる。

### タイプ A: GLSL プリセット

シンプルな画像処理に向く。 シェーダファイル 1 本とファクトリ 1 本だけ。

1. **雛形をコピー**:
   ```bash
   cp effect-custom/_template_shader.js effect-custom/my-effect.js
   cp effect-custom/_template.glsl        assets/shaders/fragment/fx_my_effect.glsl
   ```

2. **`my-effect.js` を編集**:
   - `this.defaultName = "My Effect"`
   - `this._zoidiumMeta = { category, desc }` で **カテゴリと説明文を指定** (下表参照)
   - `this.shaderfile = "fx_my_effect"`
   - `propertyDefinitions` に uniform と同じ名前のパラメータを追加

3. **`fx_my_effect.glsl` を編集**:
   - Panzoid 規約の uniform 名（`tDiffuse`, `uvScale`, `resolution`）をそのまま使う
   - 独自 uniform を追加したら、 `my-effect.js` の `ShaderMaterial.uniforms` にも対応するエントリを追加

4. リロード。 エフェクト追加で "My Effect" が選べる。

具体例: [`sepia.js`](./sepia.js) + [`preset/sepia.glsl`](../../assets/shaders/fragment/preset/sepia.glsl) — カテゴリ "COLOR" に入る。

### タイプ B: JS ロジック

複数パス、追加レンダーターゲット、影生成など。 AfterClip から `dropshadow.js` を移植してある。

1. **雛形をコピー**:
   ```bash
   cp effect-custom/_template_advanced.js effect-custom/my-effect.js
   ```

2. **`my-effect.js` を編集**:
   - 通常の Panzoid effect ファクトリ
   - `this._zoidiumMeta = { category, desc }` で **カテゴリと説明文を指定**
   - `load()` 内で複数の `THREE.ShaderMaterial` / `WebGLRenderTarget` / `Scene` を組み立て可能
   - `unload()` で `dispose()`、`resize()` で RT サイズ更新など

3. シェーダが必要なら `assets/shaders/fragment/` に追加。 複数シェーダ OK。

4. リロード。

具体例: [`dropshadow.js`](./dropshadow.js) — boxblur シェーダで影を生成し、 合成パスでオリジナル下に重ねる。 カテゴリ "ENHANCE" に入る。

### タイプ C: Group プリセット

Panzoid 純正の **Group 効果** (`type: 0`) と同じ仕組みで、 複数の子エフェクトを
**共有の customProperties + JavaScript 式** で連動させるコンテナ。 1 つのダイヤルで
配下を一斉にコントロールしたい場合 (例: Twitch の Amount) に使う。

1. **JSON を作る**:
   ```bash
   # effect-custom/groups/my-preset.json を作成
   ```
   最小構成は `{name, desc, category, type:0, properties, customProperties, objects}`。
   詳細は [`groups/README.md`](./groups/README.md) を参照。

2. **`loader.js` に登録**:
   ```js
   const ZOIDIUM_CUSTOM_GROUPS = [
     "my-preset",
   ];
   ```

3. リロード → Effects パネルに "My Preset" が現れる。

具体構造の参考: [`groups/README.md`](./groups/README.md) 内の「仕組み (参考: 純正 Twitch)」
セクションに Twitch の簡略 JSON を載せている。

> **シェーダ単体で 1 本に収まるエフェクトはタイプ A/B を使おう。** Group プリセットは
> 「複数の既存エフェクトを式つなぎで束ねる」用途専用。 1 つのシェーダで書けるものを
> Group 化すると、 親 dial を 1 つ介す分だけ自由度が落ちる (配下を個別編集はできるが)。

---

## 仕組み

`loader.js` は core (`core-1.0.102.js`) 起動後に走る:

| ステップ | 処理 |
|---|---|
| 1. fetch | `effect-custom/<name>.js` を `fetch` して文字列取得 |
| 2. parse | コード先頭の `this.defaultName = "X"` を正規表現で抽出（副作用なしで UI 名だけ取得） |
| 3. fnList 登録 | `PZ.effect.fnList[name] = Promise.resolve(factory)` — Panzoid core の `await fnList[type].call(this)` 規約に合わせる |
| 4. UI 登録 | `PZ.ui.objectTypes.get(PZ.effect)` の正しい位置（既存 or 新規カテゴリ末尾）に挿入。 カテゴリヘッダとエントリを Panzoid のスキーマに合わせて生成 |

ファクトリ関数は `new Function(code)` で実行され、 Panzoid 側で生成済みの `PZ.effect` インスタンス（`parentProject` 等の依存付き）を `this` として渡される。

---

## ファイル構成

```
effect-custom/
├── README.md              # このファイル
├── loader.js              # エントリ。 ZOIDIUM_CUSTOM_EFFECTS / ZOIDIUM_CUSTOM_GROUPS 配列を編集
├── _template_shader.js    # 雛形: GLSL プリセット
├── _template_advanced.js  # 雛形: JS ロジック
├── _template.glsl         # 雛形: GLSL フラグメントシェーダ
├── dropshadow.js          # 例: JS ロジック（AfterClip から移植）
├── sepia.js               # 例: GLSL プリセット
└── groups/                # Group プリセット置き場 (各ファイルが 1 プリセット)
    ├── README.md          # 書き方ガイド
    └── *.json             # プリセット定義

assets/shaders/fragment/
├── fx_*.glsl              # 既存 Panzoid シェーダ
└── preset/
    └── sepia.glsl         # 例: カスタムプリセット
```

---

## エンドユーザー視点

開発者が `ZOIDIUM_CUSTOM_EFFECTS` に登録したエフェクトは、 Panzoid の他のエフェクトと完全に同じ手順で使える:

1. シーケンス内のクリップを選択
2. Effects タブを開く
3. 一覧に追加された "Drop Shadow" や "Sepia" を検索
4. ドラッグ&ドロップで追加
5. パラメータをキーフレーム可能

エンドユーザーがリストを編集することはできない（`loader.js` はバンドルに含まれるため）。

---

## よくある質問

**Q. 既存 Panzoid エフェクトを改造したい**
A. `effect/*.js` を直接編集できる（Zoidium の方針として既存も触ってOK）。 ただし `git pull` 時のコンフリクトに注意。

**Q. uniform 名とプロパティ名を一致させる必要がある？**
A. 統一しておくと `update()` 内で `this.pass.uniforms.X.value = this.properties.X.get(e)` と書きやすい。 名前空間が違う（例: `properties.intensity` ↔ `uniforms.intensityUniform`）場合は `update()` で明示的にマップすれば OK。

**Q. カテゴリ（COLOR / DISTORT / etc）と説明文の指定は？**
A. ファクトリの `this._zoidiumMeta = { category, desc }` で指定する:

```js
(this._zoidiumMeta = {
  category: "COLOR",  // 既存 Panzoid カテゴリ or 新しい名前
  desc: "Tints the image with a warm brown sepia tone.",
}),
```

指定可能な Panzoid カテゴリ名:

| name | 内容 |
|---|---|
| `LAYER` | Color/Gradient/Image Overlay |
| `COLOR` | 色調補正全般 |
| `ENHANCE` | Bloom, FXAA, Edge Detection |
| `DISTORT` | RGB Shift, Fisheye, Glitch |
| `BLUR + SHARPEN` | Box/Gaussian/Radial/Directional Blur, Sharpen |
| `FRAMING` | Crop, Transform, Mask |
| `MISC` | Group, Shader |

新しいカテゴリ名（例: `"CUSTOM"`）を指定すると、 リスト末尾に新規ヘッダが自動作成される。 同じ名前を複数のカスタムエフェクトで共有すれば、 同じカテゴリにまとめられる。

**Q. シェーダだけじゃ完結しないエフェクトは？**
A. タイプ B の JS ロジックを使う。 必要なら `THREE.WebGLRenderTarget` を 2 つ作ってマルチパスに。

**Q. 複数の既存エフェクトを 1 つのダイヤルで連動させたい (Twitch のような)**
A. タイプ C の Group プリセットを使う。 `effect-custom/groups/<name>.json` に
   `customProperties` + `objects` を書き、 各 object のプロパティに JavaScript 式を
   書くと式評価器が毎フレーム配下に値を流す。 詳細は [`groups/README.md`](./groups/README.md)。
