// Zoidium custom effect loader
// Add new effect filenames to ZOIDIUM_CUSTOM_EFFECTS below (without .js extension)
//
// Two kinds of custom effects are supported:
//   ZOIDIUM_CUSTOM_EFFECTS  — single-effect factories (shader or JS logic).
//                             File: effect-custom/<name>.js
//   ZOIDIUM_CUSTOM_GROUPS   — Group presets (a bundle of sub-effects wired
//                             together with customProperties + expressions,
//                             like the stock Panzoid "Twitch" effect).
//                             File: effect-custom/groups/<name>.json
const ZOIDIUM_CUSTOM_EFFECTS = [
  "dropshadow",
  "sepia",
  "polygonecho",
  "4-color-gradient",
  "8bit-pixcam",
  "a_bayangan",
  "a_glossy",
  "a_halfdots",
  "a_innergradation",
  "a_outline",
  "a_wiggle",
  "after-effects-mirror",
  "az-bend-it",
  "az-bender",
  "az-blobbylize",
  "az-block-load",
  "az-bubbles",
  "az-burn-film",
  "az-cross-blur",
  "az-cylinder",
  "az-drizzle",
  "az-exposure",
  "az-glass",
  "az-gaussian-blur",
  "az-grid-wipe",
  "az-griddler",
  "az-hextile",
  "az-jaws",
  "az-kaleida",
  "az-lens",
  "az-light-burst-25",
  "az-light-rays",
  "az-light-sweep",
  "az-light-wipe",
  "az-line-sweep",
  "az-plastic",
  "az-radial-blur",
  "az-radial-blur-2",
  "az-radial-fast-blur",
  "az-radial-scalewipe",
  "az-rainfall",
  "az-scale-wipe",
  "az-scatterize",
  "az-slant",
  "az-snowfall",
  "az-split",
  "az-split-2",
  "az-threads",
  "az-threshold",
  "az-threshold-rgb",
  "az-tiler",
  "az-toner",
  "az-transform",
  "az-vector-blur",
  "bcc-ripple-dissolve",
  "bevel-alpha",
  "block-dissolve",
  "brush-strokes",
  "cartoon",
  "change-color",
  "change-to-color",
  "channel-mixer",
  "checkerboard",
  "chromabba",
  "circle",
  "color-balance",
  "color-balance-2",
  "colorama",
  "colorvsn",
  "corner-pin",
  "curves",
  "drop-shadow",
  "echo",
  "echo-2",
  "ellipse",
  "fast-box-blur",
  "fill",
  "find-edges",
  "fractal-noise",
  "gammapedestalgain",
  "glow",
  "gradient-ramp",
  "grid",
  "hsl-noise",
  "hsl-noise-auto",
  "hydrochrome",
  "impact-lines",
  "invert",
  "iris-wipe",
  "iris-wipe-2",
  "leave-color",
  "lens-flare",
  "levels",
  "levels-2",
  "linear-wipe",
  "lumetri-color",
  "mangatone",
  "median",
  "minimax",
  "minimax-2",
  "mosaic",
  "motion-tile",
  "mts-pixelsorter",
  "multislicer",
  "nesprite",
  "nisai-stroke",
  "noise",
  "optics-compensation",
  "progradient",
  "radial-wipe",
  "ripple",
  "s_edgecolorize",
  "s_glint",
  "s_glow",
  "s_halftone",
  "s_kaleido",
  "s_kaleidopolar",
  "s_kaleidoradial",
  "s_shake",
  "s_shape",
  "s_wipeblobs",
  "s_wipecells",
  "s_wipedoublewedge",
  "s_wipefourwedges",
  "s_wipemoire",
  "s_wipepixelate",
  "s_wipeplasma",
  "s_wipetiles",
  "s_wipeweave",
  "scl_film-strip",
  "simple-choker",
  "smooth-bevel",
  "star-trail-motion",
  "stretch",
  "texgraph",
  "threshold",
  "tint",
  "tritone",
  "turbulent-displace",
  "turbulent-noise",
  "twirl",
  "unmult",
  "unsharp-mask",
  "venetian-blinds",
  "warp",
  "wave-warp",
];

// Group preset loader list. Add JSON filenames here (without .json extension).
// The file lives at effect-custom/groups/<name>.json and contains the preset
// payload that gets passed to PZ.effect.group.load().
//
// A preset JSON has the shape:
//
//   {
//     "name": "Twitch",                  // display name in the picker
//     "desc": "...",                     // hover tooltip
//     "category": "DISTORT",             // picker category (existing or new)
//     "type": 0,                         // MUST be 0 (PZ.effect.group)
//     "properties": {                    // instance-level defaults
//       "name": "Twitch (beta v1)",
//       "enabled": { "animated": false, "keyframes": [{"value": 1, "frame": 0, "tween": 1}] }
//     },
//     "customProperties": [ ... ],       // user-facing dials (Amount, Speed, ...)
//     "objects": [ ... ]                 // sub-effects wired with expressions
//   }
//
// The top-level `name` / `desc` / `category` are read by the loader; everything
// else is forwarded verbatim as `data` to PZ.effect.group.load().
const ZOIDIUM_CUSTOM_GROUPS = [
  "chevron-sync",
  "sync",
];

// Extract metadata from the factory source without executing side-effectful code.
// Custom effect files can declare a `_zoidiumMeta` object that drives category/desc:
//
//   this._zoidiumMeta = {
//     category: "COLOR",          // group header under which to insert
//     desc: "Convert to sepia tone." // hover/tooltip text in the picker
//   };
//
// We also fall back to grabbing the first string assigned to this.defaultName
// so legacy factories keep working.
function extractMeta(code) {
  const meta = { defaultName: null, category: null, desc: null };
  const nameM = code.match(/this\.defaultName\s*=\s*["']([^"']+)["']/);
  if (nameM) meta.defaultName = nameM[1];

  // Match a single _zoidiumMeta = { ... } block, tolerant of inner braces
  const metaStart = code.indexOf("this._zoidiumMeta");
  if (metaStart >= 0) {
    const braceStart = code.indexOf("{", metaStart);
    if (braceStart >= 0) {
      let depth = 0;
      let end = -1;
      for (let i = braceStart; i < code.length; i++) {
        const c = code[i];
        if (c === "{") depth++;
        else if (c === "}") {
          depth--;
          if (depth === 0) {
            end = i;
            break;
          }
        }
      }
      if (end > braceStart) {
        const block = code.slice(braceStart, end + 1);
        const catM = block.match(/category\s*:\s*["']([^"']+)["']/);
        if (catM) meta.category = catM[1];
        const descM = block.match(/desc\s*:\s*["']([^"']+)["']/);
        if (descM) meta.desc = descM[1];
      }
    }
  }
  return meta;
}

// Insert a custom effect entry into the Panzoid effect list, creating a category
// header if the requested category doesn't already exist. Categories with the
// same name are reused so multiple custom effects group together.
//
// Panzoid's effect list schema:
//   - Category header: { name: "COLOR", category: true }
//   - Effect entry:    { name: "Sepia", desc: "...", type: "sepia" }
//   - Group preset:    { name: "Twitch", desc: "...", type: 0, data: {...} }
//
// De-dup strategy:
//   - Shader/JS effects: by `type` (the unique filename string)
//   - Group presets: by `_zoidiumKey` (the JSON filename), since multiple
//     group presets all share `type: 0` and would otherwise collide
function insertCustomEffectEntry(effects, entry) {
  const category = entry._zoidiumCategory;

  // De-dupe: group presets carry `_zoidiumKey`; factory effects fall back to type
  if (entry._zoidiumKey) {
    if (effects.find((e) => e._zoidiumKey === entry._zoidiumKey)) return;
  } else {
    if (effects.find((e) => e.type === entry.type)) return;
  }

  // Strip internal fields before pushing. Group presets need `data` preserved
  // because the picker reads entry.data and passes it to PZ.effect.group.load().
  const cleanEntry = {
    name: entry.name,
    desc: entry.desc,
    type: entry.type,
  };
  if (entry.data !== undefined) cleanEntry.data = entry.data;
  if (entry._zoidiumKey) cleanEntry._zoidiumKey = entry._zoidiumKey;

  if (!category) {
    effects.push(cleanEntry);
    return;
  }

  const existingHeaderIdx = effects.findIndex(
    (e) => e.category === true && e.name === category
  );

  if (existingHeaderIdx >= 0) {
    // Find the last entry in this category (next header or end of list)
    let insertAt = existingHeaderIdx + 1;
    while (
      insertAt < effects.length &&
      !(effects[insertAt].category === true)
    ) {
      insertAt++;
    }
    effects.splice(insertAt, 0, cleanEntry);
  } else {
    // New category: append header at the end, then the entry right after it
    effects.push({ name: category, category: true });
    effects.push(cleanEntry);
  }
}

async function loadZoidiumCustomEffect(name) {
  // 1. Fetch the effect factory source
  const code = await fetch(`./effect-custom/${name}.js`).then((r) => r.text());

  // 2. Parse metadata without running side-effectful code
  const meta = extractMeta(code);
  const displayName = meta.defaultName || name;
  const desc = meta.desc || "Custom effect (Zoidium)";

  // 3. Register the factory so Panzoid can create instances with proper parent context
  PZ.effect.fnList[name] = Promise.resolve(function () {
    // `this` is the initialized PZ.effect instance with parentProject set
    new Function(code).call(this);
  });

  // 4. Register the UI entry under the requested category.
  // NOTE: Panzoid treats any truthy `category` field as a header, so we
  // intentionally do NOT set `category` on the entry itself; we only use
  // the requested category to choose the insertion position.
  const effects = PZ.ui.objectTypes.get(PZ.effect);
  insertCustomEffectEntry(effects, {
    name: displayName,
    desc,
    type: name,
    _zoidiumCategory: meta.category,
  });

  console.log(
    `[Zoidium] loaded custom effect: ${displayName} (${name})` +
      (meta.category ? ` [${meta.category}]` : "")
  );
}

// Load a Group preset (a PZ.effect.group with predefined customProperties +
// sub-effects, like the stock Panzoid "Twitch"). The JSON file lives at
// effect-custom/groups/<name>.json and is consumed as-is by Panzoid's
// built-in Group class via its `load(data)` method — no factory needed.
async function loadZoidiumCustomGroup(name) {
  // 1. Fetch and parse the preset JSON
  const url = `./effect-custom/groups/${name}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  const preset = await res.json();

  // 2. Validate the minimum required shape
  if (preset.type !== 0) {
    throw new Error(
      `Group preset "${name}" must have "type": 0 (PZ.effect.group), got ${preset.type}`
    );
  }
  if (!preset.name) {
    throw new Error(`Group preset "${name}" is missing required "name" field`);
  }
  if (!Array.isArray(preset.objects)) {
    throw new Error(
      `Group preset "${name}" is missing required "objects" array`
    );
  }

  // 3. Pull display metadata out of the JSON before forwarding the rest to Panzoid.
  //    Anything not in {name, desc, category} is treated as the Group `data` payload.
  const displayName = preset.name;
  const desc = preset.desc || "Custom group preset (Zoidium)";
  const category = preset.category || null;
  const { name: _n, desc: _d, category: _c, ...data } = preset;

  // 4. Register the UI entry. The picker reads `entry.data` and passes it to
  //    PZ.effect.group.load(), which consumes `properties`, `customProperties`,
  //    and `objects` to populate the Group instance.
  const effects = PZ.ui.objectTypes.get(PZ.effect);
  insertCustomEffectEntry(effects, {
    name: displayName,
    desc,
    type: 0,
    data,
    _zoidiumCategory: category,
    _zoidiumKey: name,
  });

  console.log(
    `[Zoidium] loaded custom group preset: ${displayName} (${name})` +
      (category ? ` [${category}]` : "")
  );
}

// Move the entire MISC section (category header + Group + Shader entries)
// to the very bottom of the effect list. Panzoid ships MISC last by default,
// but custom categories inserted after initTool() land after it — leaving
// the MISC header orphaned mid-list with Group/Shader pulled to the very
// end. Relocating the whole section keeps them visually grouped at the
// bottom of the picker.
function reorderMiscEffectsToBottom() {
  const effects = PZ.ui.objectTypes.get(PZ.effect);
  const miscIdx = effects.findIndex(
    (e) => e && e.category === true && e.name === "MISC"
  );
  if (miscIdx < 0) return;

  let endIdx = effects.length;
  for (let i = miscIdx + 1; i < effects.length; i++) {
    if (effects[i] && effects[i].category === true) {
      endIdx = i;
      break;
    }
  }

  const moved = effects.splice(miscIdx, endIdx - miscIdx);
  effects.push(...moved);
  if (moved.length) {
    console.log(
      `[Zoidium] moved ${moved.length} MISC scaffolding entries to the bottom`
    );
  }
}

function initZoidiumCustomEffects() {
  if (typeof PZ === "undefined" || !PZ.effect || !PZ.ui || !PZ.ui.objectTypes) {
    return setTimeout(initZoidiumCustomEffects, 50);
  }
  // Both loaders are async (they fetch files), so we wait for all of them
  // to resolve before reordering — otherwise new categories would land below
  // the moved Group/Shader entries.
  const effectLoads = ZOIDIUM_CUSTOM_EFFECTS.map((name) =>
    loadZoidiumCustomEffect(name).catch((err) =>
      console.error(`[Zoidium] failed to load effect ${name}:`, err)
    )
  );
  const groupLoads = ZOIDIUM_CUSTOM_GROUPS.map((name) =>
    loadZoidiumCustomGroup(name).catch((err) =>
      console.error(`[Zoidium] failed to load group preset ${name}:`, err)
    )
  );
  Promise.all([...effectLoads, ...groupLoads]).then(
    reorderMiscEffectsToBottom
  );
}

initZoidiumCustomEffects();
