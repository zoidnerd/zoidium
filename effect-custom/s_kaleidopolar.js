// S_KaleidoPolar (AlipFX) - Zoidium custom effect
// Source: S_KaleidoPolar (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/s_kaleidopolar.glsl

(this.defaultName = "S KaleidoPolar"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Polar-coordinate kaleidoscope with angular repeats and stretch.",
  }),
  (this.shaderfile = "preset/s_kaleidopolar"),
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
    Center_XY: { dynamic: !0, name: "Center XY", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Z_Dist: { dynamic: !0, name: "Z Dist", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Rotate: { dynamic: !0, name: "Rotate", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Stretch_X: { dynamic: !0, name: "Stretch X", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Stretch_Y: { dynamic: !0, name: "Stretch Y", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Inside_Shift_Y: { dynamic: !0, name: "Inside Shift Y", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Angle_Repeats: { dynamic: !0, name: "Angle Repeats", type: PZ.property.type.NUMBER, value: 3, step: 0.1 },
    Kaleido_Amount: { dynamic: !0, name: "Kaleido Amount", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
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
        Center_XY: { type: "v2", value: new THREE.Vector2(0, 0) },
        Z_Dist: { type: "f", value: 1 },
        Rotate: { type: "f", value: 0 },
        Stretch_X: { type: "f", value: 1 },
        Stretch_Y: { type: "f", value: 1 },
        Inside_Shift_Y: { type: "f", value: 0 },
        Angle_Repeats: { type: "f", value: 3 },
        Kaleido_Amount: { type: "f", value: 1 },
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
    const _Center_XY = this.properties.Center_XY.get(e); u.Center_XY.value.set(_Center_XY[0]||0, _Center_XY[1]||0);
    u.Z_Dist.value = this.properties.Z_Dist.get(e);
    u.Rotate.value = this.properties.Rotate.get(e);
    u.Stretch_X.value = this.properties.Stretch_X.get(e);
    u.Stretch_Y.value = this.properties.Stretch_Y.get(e);
    u.Inside_Shift_Y.value = this.properties.Inside_Shift_Y.get(e);
    u.Angle_Repeats.value = this.properties.Angle_Repeats.get(e);
    u.Kaleido_Amount.value = this.properties.Kaleido_Amount.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
