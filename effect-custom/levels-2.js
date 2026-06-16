// Levels (Individual Controls) (AlipFX) - Zoidium custom effect
// Source: Levels (Individual Controls) (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/levels-2.glsl

(this.defaultName = "Levels (Individual Controls)"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Per-channel levels with individual RGB and alpha.",
  }),
  (this.shaderfile = "preset/levels-2"),
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
    Channel: { dynamic: !0, name: "Channel", type: PZ.property.type.OPTION, value: 0, items: "RGB;R;G;B;Alpha", step: 1 },
    RGB_Input_Black: { dynamic: !0, name: "RGB Input Black", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    RGB_Input_White: { dynamic: !0, name: "RGB Input White", type: PZ.property.type.NUMBER, value: 255, step: 0.1 },
    RGB_Gamma: { dynamic: !0, name: "RGB Gamma", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    RGB_Output_Black: { dynamic: !0, name: "RGB Output Black", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    RGB_Output_White: { dynamic: !0, name: "RGB Output White", type: PZ.property.type.NUMBER, value: 255, step: 0.1 },
    Red_Input_Black: { dynamic: !0, name: "Red Input Black", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Red_Input_White: { dynamic: !0, name: "Red Input White", type: PZ.property.type.NUMBER, value: 255, step: 0.1 },
    Red_Gamma: { dynamic: !0, name: "Red Gamma", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Red_Output_Black: { dynamic: !0, name: "Red Output Black", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Red_Output_White: { dynamic: !0, name: "Red Output White", type: PZ.property.type.NUMBER, value: 255, step: 0.1 },
    Green_Input_Black: { dynamic: !0, name: "Green Input Black", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Green_Input_White: { dynamic: !0, name: "Green Input White", type: PZ.property.type.NUMBER, value: 255, step: 0.1 },
    Green_Gamma: { dynamic: !0, name: "Green Gamma", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Green_Output_Black: { dynamic: !0, name: "Green Output Black", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Green_Output_White: { dynamic: !0, name: "Green Output White", type: PZ.property.type.NUMBER, value: 255, step: 0.1 },
    Blue_Input_Black: { dynamic: !0, name: "Blue Input Black", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Blue_Input_White: { dynamic: !0, name: "Blue Input White", type: PZ.property.type.NUMBER, value: 255, step: 0.1 },
    Blue_Gamma: { dynamic: !0, name: "Blue Gamma", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Blue_Output_Black: { dynamic: !0, name: "Blue Output Black", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Blue_Output_White: { dynamic: !0, name: "Blue Output White", type: PZ.property.type.NUMBER, value: 255, step: 0.1 },
    Alpha_Input_Black: { dynamic: !0, name: "Alpha Input Black", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Alpha_Input_White: { dynamic: !0, name: "Alpha Input White", type: PZ.property.type.NUMBER, value: 255, step: 0.1 },
    Alpha_Gamma: { dynamic: !0, name: "Alpha Gamma", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Alpha_Output_Black: { dynamic: !0, name: "Alpha Output Black", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Alpha_Output_White: { dynamic: !0, name: "Alpha Output White", type: PZ.property.type.NUMBER, value: 255, step: 0.1 },
    Clip_To_Output_Black: { dynamic: !0, name: "Clip To Output Black", type: PZ.property.type.OPTION, value: 2, items: "On;Off;Off for 32bpc", step: 1 },
    Clip_To_Output_White: { dynamic: !0, name: "Clip To Output White", type: PZ.property.type.OPTION, value: 2, items: "On;Off;Off for 32bpc", step: 1 },
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
        Channel: { type: "f", value: 0 },
        RGB_Input_Black: { type: "f", value: 0 },
        RGB_Input_White: { type: "f", value: 255 },
        RGB_Gamma: { type: "f", value: 1 },
        RGB_Output_Black: { type: "f", value: 0 },
        RGB_Output_White: { type: "f", value: 255 },
        Red_Input_Black: { type: "f", value: 0 },
        Red_Input_White: { type: "f", value: 255 },
        Red_Gamma: { type: "f", value: 1 },
        Red_Output_Black: { type: "f", value: 0 },
        Red_Output_White: { type: "f", value: 255 },
        Green_Input_Black: { type: "f", value: 0 },
        Green_Input_White: { type: "f", value: 255 },
        Green_Gamma: { type: "f", value: 1 },
        Green_Output_Black: { type: "f", value: 0 },
        Green_Output_White: { type: "f", value: 255 },
        Blue_Input_Black: { type: "f", value: 0 },
        Blue_Input_White: { type: "f", value: 255 },
        Blue_Gamma: { type: "f", value: 1 },
        Blue_Output_Black: { type: "f", value: 0 },
        Blue_Output_White: { type: "f", value: 255 },
        Alpha_Input_Black: { type: "f", value: 0 },
        Alpha_Input_White: { type: "f", value: 255 },
        Alpha_Gamma: { type: "f", value: 1 },
        Alpha_Output_Black: { type: "f", value: 0 },
        Alpha_Output_White: { type: "f", value: 255 },
        Clip_To_Output_Black: { type: "f", value: 2 },
        Clip_To_Output_White: { type: "f", value: 2 },
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
    u.Channel.value = this.properties.Channel.get(e);
    u.RGB_Input_Black.value = this.properties.RGB_Input_Black.get(e);
    u.RGB_Input_White.value = this.properties.RGB_Input_White.get(e);
    u.RGB_Gamma.value = this.properties.RGB_Gamma.get(e);
    u.RGB_Output_Black.value = this.properties.RGB_Output_Black.get(e);
    u.RGB_Output_White.value = this.properties.RGB_Output_White.get(e);
    u.Red_Input_Black.value = this.properties.Red_Input_Black.get(e);
    u.Red_Input_White.value = this.properties.Red_Input_White.get(e);
    u.Red_Gamma.value = this.properties.Red_Gamma.get(e);
    u.Red_Output_Black.value = this.properties.Red_Output_Black.get(e);
    u.Red_Output_White.value = this.properties.Red_Output_White.get(e);
    u.Green_Input_Black.value = this.properties.Green_Input_Black.get(e);
    u.Green_Input_White.value = this.properties.Green_Input_White.get(e);
    u.Green_Gamma.value = this.properties.Green_Gamma.get(e);
    u.Green_Output_Black.value = this.properties.Green_Output_Black.get(e);
    u.Green_Output_White.value = this.properties.Green_Output_White.get(e);
    u.Blue_Input_Black.value = this.properties.Blue_Input_Black.get(e);
    u.Blue_Input_White.value = this.properties.Blue_Input_White.get(e);
    u.Blue_Gamma.value = this.properties.Blue_Gamma.get(e);
    u.Blue_Output_Black.value = this.properties.Blue_Output_Black.get(e);
    u.Blue_Output_White.value = this.properties.Blue_Output_White.get(e);
    u.Alpha_Input_Black.value = this.properties.Alpha_Input_Black.get(e);
    u.Alpha_Input_White.value = this.properties.Alpha_Input_White.get(e);
    u.Alpha_Gamma.value = this.properties.Alpha_Gamma.get(e);
    u.Alpha_Output_Black.value = this.properties.Alpha_Output_Black.get(e);
    u.Alpha_Output_White.value = this.properties.Alpha_Output_White.get(e);
    u.Clip_To_Output_Black.value = this.properties.Clip_To_Output_Black.get(e);
    u.Clip_To_Output_White.value = this.properties.Clip_To_Output_White.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
