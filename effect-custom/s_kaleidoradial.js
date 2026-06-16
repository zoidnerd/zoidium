// S_KaleidoRadial (AlipFX) - Zoidium custom effect
// Source: S_KaleidoRadial (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/s_kaleidoradial.glsl

(this.defaultName = "S KaleidoRadial"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Radial wedge kaleidoscope with rotating slices and wrap.",
  }),
  (this.shaderfile = "preset/s_kaleidoradial"),
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
    time: { dynamic: !0, name: "time", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Center_XY: { dynamic: !0, name: "Center XY", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Z_Dist: { dynamic: !0, name: "Z Dist", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Slices: { dynamic: !0, name: "Slices", type: PZ.property.type.NUMBER, value: 6, step: 0.1 },
    Rotate: { dynamic: !0, name: "Rotate", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Rotate_Kaleido: { dynamic: !0, name: "Rotate Kaleido", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Rotate_Inside: { dynamic: !0, name: "Rotate Inside", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Rotate_Inside_Speed: { dynamic: !0, name: "Rotate Inside Speed", type: PZ.property.type.NUMBER, value: 30, step: 0.1 },
    Shift_Inside: { dynamic: !0, name: "Shift Inside", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Kaleido_Amount: { dynamic: !0, name: "Kaleido Amount", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Wrap: { dynamic: !0, name: "Wrap", type: PZ.property.type.OPTION, value: 2, step: 1, items: "Clamp;Tile;Reflect" },
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
        time: { type: "f", value: 0 },
        Center_XY: { type: "v2", value: new THREE.Vector2(0, 0) },
        Z_Dist: { type: "f", value: 1 },
        Slices: { type: "f", value: 6 },
        Rotate: { type: "f", value: 0 },
        Rotate_Kaleido: { type: "f", value: 0 },
        Rotate_Inside: { type: "f", value: 0 },
        Rotate_Inside_Speed: { type: "f", value: 30 },
        Shift_Inside: { type: "v2", value: new THREE.Vector2(0, 0) },
        Kaleido_Amount: { type: "f", value: 1 },
        Wrap: { type: "f", value: 2 },
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
    u.time.value = this.properties.time.get(e);
    const _Center_XY = this.properties.Center_XY.get(e); u.Center_XY.value.set(_Center_XY[0]||0, _Center_XY[1]||0);
    u.Z_Dist.value = this.properties.Z_Dist.get(e);
    u.Slices.value = this.properties.Slices.get(e);
    u.Rotate.value = this.properties.Rotate.get(e);
    u.Rotate_Kaleido.value = this.properties.Rotate_Kaleido.get(e);
    u.Rotate_Inside.value = this.properties.Rotate_Inside.get(e);
    u.Rotate_Inside_Speed.value = this.properties.Rotate_Inside_Speed.get(e);
    const _Shift_Inside = this.properties.Shift_Inside.get(e); u.Shift_Inside.value.set(_Shift_Inside[0]||0, _Shift_Inside[1]||0);
    u.Kaleido_Amount.value = this.properties.Kaleido_Amount.get(e);
    u.Wrap.value = this.properties.Wrap.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
