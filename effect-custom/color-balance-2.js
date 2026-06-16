// Color Balance (HSL) (AlipFX) - Zoidium custom effect
// Source: Color Balance (HSL) (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/color-balance-2.glsl

(this.defaultName = "Color Balance (HSL)"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Shifts hue, saturation, and lightness of the image.",
  }),
  (this.shaderfile = "preset/color-balance-2"),
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
    Hue: { dynamic: !0, name: "Hue", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Saturation: { dynamic: !0, name: "Saturation", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Lightness: { dynamic: !0, name: "Lightness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
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
        Hue: { type: "f", value: 0 },
        Saturation: { type: "f", value: 0 },
        Lightness: { type: "f", value: 0 },
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
    u.Hue.value = this.properties.Hue.get(e);
    u.Saturation.value = this.properties.Saturation.get(e);
    u.Lightness.value = this.properties.Lightness.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
