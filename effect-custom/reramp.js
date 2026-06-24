// ReRamp (AlipFX) - Zoidium custom effect
// Source: ReRamp (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/reramp.glsl

(this.defaultName = "ReRamp"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Re-mapping color ramp with tiling, dither, and channel mapping.",
  }),
  (this.shaderfile = "preset/reramp"),
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
    Color_Blending: { dynamic: !0, name: "Color Blending", type: PZ.property.type.OPTION, value: 4, items: "OkLab;OkLCH;Kubelka-Munk;Solid;Linear" },
    Smoothness: { dynamic: !0, name: "Smoothness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Color_1: { dynamic: !0, name: "Color 1", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_2: { dynamic: !0, name: "Color 2", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_3: { dynamic: !0, name: "Color 3", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_4: { dynamic: !0, name: "Color 4", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_5: { dynamic: !0, name: "Color 5", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_6: { dynamic: !0, name: "Color 6", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_7: { dynamic: !0, name: "Color 7", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_8: { dynamic: !0, name: "Color 8", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Gradient_Colors: { dynamic: !0, name: "Gradient Colors", type: PZ.property.type.NUMBER, value: 2, step: 0.1 },
    Stop_Color: { dynamic: !0, name: "Stop Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Stop_Alpha: { dynamic: !0, name: "Stop Alpha", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Invert: { dynamic: !0, name: "Invert", type: PZ.property.type.OPTION, value: 1, items: "Off;On" },
    Phase_Offset: { dynamic: !0, name: "Phase Offset", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Scale: { dynamic: !0, name: "Scale", type: PZ.property.type.NUMBER, value: 10, step: 0.1 },
    Tiling: { dynamic: !0, name: "Tiling", type: PZ.property.type.OPTION, value: 0, items: "Repeat;Mirror;Clamp" },
    Bias: { dynamic: !0, name: "Bias", type: PZ.property.type.NUMBER, value: 0.5, step: 0.1 },
    Dither: { dynamic: !0, name: "Dither", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Quantize: { dynamic: !0, name: "Quantize", type: PZ.property.type.OPTION, value: 1, items: "Off;On" },
    Steps: { dynamic: !0, name: "Steps", type: PZ.property.type.NUMBER, value: 8, step: 0.1 },
    Mapping: { dynamic: !0, name: "Mapping", type: PZ.property.type.OPTION, value: 0, items: "Lightness;Hue;Saturation;Alpha" },
    Source_Start: { dynamic: !0, name: "Source Start", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Source_End: { dynamic: !0, name: "Source End", type: PZ.property.type.COLOR, value: [0, 0, 0] },
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
        Color_Blending: { type: "i", value: 4 },
        Smoothness: { type: "f", value: 0 },
        Color_1: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_2: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_3: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_4: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_5: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_6: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_7: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_8: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Gradient_Colors: { type: "f", value: 2 },
        Stop_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Stop_Alpha: { type: "f", value: 1 },
        Invert: { type: "i", value: 1 },
        Phase_Offset: { type: "f", value: 0 },
        Scale: { type: "f", value: 10 },
        Tiling: { type: "i", value: 0 },
        Bias: { type: "f", value: 0.5 },
        Dither: { type: "f", value: 0 },
        Quantize: { type: "i", value: 1 },
        Steps: { type: "f", value: 8 },
        Mapping: { type: "i", value: 0 },
        Source_Start: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Source_End: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
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
        u.Color_Blending.value = Math.round(this.properties.Color_Blending.get(e));
        u.Smoothness.value = this.properties.Smoothness.get(e);
        u.Color_1.value.set(this.properties.Color_1.get(e)[0]||0, this.properties.Color_1.get(e)[1]||0, this.properties.Color_1.get(e)[2]||0);
        u.Color_2.value.set(this.properties.Color_2.get(e)[0]||0, this.properties.Color_2.get(e)[1]||0, this.properties.Color_2.get(e)[2]||0);
        u.Color_3.value.set(this.properties.Color_3.get(e)[0]||0, this.properties.Color_3.get(e)[1]||0, this.properties.Color_3.get(e)[2]||0);
        u.Color_4.value.set(this.properties.Color_4.get(e)[0]||0, this.properties.Color_4.get(e)[1]||0, this.properties.Color_4.get(e)[2]||0);
        u.Color_5.value.set(this.properties.Color_5.get(e)[0]||0, this.properties.Color_5.get(e)[1]||0, this.properties.Color_5.get(e)[2]||0);
        u.Color_6.value.set(this.properties.Color_6.get(e)[0]||0, this.properties.Color_6.get(e)[1]||0, this.properties.Color_6.get(e)[2]||0);
        u.Color_7.value.set(this.properties.Color_7.get(e)[0]||0, this.properties.Color_7.get(e)[1]||0, this.properties.Color_7.get(e)[2]||0);
        u.Color_8.value.set(this.properties.Color_8.get(e)[0]||0, this.properties.Color_8.get(e)[1]||0, this.properties.Color_8.get(e)[2]||0);
        u.Gradient_Colors.value = this.properties.Gradient_Colors.get(e);
        u.Stop_Color.value.set(this.properties.Stop_Color.get(e)[0]||0, this.properties.Stop_Color.get(e)[1]||0, this.properties.Stop_Color.get(e)[2]||0);
        u.Stop_Alpha.value = this.properties.Stop_Alpha.get(e);
        u.Invert.value = Math.round(this.properties.Invert.get(e));
        u.Phase_Offset.value = this.properties.Phase_Offset.get(e);
        u.Scale.value = this.properties.Scale.get(e);
        u.Tiling.value = Math.round(this.properties.Tiling.get(e));
        u.Bias.value = this.properties.Bias.get(e);
        u.Dither.value = this.properties.Dither.get(e);
        u.Quantize.value = Math.round(this.properties.Quantize.get(e));
        u.Steps.value = this.properties.Steps.get(e);
        u.Mapping.value = Math.round(this.properties.Mapping.get(e));
        u.Source_Start.value.set(this.properties.Source_Start.get(e)[0]||0, this.properties.Source_Start.get(e)[1]||0, this.properties.Source_Start.get(e)[2]||0);
        u.Source_End.value.set(this.properties.Source_End.get(e)[0]||0, this.properties.Source_End.get(e)[1]||0, this.properties.Source_End.get(e)[2]||0);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
