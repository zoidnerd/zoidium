// Gamma/Pedestal/Gain (AlipFX) - Zoidium custom effect
// Source: Gamma Pedestal Gain (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/gammapedestalgain.glsl

(this.defaultName = "Gamma Pedestal Gain"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Per-channel color grade: gamma, pedestal, gain.",
  }),
  (this.shaderfile = "preset/gammapedestalgain"),
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
    Black_Stretch: { dynamic: !0, name: "Black Stretch", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Red_Gamma: { dynamic: !0, name: "Red Gamma", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Red_Pedestal: { dynamic: !0, name: "Red Pedestal", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Red_Gain: { dynamic: !0, name: "Red Gain", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Green_Gamma: { dynamic: !0, name: "Green Gamma", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Green_Pedestal: { dynamic: !0, name: "Green Pedestal", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Green_Gain: { dynamic: !0, name: "Green Gain", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Blue_Gamma: { dynamic: !0, name: "Blue Gamma", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Blue_Pedestal: { dynamic: !0, name: "Blue Pedestal", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Blue_Gain: { dynamic: !0, name: "Blue Gain", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
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
        Black_Stretch: { type: "f", value: 1 },
        Red_Gamma: { type: "f", value: 1 },
        Red_Pedestal: { type: "f", value: 0 },
        Red_Gain: { type: "f", value: 1 },
        Green_Gamma: { type: "f", value: 1 },
        Green_Pedestal: { type: "f", value: 0 },
        Green_Gain: { type: "f", value: 1 },
        Blue_Gamma: { type: "f", value: 1 },
        Blue_Pedestal: { type: "f", value: 0 },
        Blue_Gain: { type: "f", value: 1 },
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
    u.Black_Stretch.value = this.properties.Black_Stretch.get(e);
    u.Red_Gamma.value = this.properties.Red_Gamma.get(e);
    u.Red_Pedestal.value = this.properties.Red_Pedestal.get(e);
    u.Red_Gain.value = this.properties.Red_Gain.get(e);
    u.Green_Gamma.value = this.properties.Green_Gamma.get(e);
    u.Green_Pedestal.value = this.properties.Green_Pedestal.get(e);
    u.Green_Gain.value = this.properties.Green_Gain.get(e);
    u.Blue_Gamma.value = this.properties.Blue_Gamma.get(e);
    u.Blue_Pedestal.value = this.properties.Blue_Pedestal.get(e);
    u.Blue_Gain.value = this.properties.Blue_Gain.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
