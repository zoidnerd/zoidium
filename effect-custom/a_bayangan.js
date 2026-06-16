// A_Bayangan (AlipFX) - Zoidium custom effect
// Source: A_Bayangan (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/a_bayangan.glsl

(this.defaultName = "A Bayangan"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Colored drop shadow with HSL colorize controls.",
  }),
  (this.shaderfile = "preset/a_bayangan"),
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
    Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Opacity: { dynamic: !0, name: "Opacity", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Softness: { dynamic: !0, name: "Softness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Distance: { dynamic: !0, name: "Distance", type: PZ.property.type.NUMBER, value: 32, step: 0.1 },
    Angle: { dynamic: !0, name: "Angle", type: PZ.property.type.NUMBER, value: 199, step: 0.1 },
    Unmult: { dynamic: !0, name: "Unmult", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Invert: { dynamic: !0, name: "Invert", type: PZ.property.type.OPTION, value: 1, items: "off;on" },
    Composite_Order: { dynamic: !0, name: "Composite Order", type: PZ.property.type.OPTION, value: 1, items: "In Front;Behind" },
    Colorize: { dynamic: !0, name: "Colorize", type: PZ.property.type.OPTION, value: 1, items: "off;on" },
    Master_Hue: { dynamic: !0, name: "Master Hue", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Master_Saturation: { dynamic: !0, name: "Master Saturation", type: PZ.property.type.NUMBER, value: 25, step: 0.1 },
    Master_Lightness: { dynamic: !0, name: "Master Lightness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
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
        Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Opacity: { type: "f", value: 50 },
        Softness: { type: "f", value: 0 },
        Distance: { type: "f", value: 32 },
        Angle: { type: "f", value: 199 },
        Unmult: { type: "f", value: 0 },
        Invert: { type: "f", value: 1 },
        Composite_Order: { type: "f", value: 1 },
        Colorize: { type: "f", value: 1 },
        Master_Hue: { type: "f", value: 0 },
        Master_Saturation: { type: "f", value: 25 },
        Master_Lightness: { type: "f", value: 0 },
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
    u.Color.value.set(this.properties.Color.get(e)[0]||0, this.properties.Color.get(e)[1]||0, this.properties.Color.get(e)[2]||0);
    u.Opacity.value = this.properties.Opacity.get(e);
    u.Softness.value = this.properties.Softness.get(e);
    u.Distance.value = this.properties.Distance.get(e);
    u.Angle.value = this.properties.Angle.get(e);
    u.Unmult.value = this.properties.Unmult.get(e);
    u.Invert.value = this.properties.Invert.get(e);
    u.Composite_Order.value = this.properties.Composite_Order.get(e);
    u.Colorize.value = this.properties.Colorize.get(e);
    u.Master_Hue.value = this.properties.Master_Hue.get(e);
    u.Master_Saturation.value = this.properties.Master_Saturation.get(e);
    u.Master_Lightness.value = this.properties.Master_Lightness.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
