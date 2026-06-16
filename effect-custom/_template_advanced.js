// Template: advanced custom effect (GLSL + custom JS logic) for Zoidium
// Pick this if your effect needs more than a fragment shader:
//   - multiple render passes (e.g. blur + composite)
//   - extra WebGLRenderTargets / scenes / cameras
//   - shadowMask / feedback loops
// See dropshadow.js for a full example of this pattern.
//
// Usage:
//   1. Copy this file to effect-custom/<type>.js
//   2. Edit defaultName, shaderfile, propertyDefinitions
//   3. Add "<type>" to ZOIDIUM_CUSTOM_EFFECTS in loader.js
//   4. Create the shader at assets/shaders/fragment/<shaderfile>.glsl
//   5. Reload the browser

(this.defaultName = "My Advanced Effect"),
  // Optional metadata for the Effects panel. Remove or edit any of these.
  (this._zoidiumMeta = {
    category: "CUSTOM",
    desc: "One-line description shown in the picker.",
  }),
  (this.shaderfile = "fx_my_effect"),
  (this.shaderUrl = "/assets/shaders/fragment/" + this.shaderfile + ".glsl"),
  (this.vertShader = this.parentProject.assets.createFromPreset(
    PZ.asset.type.SHADER,
    "/assets/shaders/vertex/common.glsl"
  )),
  (this.fragShader = this.parentProject.assets.createFromPreset(
    PZ.asset.type.SHADER,
    this.shaderUrl
  )),
  (this.propertyDefinitions = {
    enabled: {
      dynamic: !0,
      name: "Enabled",
      type: PZ.property.type.OPTION,
      value: 1,
      items: "off;on",
    },
    // your custom properties
  }),
  this.properties.addAll(this.propertyDefinitions, this),
  (this.load = async function (e) {
    this.vertShader = new PZ.asset.shader(
      this.parentProject.assets.load(this.vertShader)
    );
    this.fragShader = new PZ.asset.shader(
      this.parentProject.assets.load(this.fragShader)
    );

    // Build any extra THREE objects you need here.
    // For multiple passes, build materials/render targets/scenes and store
    // them on `this`.

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { type: "t", value: null },
        uvScale: { type: "v2", value: new THREE.Vector2(1, 1) },
        resolution: { type: "v2", value: new THREE.Vector2(1, 1) },
      },
      vertexShader: await this.vertShader.getShader(),
      fragmentShader: await this.fragShader.getShader(),
    });

    this.pass = new THREE.ShaderPass(mat);
    this.properties.load(e && e.properties);
  }),
  (this.toJSON = function () {
    return { type: this.type, properties: this.properties };
  }),
  (this.unload = function () {
    this.parentProject.assets.unload(this.vertShader);
    this.parentProject.assets.unload(this.fragShader);
    // Dispose of any extra THREE resources you created in load().
  }),
  (this.update = function (e) {
    if (!this.pass) return;
    this.pass.enabled = this.properties.enabled.get(e) === 1;
    // apply property values to uniforms
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
    // If you keep extra render targets, resize them here.
  });
