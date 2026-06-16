// Template: GLSL-only custom effect for Zoidium
// Pick this if your effect can be expressed entirely as a fragment shader.
// Usage:
//   1. Copy this file to effect-custom/<type>.js   (e.g. sepia.js)
//   2. Edit defaultName, shaderfile, propertyDefinitions
//   3. Add "<type>" to ZOIDIUM_CUSTOM_EFFECTS in loader.js
//   4. Create the shader at assets/shaders/fragment/<shaderfile>.glsl
//   5. Reload the browser

(this.defaultName = "My Shader Effect"),
  // Optional metadata for the Effects panel. Remove or edit any of these.
  (this._zoidiumMeta = {
    category: "CUSTOM", // Panzoid category: "LAYER", "COLOR", "ENHANCE",
                          //   "DISTORT", "BLUR + SHARPEN", "FRAMING", "MISC"
                          //   or your own (e.g. "CUSTOM") to create a new group
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
    // Add your own number/color/enum properties here.
    // The names must match uniform names in your GLSL.
    // strength: {
    //   dynamic: !0,
    //   name: "Strength",
    //   type: PZ.property.type.NUMBER,
    //   value: 0.5,
    //   min: 0,
    //   max: 1,
    //   step: 0.01,
    // },
  }),
  this.properties.addAll(this.propertyDefinitions, this),
  (this.load = async function (e) {
    this.vertShader = new PZ.asset.shader(
      this.parentProject.assets.load(this.vertShader)
    );
    this.fragShader = new PZ.asset.shader(
      this.parentProject.assets.load(this.fragShader)
    );

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { type: "t", value: null },
        uvScale: { type: "v2", value: new THREE.Vector2(1, 1) },
        resolution: { type: "v2", value: new THREE.Vector2(1, 1) },
        // Mirror the dynamic properties you defined above.
        // strength: { type: "f", value: 0.5 },
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
  }),
  (this.update = function (e) {
    if (!this.pass) return;
    this.pass.enabled = 1 === this.properties.enabled.get(e);
    // this.pass.uniforms.strength.value = this.properties.strength.get(e);
  }),
  (this.resize = function () {
    let r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
