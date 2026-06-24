// Photocopy Scan Lines (AlipFX) - Zoidium custom effect
// Source: Photocopy Scan Lines (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/photocopy-scan-lines.glsl

(this.defaultName = "Photocopy Scan Lines"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Photocopier scan-line aesthetic with threshold and noise.",
  }),
  (this.shaderfile = "preset/photocopy-scan-lines"),
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
    Exposure: { dynamic: !0, name: "Exposure", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Contrast: { dynamic: !0, name: "Contrast", type: PZ.property.type.NUMBER, value: 1.5, step: 0.1 },
    Toner_Crush: { dynamic: !0, name: "Toner Crush", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Line_Strength: { dynamic: !0, name: "Line Strength", type: PZ.property.type.NUMBER, value: 0.1, step: 0.1 },
    Line_Density: { dynamic: !0, name: "Line Density", type: PZ.property.type.NUMBER, value: 10, step: 0.1 },
    Vertical_Streaks: { dynamic: !0, name: "Vertical Streaks", type: PZ.property.type.NUMBER, value: 0.6, step: 0.1 },
    Dust_Paper_Noise: { dynamic: !0, name: "Dust Paper Noise", type: PZ.property.type.NUMBER, value: 0.1, step: 0.1 },
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
        Exposure: { type: "f", value: 1 },
        Contrast: { type: "f", value: 1.5 },
        Toner_Crush: { type: "f", value: 0 },
        Line_Strength: { type: "f", value: 0.1 },
        Line_Density: { type: "f", value: 10 },
        Vertical_Streaks: { type: "f", value: 0.6 },
        Dust_Paper_Noise: { type: "f", value: 0.1 },
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
        u.Exposure.value = this.properties.Exposure.get(e);
        u.Contrast.value = this.properties.Contrast.get(e);
        u.Toner_Crush.value = this.properties.Toner_Crush.get(e);
        u.Line_Strength.value = this.properties.Line_Strength.get(e);
        u.Line_Density.value = this.properties.Line_Density.get(e);
        u.Vertical_Streaks.value = this.properties.Vertical_Streaks.get(e);
        u.Dust_Paper_Noise.value = this.properties.Dust_Paper_Noise.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
