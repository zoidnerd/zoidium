// AZ Threshold RGB (AlipFX) - Zoidium custom effect
// Source: AZ Threshold RGB (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-threshold-rgb.glsl

(this.defaultName = "AZ Threshold RGB"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Per-channel RGB threshold to black or white.",
  }),
  (this.shaderfile = "preset/az-threshold-rgb"),
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
    Red_Threshold: { dynamic: !0, name: "Red Threshold", type: PZ.property.type.NUMBER, value: 127.5, step: 0.1 },
    Green_Threshold: { dynamic: !0, name: "Green Threshold", type: PZ.property.type.NUMBER, value: 127.5, step: 0.1 },
    Blue_Threshold: { dynamic: !0, name: "Blue Threshold", type: PZ.property.type.NUMBER, value: 127.5, step: 0.1 },
    Invert_Red_Channel: { dynamic: !0, name: "Invert Red Channel", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Invert_Green_Channel: { dynamic: !0, name: "Invert Green Channel", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Invert_Blue_Channel: { dynamic: !0, name: "Invert Blue Channel", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Blend_With_Original: { dynamic: !0, name: "Blend With Original", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
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
        Red_Threshold: { type: "f", value: 127.5 },
        Green_Threshold: { type: "f", value: 127.5 },
        Blue_Threshold: { type: "f", value: 127.5 },
        Invert_Red_Channel: { type: "f", value: 0 },
        Invert_Green_Channel: { type: "f", value: 0 },
        Invert_Blue_Channel: { type: "f", value: 0 },
        Blend_With_Original: { type: "f", value: 0 },
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
    u.Red_Threshold.value = this.properties.Red_Threshold.get(e);
    u.Green_Threshold.value = this.properties.Green_Threshold.get(e);
    u.Blue_Threshold.value = this.properties.Blue_Threshold.get(e);
    u.Invert_Red_Channel.value = this.properties.Invert_Red_Channel.get(e);
    u.Invert_Green_Channel.value = this.properties.Invert_Green_Channel.get(e);
    u.Invert_Blue_Channel.value = this.properties.Invert_Blue_Channel.get(e);
    u.Blend_With_Original.value = this.properties.Blend_With_Original.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
