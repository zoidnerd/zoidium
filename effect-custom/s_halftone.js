// S_HalfTone (AlipFX) - Zoidium custom effect
// Source: S_HalfTone (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/s_halftone.glsl

(this.defaultName = "S HalfTone"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Newspaper-style halftone dot pattern from image luma.",
  }),
  (this.shaderfile = "preset/s_halftone"),
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
    Dots: { dynamic: !0, name: "Dots", type: PZ.property.type.OPTION, value: 0, items: "Black;White" },
    Dots_Frequency: { dynamic: !0, name: "Dots Frequency", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Dots_Angle: { dynamic: !0, name: "Dots Angle", type: PZ.property.type.NUMBER, value: -30, step: 0.1 },
    Dots_Rel_Width: { dynamic: !0, name: "Dots Rel Width", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Dots_Sharpness: { dynamic: !0, name: "Dots Sharpness", type: PZ.property.type.NUMBER, value: 4, step: 0.1 },
    Dots_Lighten: { dynamic: !0, name: "Dots Lighten", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Smooth_Source: { dynamic: !0, name: "Smooth Source", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Color1: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color0: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Dots_Shift_X: { dynamic: !0, name: "Dots Shift X", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Dots_Shift_Y: { dynamic: !0, name: "Dots Shift Y", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
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
        Dots: { type: "f", value: 0 },
        Dots_Frequency: { type: "f", value: 50 },
        Dots_Angle: { type: "f", value: -30 },
        Dots_Rel_Width: { type: "f", value: 1 },
        Dots_Sharpness: { type: "f", value: 4 },
        Dots_Lighten: { type: "f", value: 0 },
        Smooth_Source: { type: "f", value: 0 },
        Color1: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color0: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Dots_Shift_X: { type: "f", value: 0 },
        Dots_Shift_Y: { type: "f", value: 0 },
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
    u.Dots.value = this.properties.Dots.get(e);
    u.Dots_Frequency.value = this.properties.Dots_Frequency.get(e);
    u.Dots_Angle.value = this.properties.Dots_Angle.get(e);
    u.Dots_Rel_Width.value = this.properties.Dots_Rel_Width.get(e);
    u.Dots_Sharpness.value = this.properties.Dots_Sharpness.get(e);
    u.Dots_Lighten.value = this.properties.Dots_Lighten.get(e);
    u.Smooth_Source.value = this.properties.Smooth_Source.get(e);
    u.Color1.value.set(this.properties.Color1.get(e)[0]||0, this.properties.Color1.get(e)[1]||0, this.properties.Color1.get(e)[2]||0);
    u.Color0.value.set(this.properties.Color0.get(e)[0]||0, this.properties.Color0.get(e)[1]||0, this.properties.Color0.get(e)[2]||0);
    u.Dots_Shift_X.value = this.properties.Dots_Shift_X.get(e);
    u.Dots_Shift_Y.value = this.properties.Dots_Shift_Y.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
