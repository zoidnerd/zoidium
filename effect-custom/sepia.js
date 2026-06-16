// GLSL-only sepia tone effect for Zoidium
// Demonstrates the "preset" pattern: a single GLSL file + a thin factory JS.
// Reference: assets/shaders/fragment/preset/sepia.glsl

(this.defaultName = "Sepia"),
  (this._zoidiumMeta = {
    category: "COLOR",
    desc: "Tints the image with a warm brown sepia tone.",
  }),
  (this.shaderfile = "preset/sepia"),
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
    strength: {
      dynamic: !0,
      name: "Strength",
      type: PZ.property.type.NUMBER,
      value: 1.0,
      min: 0,
      max: 1,
      step: 0.01,
    },
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
        strength: { type: "f", value: 1.0 },
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
    this.pass.uniforms.strength.value = this.properties.strength.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
