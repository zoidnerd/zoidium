// S_WipeMoire (AlipFX) - Zoidium custom effect
// Source: S_WipeMoire (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/s_wipemoire.glsl

(this.defaultName = "S WipeMoire"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Wipe transition between A/B moire patterns with border.",
  }),
  (this.shaderfile = "preset/s_wipemoire"),
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
    Transition_Dir: { dynamic: !0, name: "Transition Dir", type: PZ.property.type.OPTION, value: 0, items: "Wipe Off;Wipe On" },
    Auto_Trans: { dynamic: !0, name: "Auto Trans", type: PZ.property.type.OPTION, value: 0, items: "Manual;Auto" },
    Wipe_Percent: { dynamic: !0, name: "Wipe Percent", type: PZ.property.type.NUMBER, value: 66.86, step: 0.1 },
    Edge_Softness: { dynamic: !0, name: "Edge Softness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    A_Center_XY: { dynamic: !0, name: "A Center XY", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    B_Center_XY: { dynamic: !0, name: "B Center XY", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Frequency: { dynamic: !0, name: "Frequency", type: PZ.property.type.NUMBER, value: 3.5, step: 0.1 },
    Phase_Start: { dynamic: !0, name: "Phase Start", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Phase_Speed: { dynamic: !0, name: "Phase Speed", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Moire_Phase: { dynamic: !0, name: "Moire Phase", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Moire_Speed: { dynamic: !0, name: "Moire Speed", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    A_Rel_Freq: { dynamic: !0, name: "A Rel Freq", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    A_Rel_Width: { dynamic: !0, name: "A Rel Width", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    A_Rotate: { dynamic: !0, name: "A Rotate", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    B_Rel_Freq: { dynamic: !0, name: "B Rel Freq", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    B_Rel_Width: { dynamic: !0, name: "B Rel Width", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    B_Rotate: { dynamic: !0, name: "B Rotate", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
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
        Wipe_Percent: { type: "f", value: 66.86 },
        Edge_Softness: { type: "f", value: 0 },
        A_Center_XY: { type: "v2", value: new THREE.Vector2(0, 0) },
        B_Center_XY: { type: "v2", value: new THREE.Vector2(0, 0) },
        Frequency: { type: "f", value: 3.5 },
        Phase_Start: { type: "f", value: 0 },
        Phase_Speed: { type: "f", value: 1 },
        Moire_Phase: { type: "f", value: 0 },
        Moire_Speed: { type: "f", value: 0 },
        A_Rel_Freq: { type: "f", value: 1 },
        A_Rel_Width: { type: "f", value: 1 },
        A_Rotate: { type: "f", value: 0 },
        B_Rel_Freq: { type: "f", value: 1 },
        B_Rel_Width: { type: "f", value: 1 },
        B_Rotate: { type: "f", value: 0 },
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
    u.Edge_Softness.value = this.properties.Edge_Softness.get(e);
    const _A_Center_XY = this.properties.A_Center_XY.get(e); u.A_Center_XY.value.set(_A_Center_XY[0]||0, _A_Center_XY[1]||0);
    const _B_Center_XY = this.properties.B_Center_XY.get(e); u.B_Center_XY.value.set(_B_Center_XY[0]||0, _B_Center_XY[1]||0);
    u.Frequency.value = this.properties.Frequency.get(e);
    u.Phase_Start.value = this.properties.Phase_Start.get(e);
    u.Phase_Speed.value = this.properties.Phase_Speed.get(e);
    u.Moire_Phase.value = this.properties.Moire_Phase.get(e);
    u.Moire_Speed.value = this.properties.Moire_Speed.get(e);
    u.A_Rel_Freq.value = this.properties.A_Rel_Freq.get(e);
    u.A_Rel_Width.value = this.properties.A_Rel_Width.get(e);
    u.A_Rotate.value = this.properties.A_Rotate.get(e);
    u.B_Rel_Freq.value = this.properties.B_Rel_Freq.get(e);
    u.B_Rel_Width.value = this.properties.B_Rel_Width.get(e);
    u.B_Rotate.value = this.properties.B_Rotate.get(e);
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
