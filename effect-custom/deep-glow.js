// Deep Glow (AlipFX) - Zoidium custom effect
// Source: Deep Glow (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/deep-glow.glsl

(this.defaultName = "Deep Glow"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Deep directional bloom with tint mode, threshold, and intensity.",
  }),
  (this.shaderfile = "preset/deep-glow"),
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
    Intensity: { dynamic: !0, name: "Intensity", type: PZ.property.type.NUMBER, value: 10, step: 0.1 },
    Threshold: { dynamic: !0, name: "Threshold", type: PZ.property.type.NUMBER, value: 0.5, step: 0.1 },
    SoftKnee: { dynamic: !0, name: "Softknee", type: PZ.property.type.NUMBER, value: 0.5, step: 0.1 },
    Streaks: { dynamic: !0, name: "Streaks", type: PZ.property.type.NUMBER, value: 0.02, step: 0.1 },
    Chromatic: { dynamic: !0, name: "Chromatic", type: PZ.property.type.NUMBER, value: 0.3, step: 0.1 },
    Saturation: { dynamic: !0, name: "Saturation", type: PZ.property.type.NUMBER, value: 0.8, step: 0.1 },
    Vignette: { dynamic: !0, name: "Vignette", type: PZ.property.type.NUMBER, value: 0.6, step: 0.1 },
    Gamma_Correction: { dynamic: !0, name: "Gamma Correction", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Scene_Gamma: { dynamic: !0, name: "Scene Gamma", type: PZ.property.type.NUMBER, value: 2.39, step: 0.1 },
    Aspect_Ratio: { dynamic: !0, name: "Aspect Ratio", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Aspect_Angle: { dynamic: !0, name: "Aspect Angle", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Tint_Mode: { dynamic: !0, name: "Tint Mode", type: PZ.property.type.OPTION, value: 2, items: "Off;Average;Range" },
    Tint_Blend_Mode: { dynamic: !0, name: "Tint Blend Mode", type: PZ.property.type.OPTION, value: 1, items: "Off;Multiply;Color Burn;Screen" },
    Color_Inner: { dynamic: !0, name: "Color Inner", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_Outer: { dynamic: !0, name: "Color Outer", type: PZ.property.type.COLOR, value: [0, 0, 0] },
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
        Intensity: { type: "f", value: 10 },
        Threshold: { type: "f", value: 0.5 },
        SoftKnee: { type: "f", value: 0.5 },
        Streaks: { type: "f", value: 0.02 },
        Chromatic: { type: "f", value: 0.3 },
        Saturation: { type: "f", value: 0.8 },
        Vignette: { type: "f", value: 0.6 },
        Gamma_Correction: { type: "f", value: 100 },
        Scene_Gamma: { type: "f", value: 2.39 },
        Aspect_Ratio: { type: "f", value: 1 },
        Aspect_Angle: { type: "f", value: 0 },
        Tint_Mode: { type: "i", value: 2 },
        Tint_Blend_Mode: { type: "i", value: 1 },
        Color_Inner: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_Outer: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
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
        u.Intensity.value = this.properties.Intensity.get(e);
        u.Threshold.value = this.properties.Threshold.get(e);
        u.SoftKnee.value = this.properties.SoftKnee.get(e);
        u.Streaks.value = this.properties.Streaks.get(e);
        u.Chromatic.value = this.properties.Chromatic.get(e);
        u.Saturation.value = this.properties.Saturation.get(e);
        u.Vignette.value = this.properties.Vignette.get(e);
        u.Gamma_Correction.value = this.properties.Gamma_Correction.get(e);
        u.Scene_Gamma.value = this.properties.Scene_Gamma.get(e);
        u.Aspect_Ratio.value = this.properties.Aspect_Ratio.get(e);
        u.Aspect_Angle.value = this.properties.Aspect_Angle.get(e);
        u.Tint_Mode.value = Math.round(this.properties.Tint_Mode.get(e));
        u.Tint_Blend_Mode.value = Math.round(this.properties.Tint_Blend_Mode.get(e));
        u.Color_Inner.value.set(this.properties.Color_Inner.get(e)[0]||0, this.properties.Color_Inner.get(e)[1]||0, this.properties.Color_Inner.get(e)[2]||0);
        u.Color_Outer.value.set(this.properties.Color_Outer.get(e)[0]||0, this.properties.Color_Outer.get(e)[1]||0, this.properties.Color_Outer.get(e)[2]||0);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
