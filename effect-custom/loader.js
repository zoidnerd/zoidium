// Zoidium custom effect loader
// Add new effect filenames to ZOIDIUM_CUSTOM_EFFECTS below (without .js extension)
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
  "az-glass",
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
  "exposure",
  "fast-box-blur",
  "fill",
  "find-edges",
  "fractal-noise",
  "gammapedestalgain",
  "gaussian-blur",
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
  "radial-blur",
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
  "star-trail-motion",
  "stretch",
  "texgraph",
  "threshold",
  "tint",
  "transform",
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
function insertCustomEffectEntry(effects, entry) {
  const category = entry._zoidiumCategory;

  // De-dupe by type
  if (effects.find((e) => e.type === entry.type)) return;

  // Strip the internal field before pushing so Panzoid doesn't misread it
  const cleanEntry = {
    name: entry.name,
    desc: entry.desc,
    type: entry.type,
  };

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

// Move MISC's "Group" and "Shader" entries to the very bottom of the effect
// list. They are scaffolding-only Panzoid internals that don't render anything
// and are rarely useful in the picker, so we hide them at the end.
function reorderMiscEffectsToBottom() {
  const effects = PZ.ui.objectTypes.get(PZ.effect);
  const lastIndex = effects.length - 1;
  const moved = [];
  for (let i = effects.length - 1; i >= 0; i--) {
    const e = effects[i];
    if (e && (e.name === "Group" || e.name === "Shader")) {
      moved.unshift(e);
      effects.splice(i, 1);
    }
  }
  for (const e of moved) effects.push(e);
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
  // loadZoidiumCustomEffect is async (it fetches the .js), so we wait for all
  // of them to resolve before reordering — otherwise the new AlipFX category
  // would land below the moved Group/Shader entries.
  const loads = ZOIDIUM_CUSTOM_EFFECTS.map((name) =>
    loadZoidiumCustomEffect(name).catch((err) =>
      console.error(`[Zoidium] failed to load ${name}:`, err)
    )
  );
  Promise.all(loads).then(reorderMiscEffectsToBottom);
}

initZoidiumCustomEffects();
