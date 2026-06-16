// Levels (AlipFX) - Zoidium custom effect
// Source: Levels (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/levels.glsl

(this.defaultName = "Levels"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Input/output levels with per-channel gamma.",
  }),
  (this.shaderfile = "preset/levels"),
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
    Channel: { dynamic: !0, name: "Channel", type: PZ.property.type.OPTION, value: 4, items: "RGB;R;G;B;Alpha" },
    Input_Black: { dynamic: !0, name: "Input Black", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Input_White: { dynamic: !0, name: "Input White", type: PZ.property.type.NUMBER, value: 255, step: 0.1 },
    Gamma: { dynamic: !0, name: "Gamma", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Output_Black: { dynamic: !0, name: "Output Black", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Output_White: { dynamic: !0, name: "Output White", type: PZ.property.type.NUMBER, value: 255, step: 0.1 },
    Clip_To_Output_Black: { dynamic: !0, name: "Clip To Output Black", type: PZ.property.type.OPTION, value: 2, items: "On;Off;Off for 32bpc" },
    Clip_To_Output_White: { dynamic: !0, name: "Clip To Output White", type: PZ.property.type.OPTION, value: 2, items: "On;Off;Off for 32bpc" },
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
        Channel: { type: "f", value: 4 },
        Input_Black: { type: "f", value: 0 },
        Input_White: { type: "f", value: 255 },
        Gamma: { type: "f", value: 1 },
        Output_Black: { type: "f", value: 0 },
        Output_White: { type: "f", value: 255 },
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
    u.Input_Black.value = this.properties.Input_Black.get(e);
    u.Input_White.value = this.properties.Input_White.get(e);
    u.Gamma.value = this.properties.Gamma.get(e);
    u.Output_Black.value = this.properties.Output_Black.get(e);
    u.Output_White.value = this.properties.Output_White.get(e);
    u.Clip_To_Output_Black.value = this.properties.Clip_To_Output_Black.get(e);
    u.Clip_To_Output_White.value = this.properties.Clip_To_Output_White.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
