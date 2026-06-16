// S_WipeTiles (AlipFX) - Zoidium custom effect
// Source: S_WipeTiles (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/s_wipetiles.glsl

(this.defaultName = "S WipeTiles"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Wipe via tiled hex, triangle, diamond, or star shapes.",
  }),
  (this.shaderfile = "preset/s_wipetiles"),
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
    Transition_Dir: { dynamic: !0, name: "Transition Dir", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Wipe Off;Wipe On" },
    Auto_Trans: { dynamic: !0, name: "Auto Trans", type: PZ.property.type.OPTION, value: 0, step: 1, items: "No;Yes" },
    Tile_Shapes: { dynamic: !0, name: "Tile Shapes", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Hexagon;Triangle;Diamond;Star" },
    Shapes_Dir: { dynamic: !0, name: "Shapes Dir", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Shrink;Grow" },
    Edge_Softness: { dynamic: !0, name: "Edge Softness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Angle: { dynamic: !0, name: "Angle", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Frequency: { dynamic: !0, name: "Frequency", type: PZ.property.type.NUMBER, value: 4, step: 0.1 },
    Rel_Width: { dynamic: !0, name: "Rel Width", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Rel_Wid_Pre_Rot: { dynamic: !0, name: "Rel Wid Pre Rot", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Shift_XY: { dynamic: !0, name: "Shift XY", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Morph_Shapes: { dynamic: !0, name: "Morph Shapes", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Grad_Add: { dynamic: !0, name: "Grad Add", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Grad_Angle: { dynamic: !0, name: "Grad Angle", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Border_Width: { dynamic: !0, name: "Border Width", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Border_Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Border_Opacity: { dynamic: !0, name: "Border Opacity", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Border_Softness: { dynamic: !0, name: "Border Softness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Border_Shift: { dynamic: !0, name: "Border Shift", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
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
        Transition_Dir: { type: "f", value: 0 },
        Auto_Trans: { type: "f", value: 0 },
        Wipe_Percent: { type: "f", value: 0 },
        Tile_Shapes: { type: "f", value: 0 },
        Shapes_Dir: { type: "f", value: 0 },
        Edge_Softness: { type: "f", value: 0 },
        Angle: { type: "f", value: 0 },
        Frequency: { type: "f", value: 4 },
        Rel_Width: { type: "f", value: 1 },
        Rel_Wid_Pre_Rot: { type: "f", value: 1 },
        Shift_XY: { type: "v2", value: new THREE.Vector2(0, 0) },
        Morph_Shapes: { type: "f", value: 0 },
        Grad_Add: { type: "f", value: 0 },
        Grad_Angle: { type: "f", value: 0 },
        Border_Width: { type: "f", value: 0 },
        Border_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Border_Opacity: { type: "f", value: 1 },
        Border_Softness: { type: "f", value: 0 },
        Border_Shift: { type: "f", value: 0 },
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
    u.Transition_Dir.value = this.properties.Transition_Dir.get(e);
    u.Auto_Trans.value = this.properties.Auto_Trans.get(e);
    u.Wipe_Percent.value = this.properties.Wipe_Percent.get(e);
    u.Tile_Shapes.value = this.properties.Tile_Shapes.get(e);
    u.Shapes_Dir.value = this.properties.Shapes_Dir.get(e);
    u.Edge_Softness.value = this.properties.Edge_Softness.get(e);
    u.Angle.value = this.properties.Angle.get(e);
    u.Frequency.value = this.properties.Frequency.get(e);
    u.Rel_Width.value = this.properties.Rel_Width.get(e);
    u.Rel_Wid_Pre_Rot.value = this.properties.Rel_Wid_Pre_Rot.get(e);
    const _Shift_XY = this.properties.Shift_XY.get(e); u.Shift_XY.value.set(_Shift_XY[0]||0, _Shift_XY[1]||0);
    u.Morph_Shapes.value = this.properties.Morph_Shapes.get(e);
    u.Grad_Add.value = this.properties.Grad_Add.get(e);
    u.Grad_Angle.value = this.properties.Grad_Angle.get(e);
    u.Border_Width.value = this.properties.Border_Width.get(e);
    u.Border_Color.value.set(this.properties.Border_Color.get(e)[0]||0, this.properties.Border_Color.get(e)[1]||0, this.properties.Border_Color.get(e)[2]||0);
    u.Border_Opacity.value = this.properties.Border_Opacity.get(e);
    u.Border_Softness.value = this.properties.Border_Softness.get(e);
    u.Border_Shift.value = this.properties.Border_Shift.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
