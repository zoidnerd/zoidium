// Channel Mixer (AlipFX) - Zoidium custom effect
// Source: Channel Mixer (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/channel-mixer.glsl

(this.defaultName = "Channel Mixer"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Mix RGB channels with custom weights per output.",
  }),
  (this.shaderfile = "preset/channel-mixer"),
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
    Red_Red: { dynamic: !0, name: "Red Red", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Red_Green: { dynamic: !0, name: "Red Green", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Red_Blue: { dynamic: !0, name: "Red Blue", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Red_Const: { dynamic: !0, name: "Red Const", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Green_Red: { dynamic: !0, name: "Green Red", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Green_Green: { dynamic: !0, name: "Green Green", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Green_Blue: { dynamic: !0, name: "Green Blue", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Green_Const: { dynamic: !0, name: "Green Const", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Blue_Red: { dynamic: !0, name: "Blue Red", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Blue_Green: { dynamic: !0, name: "Blue Green", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Blue_Blue: { dynamic: !0, name: "Blue Blue", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Monochrome: { dynamic: !0, name: "Monochrome", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Off;On" },
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
        Red_Red: { type: "f", value: 100 },
        Red_Green: { type: "f", value: 0 },
        Red_Blue: { type: "f", value: 0 },
        Red_Const: { type: "f", value: 0 },
        Green_Red: { type: "f", value: 0 },
        Green_Green: { type: "f", value: 100 },
        Green_Blue: { type: "f", value: 0 },
        Green_Const: { type: "f", value: 0 },
        Blue_Red: { type: "f", value: 0 },
        Blue_Green: { type: "f", value: 0 },
        Blue_Blue: { type: "f", value: 100 },
        Monochrome: { type: "f", value: 0 },
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
    u.Red_Red.value = this.properties.Red_Red.get(e);
    u.Red_Green.value = this.properties.Red_Green.get(e);
    u.Red_Blue.value = this.properties.Red_Blue.get(e);
    u.Red_Const.value = this.properties.Red_Const.get(e);
    u.Green_Red.value = this.properties.Green_Red.get(e);
    u.Green_Green.value = this.properties.Green_Green.get(e);
    u.Green_Blue.value = this.properties.Green_Blue.get(e);
    u.Green_Const.value = this.properties.Green_Const.get(e);
    u.Blue_Red.value = this.properties.Blue_Red.get(e);
    u.Blue_Green.value = this.properties.Blue_Green.get(e);
    u.Blue_Blue.value = this.properties.Blue_Blue.get(e);
    u.Monochrome.value = this.properties.Monochrome.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
