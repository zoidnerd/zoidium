// Unsharp Mask (AlipFX) - Zoidium custom effect
// Source: Unsharp Mask (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/unsharp-mask.glsl

(this.defaultName = "Unsharp Mask"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Sharpens the image via blurred subtraction.",
  }),
  (this.shaderfile = "preset/unsharp-mask"),
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
    Amount: { dynamic: !0, name: "Amount", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Radius: { dynamic: !0, name: "Radius", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Threshold: { dynamic: !0, name: "Threshold", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
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
        Amount: { type: "f", value: 50 },
        Radius: { type: "f", value: 1 },
        Threshold: { type: "f", value: 0 },
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
    u.Amount.value = this.properties.Amount.get(e);
    u.Radius.value = this.properties.Radius.get(e);
    u.Threshold.value = this.properties.Threshold.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
