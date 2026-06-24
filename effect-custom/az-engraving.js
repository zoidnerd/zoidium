// AZ Engraving (AlipFX) - Zoidium custom effect
// Source: Engraving (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-engraving.glsl

(this.defaultName = "AZ Engraving"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Engraved print look with line detection and preset shading.",
  }),
  (this.shaderfile = "preset/az-engraving"),
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
    Preset: { dynamic: !0, name: "Preset", type: PZ.property.type.OPTION, value: 1, items: "Default;Banknote Green;Copperplate;Steel Etching;Carmine Stamp" },
    Ink_Color: { dynamic: !0, name: "Ink Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Paper_Color: { dynamic: !0, name: "Paper Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Pre_Exposure: { dynamic: !0, name: "Pre Exposure", type: PZ.property.type.NUMBER, value: 0.5, step: 0.1 },
    Tone_Contrast: { dynamic: !0, name: "Tone Contrast", type: PZ.property.type.NUMBER, value: 0.7, step: 0.1 },
    Line_Density: { dynamic: !0, name: "Line Density", type: PZ.property.type.NUMBER, value: 3, step: 0.1 },
    Contour_Flow: { dynamic: !0, name: "Contour Flow", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Edge_Etching: { dynamic: !0, name: "Edge Etching", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Wear_Tear: { dynamic: !0, name: "Wear Tear", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
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
        Preset: { type: "i", value: 1 },
        Ink_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Paper_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Pre_Exposure: { type: "f", value: 0.5 },
        Tone_Contrast: { type: "f", value: 0.7 },
        Line_Density: { type: "f", value: 3 },
        Contour_Flow: { type: "f", value: 1 },
        Edge_Etching: { type: "f", value: 0 },
        Wear_Tear: { type: "f", value: 0 },
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
        u.Preset.value = Math.round(this.properties.Preset.get(e));
        u.Ink_Color.value.set(this.properties.Ink_Color.get(e)[0]||0, this.properties.Ink_Color.get(e)[1]||0, this.properties.Ink_Color.get(e)[2]||0);
        u.Paper_Color.value.set(this.properties.Paper_Color.get(e)[0]||0, this.properties.Paper_Color.get(e)[1]||0, this.properties.Paper_Color.get(e)[2]||0);
        u.Pre_Exposure.value = this.properties.Pre_Exposure.get(e);
        u.Tone_Contrast.value = this.properties.Tone_Contrast.get(e);
        u.Line_Density.value = this.properties.Line_Density.get(e);
        u.Contour_Flow.value = this.properties.Contour_Flow.get(e);
        u.Edge_Etching.value = this.properties.Edge_Etching.get(e);
        u.Wear_Tear.value = this.properties.Wear_Tear.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
