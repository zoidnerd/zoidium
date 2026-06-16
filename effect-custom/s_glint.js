// S_Glint (AlipFX) - Zoidium custom effect
// Source: S_Glint (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/s_glint.glsl

(this.defaultName = "S Glint"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Sparkle glint on bright pixels with size and scale.",
  }),
  (this.shaderfile = "preset/s_glint"),
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
    Brightness: { dynamic: !0, name: "Brightness", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Hue_Shift: { dynamic: !0, name: "Hue Shift", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Scale_Colors: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Brightness_X: { dynamic: !0, name: "Brightness X", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Brightness_Y: { dynamic: !0, name: "Brightness Y", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Brightness_Diag1: { dynamic: !0, name: "Brightness Diag1", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Brightness_Diag2: { dynamic: !0, name: "Brightness Diag2", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Threshold: { dynamic: !0, name: "Threshold", type: PZ.property.type.NUMBER, value: 0.7, step: 0.1 },
    Threshold_Add_Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Threshold_Blur: { dynamic: !0, name: "Threshold Blur", type: PZ.property.type.NUMBER, value: 5.38, step: 0.1 },
    Size: { dynamic: !0, name: "Size", type: PZ.property.type.NUMBER, value: 480, step: 0.1 },
    Size_X: { dynamic: !0, name: "Size X", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Size_Y: { dynamic: !0, name: "Size Y", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Size_Diag1: { dynamic: !0, name: "Size Diag1", type: PZ.property.type.NUMBER, value: 0.75, step: 0.1 },
    Size_Diag2: { dynamic: !0, name: "Size Diag2", type: PZ.property.type.NUMBER, value: 0.75, step: 0.1 },
    Size_Red: { dynamic: !0, name: "Size Red", type: PZ.property.type.NUMBER, value: 0.5, step: 0.1 },
    Size_Green: { dynamic: !0, name: "Size Green", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Size_Blue: { dynamic: !0, name: "Size Blue", type: PZ.property.type.NUMBER, value: 1.5, step: 0.1 },
    Blur_Glint: { dynamic: !0, name: "Blur Glint", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Affect_Alpha: { dynamic: !0, name: "Affect Alpha", type: PZ.property.type.NUMBER, value: 1.05, step: 0.1 },
    Glint_From_Alpha: { dynamic: !0, name: "Glint From Alpha", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Off;On" },
    Glint_Under_Source: { dynamic: !0, name: "Glint Under Source", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Off;On" },
    Source_Opacity: { dynamic: !0, name: "Source Opacity", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Bg_Brightness: { dynamic: !0, name: "Bg Brightness", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
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
        Brightness: { type: "f", value: 1 },
        Hue_Shift: { type: "f", value: 0 },
        Scale_Colors: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Brightness_X: { type: "f", value: 1 },
        Brightness_Y: { type: "f", value: 1 },
        Brightness_Diag1: { type: "f", value: 1 },
        Brightness_Diag2: { type: "f", value: 1 },
        Threshold: { type: "f", value: 0.7 },
        Threshold_Add_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Threshold_Blur: { type: "f", value: 5.38 },
        Size: { type: "f", value: 480 },
        Size_X: { type: "f", value: 1 },
        Size_Y: { type: "f", value: 1 },
        Size_Diag1: { type: "f", value: 0.75 },
        Size_Diag2: { type: "f", value: 0.75 },
        Size_Red: { type: "f", value: 0.5 },
        Size_Green: { type: "f", value: 1 },
        Size_Blue: { type: "f", value: 1.5 },
        Blur_Glint: { type: "f", value: 0 },
        Affect_Alpha: { type: "f", value: 1.05 },
        Glint_From_Alpha: { type: "f", value: 0 },
        Glint_Under_Source: { type: "f", value: 0 },
        Source_Opacity: { type: "f", value: 1 },
        Bg_Brightness: { type: "f", value: 1 },
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
    u.Brightness.value = this.properties.Brightness.get(e);
    u.Hue_Shift.value = this.properties.Hue_Shift.get(e);
    u.Scale_Colors.value.set(this.properties.Scale_Colors.get(e)[0]||0, this.properties.Scale_Colors.get(e)[1]||0, this.properties.Scale_Colors.get(e)[2]||0);
    u.Brightness_X.value = this.properties.Brightness_X.get(e);
    u.Brightness_Y.value = this.properties.Brightness_Y.get(e);
    u.Brightness_Diag1.value = this.properties.Brightness_Diag1.get(e);
    u.Brightness_Diag2.value = this.properties.Brightness_Diag2.get(e);
    u.Threshold.value = this.properties.Threshold.get(e);
    u.Threshold_Add_Color.value.set(this.properties.Threshold_Add_Color.get(e)[0]||0, this.properties.Threshold_Add_Color.get(e)[1]||0, this.properties.Threshold_Add_Color.get(e)[2]||0);
    u.Threshold_Blur.value = this.properties.Threshold_Blur.get(e);
    u.Size.value = this.properties.Size.get(e);
    u.Size_X.value = this.properties.Size_X.get(e);
    u.Size_Y.value = this.properties.Size_Y.get(e);
    u.Size_Diag1.value = this.properties.Size_Diag1.get(e);
    u.Size_Diag2.value = this.properties.Size_Diag2.get(e);
    u.Size_Red.value = this.properties.Size_Red.get(e);
    u.Size_Green.value = this.properties.Size_Green.get(e);
    u.Size_Blue.value = this.properties.Size_Blue.get(e);
    u.Blur_Glint.value = this.properties.Blur_Glint.get(e);
    u.Affect_Alpha.value = this.properties.Affect_Alpha.get(e);
    u.Glint_From_Alpha.value = this.properties.Glint_From_Alpha.get(e);
    u.Glint_Under_Source.value = this.properties.Glint_Under_Source.get(e);
    u.Source_Opacity.value = this.properties.Source_Opacity.get(e);
    u.Bg_Brightness.value = this.properties.Bg_Brightness.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
