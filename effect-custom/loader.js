// Zoidium custom effect loader
// Add new effect filenames to ZOIDIUM_CUSTOM_EFFECTS below (without .js extension)
const ZOIDIUM_CUSTOM_EFFECTS = [
  "dropshadow",
  "sepia",
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

function initZoidiumCustomEffects() {
  if (typeof PZ === "undefined" || !PZ.effect || !PZ.ui || !PZ.ui.objectTypes) {
    return setTimeout(initZoidiumCustomEffects, 50);
  }
  for (const name of ZOIDIUM_CUSTOM_EFFECTS) {
    loadZoidiumCustomEffect(name).catch((err) =>
      console.error(`[Zoidium] failed to load ${name}:`, err)
    );
  }
}

initZoidiumCustomEffects();
