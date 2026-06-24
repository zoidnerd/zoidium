// The Matrix (AlipFX) - Zoidium custom effect
// Source: The Matrix (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/the-matrix.glsl

(this.defaultName = "The Matrix"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Matrix-style digital rain effect.",
  }),
  (this.shaderfile = "preset/the-matrix"),
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
    enabled: { dynamic: !0, name: "Enabled", type: PZ.property.type.OPTION, value: 1, items: "off;on" },
    Time: { dynamic: !0, name: "Time", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Frequency: { dynamic: !0, name: "Frequency", type: PZ.property.type.NUMBER, value: 0.1, step: 0.1 },
    Alpha_mode: { dynamic: !0, name: "Alpha Mode", type: PZ.property.type.OPTION, value: 0, items: "Solid Background;Transparent Overlay" },
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
        Time: { type: "f", value: 0 },
        Frequency: { type: "f", value: 0.1 },
        Alpha_mode: { type: "i", value: 0 },
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
    this.pass.enabled = 1 === this.properties.enabled.get(e);
    const u = this.pass.uniforms;
        u.Time.value = this.properties.Time.get(e);
        u.Frequency.value = this.properties.Frequency.get(e);
        u.Alpha_mode.value = Math.round(this.properties.Alpha_mode.get(e));
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
