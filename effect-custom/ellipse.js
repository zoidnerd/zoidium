// Ellipse (AlipFX) - Zoidium custom effect
// Source: Ellipse (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/ellipse.glsl

(this.defaultName = "Ellipse"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Draws an ellipse ring or fill with inside and outside colors.",
  }),
  (this.shaderfile = "preset/ellipse"),
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
    Center: { dynamic: !0, name: "Center", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Width: { dynamic: !0, name: "Width", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Height: { dynamic: !0, name: "Height", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Thickness: { dynamic: !0, name: "Thickness", type: PZ.property.type.NUMBER, value: 8, step: 0.1 },
    Softness: { dynamic: !0, name: "Softness", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Inside_Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Outside_Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Composite_On_Original: { dynamic: !0, name: "Composite On Original", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
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
        Center: { type: "v2", value: new THREE.Vector2(0, 0) },
        Width: { type: "f", value: 50 },
        Height: { type: "f", value: 50 },
        Thickness: { type: "f", value: 8 },
        Softness: { type: "f", value: 50 },
        Inside_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Outside_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Composite_On_Original: { type: "f", value: 0 },
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
    const _Center = this.properties.Center.get(e); u.Center.value.set(_Center[0]||0, _Center[1]||0);
    u.Width.value = this.properties.Width.get(e);
    u.Height.value = this.properties.Height.get(e);
    u.Thickness.value = this.properties.Thickness.get(e);
    u.Softness.value = this.properties.Softness.get(e);
    u.Inside_Color.value.set(this.properties.Inside_Color.get(e)[0]||0, this.properties.Inside_Color.get(e)[1]||0, this.properties.Inside_Color.get(e)[2]||0);
    u.Outside_Color.value.set(this.properties.Outside_Color.get(e)[0]||0, this.properties.Outside_Color.get(e)[1]||0, this.properties.Outside_Color.get(e)[2]||0);
    u.Composite_On_Original.value = this.properties.Composite_On_Original.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
