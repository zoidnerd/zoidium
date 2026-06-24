// Pro Line Extract (AlipFX) - Zoidium custom effect
// Source: Pro Line Extract (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/pro-line-extract.glsl

(this.defaultName = "Pro Line Extract"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Line-art extraction with soft/hard methods and output modes.",
  }),
  (this.shaderfile = "preset/pro-line-extract"),
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
    Method: { dynamic: !0, name: "Method", type: PZ.property.type.OPTION, value: 1, items: "XDoG Anime;XDoG Manga;Multiply Blur" },
    Threshold: { dynamic: !0, name: "Threshold", type: PZ.property.type.NUMBER, value: 0.4, step: 0.1 },
    Line_Thickness: { dynamic: !0, name: "Line Thickness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Softness: { dynamic: !0, name: "Softness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Noise_Reduction: { dynamic: !0, name: "Noise Reduction", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Sigma: { dynamic: !0, name: "Sigma", type: PZ.property.type.NUMBER, value: 0.75, step: 0.1 },
    Sigma_Ratio: { dynamic: !0, name: "Sigma Ratio", type: PZ.property.type.NUMBER, value: 0.35, step: 0.1 },
    Sharpness: { dynamic: !0, name: "Sharpness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Edge_Hardness: { dynamic: !0, name: "Edge Hardness", type: PZ.property.type.OPTION, value: 100, items: "soft;hard" },
    Detail_Boost: { dynamic: !0, name: "Detail Boost", type: PZ.property.type.NUMBER, value: 1.5, step: 0.1 },
    Invert_Lines: { dynamic: !0, name: "Invert Lines", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Output_Mode: { dynamic: !0, name: "Output Mode", type: PZ.property.type.OPTION, value: 0, items: "composite;lines only" },
    Line_Color: { dynamic: !0, name: "Line Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Use_Line_Color: { dynamic: !0, name: "Use Line Color", type: PZ.property.type.OPTION, value: 0, items: "default tones;use Line_Color" },
    Background_Color: { dynamic: !0, name: "Background Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Background_Opacity: { dynamic: !0, name: "Background Opacity", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
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
        Method: { type: "i", value: 1 },
        Threshold: { type: "f", value: 0.4 },
        Line_Thickness: { type: "f", value: 0 },
        Softness: { type: "f", value: 0 },
        Noise_Reduction: { type: "f", value: 0 },
        Sigma: { type: "f", value: 0.75 },
        Sigma_Ratio: { type: "f", value: 0.35 },
        Sharpness: { type: "f", value: 0 },
        Edge_Hardness: { type: "i", value: 100 },
        Detail_Boost: { type: "f", value: 1.5 },
        Invert_Lines: { type: "i", value: 0 },
        Output_Mode: { type: "i", value: 0 },
        Line_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Use_Line_Color: { type: "i", value: 0 },
        Background_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Background_Opacity: { type: "f", value: 100 },
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
        u.Method.value = Math.round(this.properties.Method.get(e));
        u.Threshold.value = this.properties.Threshold.get(e);
        u.Line_Thickness.value = this.properties.Line_Thickness.get(e);
        u.Softness.value = this.properties.Softness.get(e);
        u.Noise_Reduction.value = this.properties.Noise_Reduction.get(e);
        u.Sigma.value = this.properties.Sigma.get(e);
        u.Sigma_Ratio.value = this.properties.Sigma_Ratio.get(e);
        u.Sharpness.value = this.properties.Sharpness.get(e);
        u.Edge_Hardness.value = Math.round(this.properties.Edge_Hardness.get(e));
        u.Detail_Boost.value = this.properties.Detail_Boost.get(e);
        u.Invert_Lines.value = Math.round(this.properties.Invert_Lines.get(e));
        u.Output_Mode.value = Math.round(this.properties.Output_Mode.get(e));
        u.Line_Color.value.set(this.properties.Line_Color.get(e)[0]||0, this.properties.Line_Color.get(e)[1]||0, this.properties.Line_Color.get(e)[2]||0);
        u.Use_Line_Color.value = Math.round(this.properties.Use_Line_Color.get(e));
        u.Background_Color.value.set(this.properties.Background_Color.get(e)[0]||0, this.properties.Background_Color.get(e)[1]||0, this.properties.Background_Color.get(e)[2]||0);
        u.Background_Opacity.value = this.properties.Background_Opacity.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
