// HSL Noise (AlipFX) - Zoidium custom effect
// Source: HSL Noise (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/hsl-noise.glsl

(this.defaultName = "HSL Noise"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Adds HSL noise to the image with per-channel amount.",
  }),
  (this.shaderfile = "preset/hsl-noise"),
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
    Noise: { dynamic: !0, name: "Noise", type: PZ.property.type.OPTION, value: 0, items: "Uniform;Squared;Grain" },
    Hue: { dynamic: !0, name: "Hue", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Saturation: { dynamic: !0, name: "Saturation", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Lightness: { dynamic: !0, name: "Lightness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Grain_Size: { dynamic: !0, name: "Grain Size", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Noise_Phase: { dynamic: !0, name: "Noise Phase", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
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
        Noise: { type: "f", value: 0 },
        Hue: { type: "f", value: 0 },
        Saturation: { type: "f", value: 0 },
        Lightness: { type: "f", value: 0 },
        Grain_Size: { type: "f", value: 1 },
        Noise_Phase: { type: "f", value: 0 },
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
    u.Noise.value = this.properties.Noise.get(e);
    u.Hue.value = this.properties.Hue.get(e);
    u.Saturation.value = this.properties.Saturation.get(e);
    u.Lightness.value = this.properties.Lightness.get(e);
    u.Grain_Size.value = this.properties.Grain_Size.get(e);
    u.Noise_Phase.value = this.properties.Noise_Phase.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
