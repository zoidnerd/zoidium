// NeSprite (AlipFX) - Zoidium custom effect
// Source: NeSprite (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/nesprite.glsl

(this.defaultName = "NeSprite"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Retro NES-style pixelation with CRT filter.",
  }),
  (this.shaderfile = "preset/nesprite"),
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
    Factor: { dynamic: !0, name: "Factor", type: PZ.property.type.NUMBER, value: 6, step: 0.1 },
    Saturation: { dynamic: !0, name: "Saturation", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Dithering: { dynamic: !0, name: "Dithering", type: PZ.property.type.OPTION, value: 0, items: "Off;Bayer 4x4;Bayer 8x8;Bayer 8x4", step: 1 },
    Dither_Level: { dynamic: !0, name: "Dither Level", type: PZ.property.type.NUMBER, value: -1, step: 0.1 },
    Alpha_from_Src: { dynamic: !0, name: "Alpha from Src", type: PZ.property.type.OPTION, value: 1, items: "off;on", step: 1 },
    CRT_Filter: { dynamic: !0, name: "CRT Filter", type: PZ.property.type.OPTION, value: 1, items: "off;on", step: 1 },
    CRT_Horizontal_Alpha: { dynamic: !0, name: "CRT Horizontal Alpha", type: PZ.property.type.NUMBER, value: 0.5, step: 0.1 },
    CRT_Vertical_Alpha: { dynamic: !0, name: "CRT Vertical Alpha", type: PZ.property.type.NUMBER, value: 0.5, step: 0.1 },
    CRT_Blur_Radius: { dynamic: !0, name: "CRT Blur Radius", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    CRT_RGB_Shift_1: { dynamic: !0, name: "CRT RGB Shift 1", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    CRT_RGB_Shift_2: { dynamic: !0, name: "CRT RGB Shift 2", type: PZ.property.type.NUMBER, value: 2, step: 0.1 },
    Brightness: { dynamic: !0, name: "Brightness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Brightness_Threshold: { dynamic: !0, name: "Brightness Threshold", type: PZ.property.type.NUMBER, value: 128, step: 0.1 },
    Palette: { dynamic: !0, name: "Palette", type: PZ.property.type.OPTION, value: 0, items: "Original;Custom 8-Color;NES;Green 4;Varied 16;Blue;Magenta;Pastel;Fire;Red", step: 1 },
    Color_1: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_2: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_3: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_4: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_5: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_6: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_7: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_8: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
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
        Factor: { type: "f", value: 6 },
        Saturation: { type: "f", value: 0 },
        Dithering: { type: "f", value: 0 },
        Dither_Level: { type: "f", value: -1 },
        Alpha_from_Src: { type: "f", value: 1 },
        CRT_Filter: { type: "f", value: 1 },
        CRT_Horizontal_Alpha: { type: "f", value: 0.5 },
        CRT_Vertical_Alpha: { type: "f", value: 0.5 },
        CRT_Blur_Radius: { type: "f", value: 0 },
        CRT_RGB_Shift_1: { type: "f", value: 1 },
        CRT_RGB_Shift_2: { type: "f", value: 2 },
        Brightness: { type: "f", value: 0 },
        Brightness_Threshold: { type: "f", value: 128 },
        Palette: { type: "f", value: 0 },
        Color_1: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_2: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_3: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_4: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_5: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_6: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_7: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_8: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
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
    u.Factor.value = this.properties.Factor.get(e);
    u.Saturation.value = this.properties.Saturation.get(e);
    u.Dithering.value = this.properties.Dithering.get(e);
    u.Dither_Level.value = this.properties.Dither_Level.get(e);
    u.Alpha_from_Src.value = this.properties.Alpha_from_Src.get(e);
    u.CRT_Filter.value = this.properties.CRT_Filter.get(e);
    u.CRT_Horizontal_Alpha.value = this.properties.CRT_Horizontal_Alpha.get(e);
    u.CRT_Vertical_Alpha.value = this.properties.CRT_Vertical_Alpha.get(e);
    u.CRT_Blur_Radius.value = this.properties.CRT_Blur_Radius.get(e);
    u.CRT_RGB_Shift_1.value = this.properties.CRT_RGB_Shift_1.get(e);
    u.CRT_RGB_Shift_2.value = this.properties.CRT_RGB_Shift_2.get(e);
    u.Brightness.value = this.properties.Brightness.get(e);
    u.Brightness_Threshold.value = this.properties.Brightness_Threshold.get(e);
    u.Palette.value = this.properties.Palette.get(e);
    u.Color_1.value.set(this.properties.Color_1.get(e)[0]||0, this.properties.Color_1.get(e)[1]||0, this.properties.Color_1.get(e)[2]||0);
    u.Color_2.value.set(this.properties.Color_2.get(e)[0]||0, this.properties.Color_2.get(e)[1]||0, this.properties.Color_2.get(e)[2]||0);
    u.Color_3.value.set(this.properties.Color_3.get(e)[0]||0, this.properties.Color_3.get(e)[1]||0, this.properties.Color_3.get(e)[2]||0);
    u.Color_4.value.set(this.properties.Color_4.get(e)[0]||0, this.properties.Color_4.get(e)[1]||0, this.properties.Color_4.get(e)[2]||0);
    u.Color_5.value.set(this.properties.Color_5.get(e)[0]||0, this.properties.Color_5.get(e)[1]||0, this.properties.Color_5.get(e)[2]||0);
    u.Color_6.value.set(this.properties.Color_6.get(e)[0]||0, this.properties.Color_6.get(e)[1]||0, this.properties.Color_6.get(e)[2]||0);
    u.Color_7.value.set(this.properties.Color_7.get(e)[0]||0, this.properties.Color_7.get(e)[1]||0, this.properties.Color_7.get(e)[2]||0);
    u.Color_8.value.set(this.properties.Color_8.get(e)[0]||0, this.properties.Color_8.get(e)[1]||0, this.properties.Color_8.get(e)[2]||0);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
