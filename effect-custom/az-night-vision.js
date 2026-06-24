// AZ Night Vision (AlipFX) - Zoidium custom effect
// Source: Night Vision (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-night-vision.glsl

(this.defaultName = "AZ Night Vision"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Night-vision phosphor look with grain and glow.",
  }),
  (this.shaderfile = "preset/az-night-vision"),
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
    Phosphor: { dynamic: !0, name: "Phosphor", type: PZ.property.type.OPTION, value: 0, items: "Gen-3 Green;White Phosphor;Amber" },
    Gain: { dynamic: !0, name: "Gain", type: PZ.property.type.NUMBER, value: 0.1, step: 0.1 },
    Bloom: { dynamic: !0, name: "Bloom", type: PZ.property.type.NUMBER, value: 0.48, step: 0.1 },
    Sensor_Noise: { dynamic: !0, name: "Sensor Noise", type: PZ.property.type.NUMBER, value: 0.42, step: 0.1 },
    Scope_Overlay: { dynamic: !0, name: "Scope Overlay", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
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
        Phosphor: { type: "i", value: 0 },
        Gain: { type: "f", value: 0.1 },
        Bloom: { type: "f", value: 0.48 },
        Sensor_Noise: { type: "f", value: 0.42 },
        Scope_Overlay: { type: "f", value: 1 },
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
        u.Phosphor.value = Math.round(this.properties.Phosphor.get(e));
        u.Gain.value = this.properties.Gain.get(e);
        u.Bloom.value = this.properties.Bloom.get(e);
        u.Sensor_Noise.value = this.properties.Sensor_Noise.get(e);
        u.Scope_Overlay.value = this.properties.Scope_Overlay.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
