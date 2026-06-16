// AZ Threshold (AlipFX) - Zoidium custom effect
// Source: AZ Threshold (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-threshold.glsl

(this.defaultName = "AZ Threshold"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Hard threshold cut on a channel with invert.",
  }),
  (this.shaderfile = "preset/az-threshold"),
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
    Threshold: { dynamic: !0, name: "Threshold", type: PZ.property.type.NUMBER, value: 127.5, step: 0.1 },
    Channel: { dynamic: !0, name: "Channel", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Luminance;RGB;Saturation;Alpha" },
    Invert: { dynamic: !0, name: "Invert", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Off;On" },
    Blend_w_Original: { dynamic: !0, name: "Blend w Original", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
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
        Threshold: { type: "f", value: 127.5 },
        Channel: { type: "f", value: 0 },
        Invert: { type: "f", value: 0 },
        Blend_w_Original: { type: "f", value: 0 },
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
    u.Threshold.value = this.properties.Threshold.get(e);
    u.Channel.value = this.properties.Channel.get(e);
    u.Invert.value = this.properties.Invert.get(e);
    u.Blend_w_Original.value = this.properties.Blend_w_Original.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
