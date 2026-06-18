// Exposure (AlipFX) - Zoidium custom effect
// Source: Exposure (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/exposure.glsl

(this.defaultName = "AZ Exposure"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Applies exposure, offset, and gamma per channel or master.",
  }),
  (this.shaderfile = "preset/az-exposure"),
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
    Channels: { dynamic: !0, name: "Channels", type: PZ.property.type.OPTION, value: 0, items: "Master;Individual" },
    Exposure: { dynamic: !0, name: "Exposure", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Offset: { dynamic: !0, name: "Offset", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Gamma_Correction: { dynamic: !0, name: "Gamma Correction", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Red_Exposure: { dynamic: !0, name: "Red Exposure", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Red_Offset: { dynamic: !0, name: "Red Offset", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Red_Gamma_Correction: { dynamic: !0, name: "Red Gamma Correction", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Green_Exposure: { dynamic: !0, name: "Green Exposure", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Green_Offset: { dynamic: !0, name: "Green Offset", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Green_Gamma_Correction: { dynamic: !0, name: "Green Gamma Correction", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Blue_Exposure: { dynamic: !0, name: "Blue Exposure", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Blue_Offset: { dynamic: !0, name: "Blue Offset", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Blue_Gamma_Correction: { dynamic: !0, name: "Blue Gamma Correction", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Bypass_Linear_Light_Conversion: { dynamic: !0, name: "Bypass Linear Light Conversion", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
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
        Channels: { type: "f", value: 0 },
        Exposure: { type: "f", value: 0 },
        Offset: { type: "f", value: 0 },
        Gamma_Correction: { type: "f", value: 1 },
        Red_Exposure: { type: "f", value: 0 },
        Red_Offset: { type: "f", value: 0 },
        Red_Gamma_Correction: { type: "f", value: 1 },
        Green_Exposure: { type: "f", value: 0 },
        Green_Offset: { type: "f", value: 0 },
        Green_Gamma_Correction: { type: "f", value: 1 },
        Blue_Exposure: { type: "f", value: 0 },
        Blue_Offset: { type: "f", value: 0 },
        Blue_Gamma_Correction: { type: "f", value: 1 },
        Bypass_Linear_Light_Conversion: { type: "f", value: 0 },
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
    u.Channels.value = this.properties.Channels.get(e);
    u.Exposure.value = this.properties.Exposure.get(e);
    u.Offset.value = this.properties.Offset.get(e);
    u.Gamma_Correction.value = this.properties.Gamma_Correction.get(e);
    u.Red_Exposure.value = this.properties.Red_Exposure.get(e);
    u.Red_Offset.value = this.properties.Red_Offset.get(e);
    u.Red_Gamma_Correction.value = this.properties.Red_Gamma_Correction.get(e);
    u.Green_Exposure.value = this.properties.Green_Exposure.get(e);
    u.Green_Offset.value = this.properties.Green_Offset.get(e);
    u.Green_Gamma_Correction.value = this.properties.Green_Gamma_Correction.get(e);
    u.Blue_Exposure.value = this.properties.Blue_Exposure.get(e);
    u.Blue_Offset.value = this.properties.Blue_Offset.get(e);
    u.Blue_Gamma_Correction.value = this.properties.Blue_Gamma_Correction.get(e);
    u.Bypass_Linear_Light_Conversion.value = this.properties.Bypass_Linear_Light_Conversion.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
