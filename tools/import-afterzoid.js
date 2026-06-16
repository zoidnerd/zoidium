#!/usr/bin/env node
// Afterzoid Shader Pack 3 → Zoidium custom effect converter.
//
// Usage:
//   node tools/import-afterzoid.js file1.txt [file2.txt ...]
//   node tools/import-afterzoid.js --all
//
// Each input file is a Panzoid CM3 JSON dump (single line) that contains
//   { "fragShader": "<GLSL>", "customProperties": [...] }
// We extract the GLSL into assets/shaders/fragment/preset/<name>.glsl
// and emit a matching Panzoid effect factory at effect-custom/<type>.js.
//
// The script prints a JSON manifest of { name, type, shaderfile, source }
// to stdout (one per line) so the caller can aggregate and update loader.js.

"use strict";

const fs = require("fs");
const path = require("path");

const SOURCE_DIR = "/Users/dia/Downloads/Afterzoid Shader Pack 3";
const SHADER_OUT_DIR =
  "/Users/dia/Projects/GitHub/Zoidium/assets/shaders/fragment/preset";
const JS_OUT_DIR = "/Users/dia/Projects/GitHub/Zoidium/effect-custom";
const CATEGORY = "AlipFX";

// Uniform names that, when used in VECTOR2, should be linked (X scales with Y).
const SIZE_VEC2_RE =
  /(size|scale|multiplier|radius|thickness|width|amount|amounts|lengths?|depth)$/i;

function uniqueType(base, taken) {
  let t = base;
  let i = 2;
  while (taken.has(t)) t = `${base}-${i++}`;
  taken.add(t);
  return t;
}

function sanitizeType(raw) {
  // Original names look like "AZ Bubbles (AlipFX)" or "After Effects Mirror".
  // Strip "(AlipFX)" / "(FX)" etc., lowercase, hyphenate, drop punctuation.
  return raw
    .replace(/\s*\([^)]*\)\s*$/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

// Pretty name for the UI: slashes and underscores become spaces.
function prettyName(raw) {
  return raw.replace(/[/_]+/g, " ").replace(/\s+/g, " ").trim();
}

// Choose a slider step following AGENTS.md 5.6 conventions:
//   [0, 1]      → 0.1
//   [0, 100]    → 1  (AE-style percentage; "step: 0.1" is impractical)
//   [0, 255]    → 1  (RGB/threshold byte range)
//   [0, 360]    → 1  (degrees; one-degree increments are standard)
//   any [a, b]  → max(1, round((b-a) / 100))  for large integer ranges
//   unknown     → 0.1
function pickStep(min, max, isInt) {
  if (isInt) return 1;
  if (min === 0 && max === 1) return 0.1;
  if (min === 0 && max === 100) return 1;
  if (min === 0 && max === 255) return 1;
  if (min === 0 && max === 360) return 1;
  if (max > 0) {
    const range = max - min;
    if (range >= 50) return 1;
  }
  return 0.1;
}

function cleanGLSL(src) {
  // Drop /* ... */ block comments and // line comments, collapse whitespace.
  let out = src.replace(/\/\*[\s\S]*?\*\//g, " ");
  out = out.replace(/\/\/[^\n]*/g, " ");
  out = out.replace(/\s+/g, " ").trim();
  return out;
}

// Parse a single uniform declaration line and return { name, glslType, enumItems }.
// Examples matched: `uniform float Foo;` `uniform vec2 Bar;` `uniform int Baz;`
// If the declaration is followed by a `// 0 Alpha, 1 Beta, ...` comment, we also
// extract those as enumItems (the keys are numeric, the values are trimmed labels).
function parseUniform(decl) {
  // Match `uniform <type> <name>;` plus an optional enum comment on the same line.
  const m = decl.match(
    /uniform\s+(float|int|vec2|vec3|vec4|sampler2D|bool|mat2|mat3|mat4)\s+([A-Za-z_][A-Za-z0-9_]*)\s*;\s*(?:\/\/\s*(.*))?$/
  );
  if (!m) return null;
  const glslType = m[1];
  const name = m[2];
  const comment = (m[3] || "").trim();
  let enumItems = null;
  if (comment) {
    // Enum pattern: "0 Label, 1 Label2, 2 Label3"  (label may include spaces)
    const parts = comment.split(/\s*,\s*/);
    const items = [];
    let allNumbered = true;
    for (const p of parts) {
      const mm = p.match(/^(\d+)\s*[=:]\s*(.+)$/);
      if (!mm) {
        allNumbered = false;
        break;
      }
      items.push(mm[2].trim());
    }
    if (allNumbered && items.length >= 2) enumItems = items;
  }
  return { glslType, name, enumItems };
}

// Extract a uniform map { Name -> { glslType, enumItems } } from a GLSL source.
// Handles both newline-delimited and semicolon-with-inline-comment declarations.
function extractUniforms(glsl) {
  const map = {};
  // First handle the common case: `uniform T N;` possibly followed by an inline
  // // comment on the same physical line.
  const re = /uniform\s+(float|int|vec2|vec3|vec4|sampler2D|bool|mat2|mat3|mat4)\s+([A-Za-z_][A-Za-z0-9_]*)\s*;([^\n]*)/g;
  let m;
  while ((m = re.exec(glsl)) !== null) {
    const glslType = m[1];
    const name = m[2];
    const rest = m[3].trim();
    let enumItems = null;
    if (rest.startsWith("//")) {
      const comment = rest.slice(2).trim();
      const parts = comment.split(/\s*,\s*/);
      const items = [];
      let allNumbered = true;
      for (const p of parts) {
        const mm = p.match(/^(\d+)\s*[=:]\s*(.+)$/);
        if (!mm) {
          allNumbered = false;
          break;
        }
        items.push(mm[2].trim());
      }
      if (allNumbered && items.length >= 2) enumItems = items;
    }
    map[name] = { glslType, name, enumItems };
  }
  return map;
}

// Map Panzoid property type to a JS uniform value expression for ShaderMaterial.
function jsUniformInitializer(propMeta) {
  if (propMeta.kind === "color")
    return `new THREE.Vector3(${propMeta.default[0]}, ${propMeta.default[1]}, ${propMeta.default[2]})`;
  if (propMeta.kind === "vec2")
    return `new THREE.Vector2(${propMeta.default[0]}, ${propMeta.default[1]})`;
  return String(propMeta.default);
}

function jsUniformTypeFor(propMeta) {
  if (propMeta.kind === "color" || propMeta.kind === "vec3") return "v3";
  if (propMeta.kind === "vec2") return "v2";
  if (propMeta.glslType === "int") return "i";
  return "f";
}

function jsUniformValueExpr(propMeta) {
  // Code that updates this.pass.uniforms.<name>.value from this.properties.<name>.
  const get = `this.properties.${propMeta.name}.get(e)`;
  if (propMeta.kind === "color" || propMeta.kind === "vec3") {
    return `u.${propMeta.name}.value.set(${get}[0]||0, ${get}[1]||0, ${get}[2]||0);`;
  }
  if (propMeta.kind === "vec2") {
    return `const _${propMeta.name} = ${get}; u.${propMeta.name}.value.set(_${propMeta.name}[0]||0, _${propMeta.name}[1]||0);`;
  }
  if (propMeta.glslType === "int" || propMeta.intLike) {
    return `u.${propMeta.name}.value = Math.round(${get});`;
  }
  return `u.${propMeta.name}.value = ${get};`;
}

function buildProperty(propEntry, uniformInfo) {
  // Afterzoid customProperties entries come in two shapes:
  //   { properties: {name}, type: { type: 0, ... }, keyframes: [...] }
  //   { properties: {name}, type: { type: 1|4, group: true, objects: [...] }, keyframes: [...] (for groups, each obj has its own) }
  const typeObj = propEntry.type || {};
  const t = typeObj.type;
  const name = propEntry.properties.name;
  const u = uniformInfo[name];

  // The Afterzoid tool occasionally encodes stray GLSL comments as bogus
  // customProperties (e.g. a // comment about the effect gets split into
  // type-4 color entries like "works on composite"). Skip anything that
  // is not a valid GLSL identifier — spaces, periods, and other
  // punctuation are never real uniform names.
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) return null;

  // Also drop entries that don't actually map to a uniform declared in
  // the GLSL — that catches most other "comment-as-property" accidents.
  if (!u) return null;

  const min0 = typeObj.min;
  const max0 = typeObj.max;
  if (
    (t === 1 || t === 4) &&
    typeObj.group &&
    Array.isArray(typeObj.objects)
  ) {
    const isVec2 = typeObj.objects.length === 2;
    const isColor = t === 4 || typeObj.objects.length === 3;
    if (isVec2) {
      const linkRatio = SIZE_VEC2_RE.test(name) ? "true" : "false";
      const x = typeObj.objects[0];
      const y = typeObj.objects[1];
      const xMin = x.min != null ? x.min : null;
      const yMin = y.min != null ? y.min : null;
      const xMax = x.max != null ? x.max : null;
      const yMax = y.max != null ? y.max : null;
      return {
        kind: "vec2",
        name,
        glslType: "vec2",
        display: prettyName(name),
        default: typeObj.objects.map((o) =>
          o.keyframes && o.keyframes[0] ? o.keyframes[0].value : 0
        ),
        linkRatio,
        xMin,
        yMin,
        xMax,
        yMax,
        intLike: false,
      };
    }
    if (isColor) {
      const objs = typeObj.objects;
      const isUnitRange = objs.every((o) => o.min === 0 && o.max === 1);
      return {
        kind: "color",
        name,
        glslType: "vec3",
        display: "Color",
        default: objs.map((o) =>
          o.keyframes && o.keyframes[0] ? o.keyframes[0].value : 0
        ),
        step: isUnitRange ? 0.1 : 1,
        intLike: false,
      };
    }
  }
  if (t === 0) {
    const val =
      propEntry.keyframes && propEntry.keyframes[0]
        ? propEntry.keyframes[0].value
        : 0;
    const min = min0 != null ? min0 : null;
    const max = max0 != null ? max0 : null;
    const isInt = u ? u.glslType === "int" : false;
    const step = pickStep(min == null ? 0 : min, max == null ? 0 : max, isInt);
    const enumItems = u && u.enumItems;
    return {
      kind: enumItems ? "option" : "number",
      name,
      glslType: u ? u.glslType : "float",
      display: prettyName(name),
      default: val,
      min,
      max,
      step,
      intLike: isInt,
      enumItems,
    };
  }
  return null;
}

function processFile(filepath, takenTypes) {
  const raw = fs.readFileSync(filepath, "utf-8");
  const data = JSON.parse(raw);
  const entry = data[0].data[0];
  const displayName = entry.properties.name;
  const fragShader = entry.properties.fragShader;
  const customProperties = entry.customProperties || [];

  // Sanitize and dedupe type identifier
  const baseType = sanitizeType(displayName);
  const type = uniqueType(baseType, takenTypes);

  // Extract uniform types and enum items from the original GLSL
  // (which still has comments describing each uniform's allowed values).
  const uniformInfo = extractUniforms(fragShader);

  // Clean GLSL and write to preset/
  const glsl = cleanGLSL(fragShader);
  const shaderFile = `${type}.glsl`;
  const shaderPath = path.join(SHADER_OUT_DIR, shaderFile);
  fs.writeFileSync(shaderPath, glsl + "\n");

  // Build property definitions
  const propDefs = [];
  propDefs.push({
    kind: "enabled",
    name: "enabled",
    display: "Enabled",
    glslType: "OPTION",
    default: 1,
  });
  const seenUniforms = new Set();
  const uniforms = [];

  for (const cp of customProperties) {
    const prop = buildProperty(cp, uniformInfo);
    if (!prop) continue;
    propDefs.push(prop);
    seenUniforms.add(prop.name);
    uniforms.push(prop);
  }

  // Render propertyDefinitions object literal
  const propLines = propDefs.map((p) => {
    if (p.kind === "enabled") {
      return `    enabled: { dynamic: !0, name: "Enabled", type: PZ.property.type.OPTION, value: 1, items: "off;on" },`;
    }
    if (p.kind === "vec2") {
      const x = p.default[0];
      const y = p.default[1];
      const minParts = [];
      if (p.xMin != null) minParts.push(`min: [${p.xMin}, ${p.yMin != null ? p.yMin : p.xMin}]`);
      if (p.xMax != null) minParts.push(`max: [${p.xMax}, ${p.yMax != null ? p.yMax : p.xMax}]`);
      const bounds = minParts.length ? ", " + minParts.join(", ") : "";
      return (
        `    ${p.name}: { dynamic: !0, name: "${p.display}", ` +
        `type: PZ.property.type.VECTOR2, value: [${x}, ${y}], ` +
        `linkRatio: ${p.linkRatio}${bounds} },`
      );
    }
    if (p.kind === "color") {
      const [r, g, b] = p.default;
      return (
        `    ${p.name}: { dynamic: !0, name: "${p.display}", ` +
        `type: PZ.property.type.COLOR, value: [${r}, ${g}, ${b}] },`
      );
    }
    if (p.kind === "option") {
      const itemsStr = p.enumItems.join(";");
      return (
        `    ${p.name}: { dynamic: !0, name: "${p.display}", ` +
        `type: PZ.property.type.OPTION, value: ${p.default}, items: "${itemsStr}" },`
      );
    }
    // number
    const bounds = [];
    if (p.min != null) bounds.push(`min: ${p.min}`);
    if (p.max != null) bounds.push(`max: ${p.max}`);
    const boundsStr = bounds.length ? ", " + bounds.join(", ") : "";
    return (
      `    ${p.name}: { dynamic: !0, name: "${p.display}", ` +
      `type: PZ.property.type.NUMBER, value: ${p.default}, step: ${p.step}${boundsStr} },`
    );
  });

  // Render ShaderMaterial uniforms object
  const uniformLines = [];
  uniformLines.push(`        tDiffuse: { type: "t", value: null },`);
  uniformLines.push(
    `        uvScale: { type: "v2", value: new THREE.Vector2(1, 1) },`
  );
  uniformLines.push(
    `        resolution: { type: "v2", value: new THREE.Vector2(1, 1) },`
  );
  for (const u of uniforms) {
    uniformLines.push(
      `        ${u.name}: { type: "${jsUniformTypeFor(u)}", value: ${jsUniformInitializer(u)} },`
    );
  }

  // Render update() body
  const updateLines = [];
  updateLines.push(
    `    this.pass.enabled = 1 === this.properties.enabled.get(e);`
  );
  updateLines.push(`    const u = this.pass.uniforms;`);
  for (const u of uniforms) {
    updateLines.push(`    ${jsUniformValueExpr(u)}`);
  }

  // Build .js factory content
  const prettyDisplay = prettyName(displayName);
  const js = [
    `// ${displayName} (AlipFX) - Zoidium custom effect`,
    `// Source: ${path.basename(filepath)}`,
    `// Reference shader: assets/shaders/fragment/preset/${shaderFile}`,
    ``,
    `(this.defaultName = "${prettyDisplay}"),`,
    `  (this._zoidiumMeta = {`,
    `    category: "${CATEGORY}",`,
    `    desc: "TODO: write a one-line description for ${prettyDisplay}.",`,
    `  }),`,
    `  (this.shaderfile = "preset/${type}"),`,
    `  (this.shaderUrl = "/assets/shaders/fragment/" + this.shaderfile + ".glsl"),`,
    `  (this.vertShader = this.parentProject.assets.createFromPreset(`,
    `    PZ.asset.type.SHADER,`,
    `    "/assets/shaders/vertex/common.glsl"`,
    `  )),`,
    `  (this.fragShader = this.parentProject.assets.createFromPreset(`,
    `    PZ.asset.type.SHADER,`,
    `    this.shaderUrl`,
    `  )),`,
    `  (this.propertyDefinitions = {`,
    ...propLines,
    `  }),`,
    `  this.properties.addAll(this.propertyDefinitions, this),`,
    `  (this.load = async function (e) {`,
    `    this.vertShader = new PZ.asset.shader(`,
    `      this.parentProject.assets.load(this.vertShader)`,
    `    );`,
    `    this.fragShader = new PZ.asset.shader(`,
    `      this.parentProject.assets.load(this.fragShader)`,
    `    );`,
    ``,
    `    const mat = new THREE.ShaderMaterial({`,
    `      uniforms: {`,
    ...uniformLines,
    `      },`,
    `      vertexShader: await this.vertShader.getShader(),`,
    `      fragmentShader: await this.fragShader.getShader(),`,
    `    });`,
    ``,
    `    this.pass = new THREE.ShaderPass(mat);`,
    `    this.properties.load(e && e.properties);`,
    `  }),`,
    `  (this.toJSON = function () {`,
    `    return { type: this.type, properties: this.properties };`,
    `  }),`,
    `  (this.unload = function () {`,
    `    this.parentProject.assets.unload(this.vertShader);`,
    `    this.parentProject.assets.unload(this.fragShader);`,
    `  }),`,
    `  (this.update = function (e) {`,
    ...updateLines,
    `  }),`,
    `  (this.resize = function () {`,
    `    const r = this.parentLayer.properties.resolution.get();`,
    `    this.pass.uniforms.resolution.value.set(r[0], r[1]);`,
    `  });`,
    ``,
  ].join("\n");

  const jsPath = path.join(JS_OUT_DIR, `${type}.js`);
  fs.writeFileSync(jsPath, js);

  return {
    name: displayName,
    type,
    shaderfile: `preset/${type}`,
    source: path.basename(filepath),
  };
}

function main() {
  const args = process.argv.slice(2);
  let inputs = [];
  if (args.includes("--all")) {
    inputs = fs
      .readdirSync(SOURCE_DIR)
      .filter((f) => f.endsWith(".txt") && f !== "desktop.ini")
      .map((f) => path.join(SOURCE_DIR, f));
  } else {
    inputs = args;
  }
  if (!inputs.length) {
    console.error("Usage: node tools/import-afterzoid.js file1.txt ...");
    process.exit(1);
  }

  fs.mkdirSync(SHADER_OUT_DIR, { recursive: true });
  fs.mkdirSync(JS_OUT_DIR, { recursive: true });

  const taken = new Set();
  const manifest = [];
  const errors = [];
  for (const f of inputs) {
    try {
      const r = processFile(f, taken);
      manifest.push(r);
    } catch (err) {
      errors.push({ file: f, error: err.message });
    }
  }
  for (const m of manifest) {
    console.log(JSON.stringify(m));
  }
  for (const e of errors) {
    console.error(`ERROR ${e.file}: ${e.error}`);
  }
  console.error(
    `\n[import-afterzoid] processed ${manifest.length}/${inputs.length}` +
      (errors.length ? `, ${errors.length} failed` : "")
  );
}

if (require.main === module) main();
