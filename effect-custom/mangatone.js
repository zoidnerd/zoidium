// MangaTone (AlipFX) - Zoidium custom effect
// Source: MangaTone (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/mangatone.glsl

(this.defaultName = "MangaTone"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Posterizes image to manga-style tone with ink.",
  }),
  (this.shaderfile = "preset/mangatone"),
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
    Contrast: { dynamic: !0, name: "Contrast", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Tone_Curve_Gamma: { dynamic: !0, name: "Tone Curve Gamma", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Outline_Enable: { dynamic: !0, name: "Outline Enable", type: PZ.property.type.OPTION, value: 1, items: "off;on", step: 1 },
    Outline_Threshold: { dynamic: !0, name: "Outline Threshold", type: PZ.property.type.NUMBER, value: 0.2, step: 0.1 },
    Outline_Strength: { dynamic: !0, name: "Outline Strength", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Outline_Fill_Radius: { dynamic: !0, name: "Outline Fill Radius", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Lines_Dark_Fill_Threshold: { dynamic: !0, name: "Lines Dark Fill Threshold", type: PZ.property.type.NUMBER, value: 0.1, step: 0.1 },
    Pattern_Type: { dynamic: !0, name: "Pattern Type", type: PZ.property.type.OPTION, value: 0, items: "Dots;Lines", step: 1 },
    Tone_Levels: { dynamic: !0, name: "Tone Levels", type: PZ.property.type.NUMBER, value: 4, step: 0.1 },
    Solid_Black_Enable: { dynamic: !0, name: "Solid Black Enable", type: PZ.property.type.OPTION, value: 1, items: "off;on", step: 1 },
    Solid_Black_Threshold: { dynamic: !0, name: "Solid Black Threshold", type: PZ.property.type.NUMBER, value: 0.1, step: 0.1 },
    Solid_White_Enable: { dynamic: !0, name: "Solid White Enable", type: PZ.property.type.OPTION, value: 1, items: "off;on", step: 1 },
    Solid_White_Threshold: { dynamic: !0, name: "Solid White Threshold", type: PZ.property.type.NUMBER, value: 0.9, step: 0.1 },
    Gradient_Boundaries: { dynamic: !0, name: "Gradient Boundaries", type: PZ.property.type.OPTION, value: 1, items: "off;on", step: 1 },
    Gradient_Smoothness: { dynamic: !0, name: "Gradient Smoothness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Pattern_Size: { dynamic: !0, name: "Pattern Size", type: PZ.property.type.NUMBER, value: 60, step: 0.1 },
    Tone_Rotation: { dynamic: !0, name: "Tone Rotation", type: PZ.property.type.NUMBER, value: 45, step: 0.1 },
    Background_Alpha: { dynamic: !0, name: "Background Alpha", type: PZ.property.type.OPTION, value: 0, items: "off;on", step: 1 },
    Background_Opacity: { dynamic: !0, name: "Background Opacity", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Alpha_Ink_Color: { dynamic: !0, name: "Alpha Ink Color", type: PZ.property.type.OPTION, value: 2, items: "Use Alpha;Black Ink;White Ink", step: 1 },
    Invert_Pattern_Enable: { dynamic: !0, name: "Invert Pattern Enable", type: PZ.property.type.OPTION, value: 1, items: "off;on", step: 1 },
    Invert_Pattern_Threshold: { dynamic: !0, name: "Invert Pattern Threshold", type: PZ.property.type.NUMBER, value: 0.45, step: 0.1 },
    Tone_Coeff_1: { dynamic: !0, name: "Tone Coeff 1", type: PZ.property.type.NUMBER, value: 0.7, step: 0.1 },
    Upper_Boundary_1: { dynamic: !0, name: "Upper Boundary 1", type: PZ.property.type.NUMBER, value: 0.25, step: 0.1 },
    Tone_Coeff_2: { dynamic: !0, name: "Tone Coeff 2", type: PZ.property.type.NUMBER, value: 0.75, step: 0.1 },
    Upper_Boundary_2: { dynamic: !0, name: "Upper Boundary 2", type: PZ.property.type.NUMBER, value: 0.5, step: 0.1 },
    Tone_Coeff_3: { dynamic: !0, name: "Tone Coeff 3", type: PZ.property.type.NUMBER, value: 0.8, step: 0.1 },
    Upper_Boundary_3: { dynamic: !0, name: "Upper Boundary 3", type: PZ.property.type.NUMBER, value: 0.82, step: 0.1 },
    Tone_Coeff_4: { dynamic: !0, name: "Tone Coeff 4", type: PZ.property.type.NUMBER, value: 0.9, step: 0.1 },
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
        Contrast: { type: "f", value: 1 },
        Tone_Curve_Gamma: { type: "f", value: 1 },
        Outline_Enable: { type: "i", value: 1 },
        Outline_Threshold: { type: "f", value: 0.2 },
        Outline_Strength: { type: "f", value: 1 },
        Outline_Fill_Radius: { type: "f", value: 1 },
        Lines_Dark_Fill_Threshold: { type: "f", value: 0.1 },
        Pattern_Type: { type: "i", value: 0 },
        Tone_Levels: { type: "f", value: 4 },
        Solid_Black_Enable: { type: "i", value: 1 },
        Solid_Black_Threshold: { type: "f", value: 0.1 },
        Solid_White_Enable: { type: "i", value: 1 },
        Solid_White_Threshold: { type: "f", value: 0.9 },
        Gradient_Boundaries: { type: "i", value: 1 },
        Gradient_Smoothness: { type: "f", value: 0 },
        Pattern_Size: { type: "f", value: 60 },
        Tone_Rotation: { type: "f", value: 45 },
        Background_Alpha: { type: "i", value: 0 },
        Background_Opacity: { type: "f", value: 1 },
        Alpha_Ink_Color: { type: "i", value: 2 },
        Invert_Pattern_Enable: { type: "f", value: 1 },
        Invert_Pattern_Threshold: { type: "f", value: 0.45 },
        Tone_Coeff_1: { type: "f", value: 0.7 },
        Upper_Boundary_1: { type: "f", value: 0.25 },
        Tone_Coeff_2: { type: "f", value: 0.75 },
        Upper_Boundary_2: { type: "f", value: 0.5 },
        Tone_Coeff_3: { type: "f", value: 0.8 },
        Upper_Boundary_3: { type: "f", value: 0.82 },
        Tone_Coeff_4: { type: "f", value: 0.9 },
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
    u.Contrast.value = this.properties.Contrast.get(e);
    u.Tone_Curve_Gamma.value = this.properties.Tone_Curve_Gamma.get(e);
    u.Outline_Enable.value = Math.round(this.properties.Outline_Enable.get(e));
    u.Outline_Threshold.value = this.properties.Outline_Threshold.get(e);
    u.Outline_Strength.value = this.properties.Outline_Strength.get(e);
    u.Outline_Fill_Radius.value = this.properties.Outline_Fill_Radius.get(e);
    u.Lines_Dark_Fill_Threshold.value = this.properties.Lines_Dark_Fill_Threshold.get(e);
    u.Pattern_Type.value = Math.round(this.properties.Pattern_Type.get(e));
    u.Tone_Levels.value = this.properties.Tone_Levels.get(e);
    u.Solid_Black_Enable.value = Math.round(this.properties.Solid_Black_Enable.get(e));
    u.Solid_Black_Threshold.value = this.properties.Solid_Black_Threshold.get(e);
    u.Solid_White_Enable.value = Math.round(this.properties.Solid_White_Enable.get(e));
    u.Solid_White_Threshold.value = this.properties.Solid_White_Threshold.get(e);
    u.Gradient_Boundaries.value = Math.round(this.properties.Gradient_Boundaries.get(e));
    u.Gradient_Smoothness.value = this.properties.Gradient_Smoothness.get(e);
    u.Pattern_Size.value = this.properties.Pattern_Size.get(e);
    u.Tone_Rotation.value = this.properties.Tone_Rotation.get(e);
    u.Background_Alpha.value = Math.round(this.properties.Background_Alpha.get(e));
    u.Background_Opacity.value = this.properties.Background_Opacity.get(e);
    u.Alpha_Ink_Color.value = Math.round(this.properties.Alpha_Ink_Color.get(e));
    u.Invert_Pattern_Enable.value = this.properties.Invert_Pattern_Enable.get(e);
    u.Invert_Pattern_Threshold.value = this.properties.Invert_Pattern_Threshold.get(e);
    u.Tone_Coeff_1.value = this.properties.Tone_Coeff_1.get(e);
    u.Upper_Boundary_1.value = this.properties.Upper_Boundary_1.get(e);
    u.Tone_Coeff_2.value = this.properties.Tone_Coeff_2.get(e);
    u.Upper_Boundary_2.value = this.properties.Upper_Boundary_2.get(e);
    u.Tone_Coeff_3.value = this.properties.Tone_Coeff_3.get(e);
    u.Upper_Boundary_3.value = this.properties.Upper_Boundary_3.get(e);
    u.Tone_Coeff_4.value = this.properties.Tone_Coeff_4.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
