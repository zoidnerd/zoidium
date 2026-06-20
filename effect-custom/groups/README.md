# Custom Group Presets (Zoidium)

Panzoid 純正の **Group 効果** (`type: 0`) は、子エフェクトを束ね、共有の
customProperties から **JavaScript 式** で値を配るコンテナです。 同梱の
[Twitch](#仕組みの参考純正-twitch) が代表例で、`Amount` / `Speed` ひとつを上げると
配下の `rgbshift` / `directionalblur` / `transform` が一斉に揺れます。

このディレクトリに置いた JSON ファイルは `loader.js` から自動で Panzoid に登録され、
Effects パネルのピッカーに表示されます。 エンドユーザーは他のエフェクトと同じ手順で
シーケンスに追加でき、配下の sub-effect もプロパティパネルから個別に編集できます。

---

## クイックスタート

### 1. JSON ファイルを作る

`effect-custom/groups/<name>.json` を以下の最小構成で作成します:

```json
{
  "name": "My Preset",
  "desc": "One-line description shown on hover.",
  "category": "DISTORT",
  "type": 0,
  "properties": {
    "name": "My Preset (v1)",
    "enabled": { "animated": false, "keyframes": [{ "value": 1, "frame": 0, "tween": 1 }] }
  },
  "customProperties": [
    {
      "type": { "custom": true, "dynamic": true, "type": 0, "value": 0 },
      "properties": { "name": "Amount" },
      "animated": false,
      "keyframes": [{ "value": 0.5, "frame": 0, "tween": 1 }]
    }
  ],
  "objects": []
}
```

### 2. loader.js に登録

`effect-custom/loader.js` 冒頭の `ZOIDIUM_CUSTOM_GROUPS` 配列に名前を追加:

```js
const ZOIDIUM_CUSTOM_GROUPS = [
  "my-preset",
];
```

### 3. リロード

シーケンスの Effects パネルを開くと、 指定カテゴリの末尾 (または新規カテゴリ末尾)
に "My Preset" が現れます。

---

## JSON スキーマ

| キー | 必須 | 内容 |
|---|---|---|
| `name` | ✅ | ピッカー表示名 |
| `desc` | | ホバー時のツールチップ (**必ず英語で記述** — Panzoid アプリ全体の UI 言語と合わせる。 省略時: "Custom group preset (Zoidium)") |
| `category` | | 配置先の Panzoid カテゴリ名。 既存名と一致すれば末尾に挿入、 新規名ならリスト末尾に新ヘッダを作って挿入 (省略時: リスト末尾の MISC 扱い) |
| `type` | ✅ | **`0` 固定** (`PZ.effect.group` の type)。 loader.js はこの値を検証する |
| `properties` | ✅ | インスタンス既定値。 `name` (内部表示名) と `enabled` (ON/OFF) を含む |
| `customProperties` | ✅ | ユーザー向けダイヤル。 各要素は Panzoid のプロパティ定義 |
| `objects` | ✅ | 子エフェクト配列。 各要素は `{type: "<effect>", properties: {...}}` |

`name` / `desc` / `category` 以外のフィールドは **`data` として丸ごと Panzoid に渡される**。
Panzoid 側 (`PZ.effect.group.load`) は `properties` / `customProperties` / `objects`
だけを読み、未知のキーは無視するので、 将来の Panzoid 拡張で新フィールドが追加されても
前方互換で動く。

---

## customProperties の書き方

`Amount` / `Speed` のような **ユーザに見せるスライダ・トグル**。 Panzoid 式評価器が
`properties["Amount"]` の形で参照できるように名前をキーにする。

```json
{
  "type": { "custom": true, "dynamic": true, "type": 0, "value": 0 },
  "properties": { "name": "Speed" },
  "animated": false,
  "keyframes": [{ "value": 2, "frame": 0, "tween": 1 }]
}
```

- `type` 内の `type` 値 (ややこしいが Panzoid のネスト仕様):
  - `0` = NUMBER (連続スライダ)
  - `1` = OPTION (off;on 等のドロップダウン)
  - `2` = TEXT
  - `3` = COLOR (vec3)
  - `4` = VECTOR2
  - `5` = VECTOR3
  - 他は `PZ.property.type` を参照
- `dynamic: true` を付けるとキーフレーム化可能 (Zoidium 方針として全プロパティ推奨)
- `keyframes` は既定値。 `value` を直接書き換えれば OK

---

## objects の書き方

**子エフェクト**。 `type` に Panzoid 純正エフェクト名 (例: `"rgbshift"`,
`"directionalblur"`, `"transform"`, `"brightnesscontrast"`) または Zoidium
カスタムシェーダ名を指定する。 通常の `effect/` と同じ初期化が行われる。

プロパティに **`expression`** を書くと、 毎フレーム JavaScript 式で計算される:

```json
{
  "type": "rgbshift",
  "properties": {
    "name": "RGB Shift",
    "enabled": { "animated": false, "keyframes": [{ "value": 1, "frame": 0, "tween": 1 }] },
    "amount": {
      "animated": true,
      "expression": "var amt = properties[\"Amount\"];\namt *= properties[\"RGB Shift amount\"];\nvar spd = properties[\"Speed\"];\nspd *= properties[\"RGB Shift tendency\"];\namt * shake(time, spd, 1, 0, 2)"
    },
    "angle": { "animated": false, "keyframes": [{ "value": 1.55, "frame": 0, "tween": 1 }] }
  }
}
```

expression から使える組み込み:

| 名前 | 意味 |
|---|---|
| `properties["..."]` | customProperties の現在フレーム値 (名前→値マップ) |
| `time` | 現在のクリップ時間 (秒) |
| `shake(t, freq, amp, octaves, seed)` | ランダム揺れ (`PZ.expression.methods.shake`) |
| `wave(t)` | 矩形波 (±1) |
| `lerp(a, b, t)` / `linear(a, b, t)` | 線形補間 |
| `ease(t, type, dir)` | イージング (`type`: Linear / Quadratic / Cubic / ...、`dir`: In / Out / InOut) |
| `catmullRom(p0,p1,p2,p3,t)` | Catmull-Rom スプライン |
| `clamp(x, lo, hi)` / `add/sub/mul/div/dot/cross/length/normalize` | ベクトル演算 |

完全なリスト: `PZ.expression.methods` (`core-1.0.102.js` 内)

---

## 仕組み (参考: 純正 Twitch)

Panzoid 同梱の Twitch を簡略化すると以下の構造になる:

```json
{
  "name": "Twitch",
  "desc": "Combines various effects to create a chaotic distortion effect.",
  "category": "DISTORT",
  "type": 0,
  "properties": {
    "name": "Twitch (beta v1)",
    "enabled": { "animated": false, "keyframes": [{ "value": 1, "frame": 0, "tween": 1 }] }
  },
  "customProperties": [
    { "type": {"custom":true,"dynamic":true,"type":0,"value":0}, "properties":{"name":"Amount"},     "animated":false, "keyframes":[{"value":0.3,"frame":0,"tween":1}] },
    { "type": {"custom":true,"dynamic":true,"type":0,"value":0}, "properties":{"name":"Speed"},      "animated":false, "keyframes":[{"value":2,  "frame":0,"tween":1}] },
    { "type": {"custom":true,"dynamic":true,"type":0,"value":0}, "properties":{"name":"RGB Shift amount"}, "animated":false, "keyframes":[{"value":24,"frame":0,"tween":1}] },
    { "type": {"custom":true,"dynamic":true,"type":0,"value":0}, "properties":{"name":"RGB Shift tendency"},"animated":false, "keyframes":[{"value":10,"frame":0,"tween":1}] }
  ],
  "objects": [
    {
      "type": "rgbshift",
      "properties": {
        "name": "RGB Shift",
        "enabled": { "animated": false, "keyframes": [{ "value": 1, "frame": 0, "tween": 1 }] },
        "amount": {
          "animated": true,
          "expression": "var amt = properties[\"Amount\"]; amt *= properties[\"RGB Shift amount\"]; var spd = properties[\"Speed\"]; spd *= properties[\"RGB Shift tendency\"]; amt * shake(time, spd, 1, 0, 2)"
        },
        "angle": { "animated": false, "keyframes": [{ "value": 1.55, "frame": 0, "tween": 1 }] }
      }
    }
    // ... directionalblur, brightnesscontrast, transform (Transform でスライド)
  ]
}
```

カスタム JSON として移植する場合もまったく同じ形で書けば動く。

---

## よくある質問

**Q. JSON ではなく JS で書きたい (動的に生成したい)**
A. 現 loader は JSON のみサポート。 動的生成が必要なら `loader.js` の
   `loadZoidiumCustomGroup()` を改造して `data` に関数を返すケースを許容すれば良い
   (Panzoid 側はその形を `"function" == typeof s` で扱う)。

**Q. シェーダ単体エフェクトを追加したい (色補正など)**
A. `effect-custom/groups/` ではなく `effect-custom/` 直下に `.js` を置く従来方式を使う。
   詳細は [`../README.md`](../README.md) の「タイプ A: GLSL プリセット」を参照。

**Q. objects に既存 Zoidium カスタムエフェクト (例: `"sepia"`) を入れられる?**
A. 入れられる。 Panzoid は `effect/<type>.js` を `fetch` してロードするため、
   Zoidium が `PZ.effect.fnList["sepia"]` に登録していればそのまま使える
   (loader.js の起動が完了する前に Group プリセットを追加されると
   `fnList` が空のため失敗するので注意)。

**Q. 保存したプロジェクトのカスタムプリセットは他環境で動く?**
A. プロジェクト JSON にはプリセットの `data` がそのまま保存される (`toJSON()` の
   `customProperties` / `objects` がそのまま出力される)。 つまりプリセット JSON を
   持っていなくてもプロジェクトは読めるが、 プリセット固有のダイヤル (Amount 等)
   は評価器が式を解けないため **値として展開された固定値** にフォールバックする。
   配布プロジェクトにはプリセット JSON も同梱するか、 値をベタ書きする。

**Q. Panzoid 純正 Twitch と衝突しない?**
A. 衝突しない。 純正 Twitch は `name: "Twitch"` で固定、 loader は `ZOIDIUM_CUSTOM_GROUPS`
   の各エントリに `_zoidiumKey = <name>` を付けて重複検出するので、 自分のプリセットは
   別のファイル名 (例: `"my-twitch"`) で配置すれば並存できる。
