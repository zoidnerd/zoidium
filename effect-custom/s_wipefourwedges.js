// S_WipeFourWedges (AlipFX) - Zoidium custom effect
// Source: S_WipeFourWedges (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/s_wipefourwedges.glsl

(this.defaultName = "S WipeFourWedges"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "X-shaped four-wedge wipe from edges toward the center.",
  }),
  (this.shaderfile = "preset/s_wipefourwedges"),
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
    Wipe_Direction: { dynamic: !0, name: "Wipe Direction", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Inward;Outward" },
    Edge_Softness: { dynamic: !0, name: "Edge Softness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Angle: { dynamic: !0, name: "Angle", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Aspect_Scale: { dynamic: !0, name: "Aspect Scale", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
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
        Wipe_Direction: { type: "f", value: 0 },
        Edge_Softness: { type: "f", value: 0 },
        Angle: { type: "f", value: 0 },
        Aspect_Scale: { type: "f", value: 1 },
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
    u.Wipe_Direction.value = this.properties.Wipe_Direction.get(e);
    u.Edge_Softness.value = this.properties.Edge_Softness.get(e);
    u.Angle.value = this.properties.Angle.get(e);
    u.Aspect_Scale.value = this.properties.Aspect_Scale.get(e);
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
