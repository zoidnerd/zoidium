// Change Color (AlipFX) - Zoidium custom effect
// Source: Change Color (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/change-color.glsl

(this.defaultName = "Change Color"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Shifts HSL of pixels matching a chosen color.",
  }),
  (this.shaderfile = "preset/change-color"),
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
    View: { dynamic: !0, name: "View", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Result;Mask" },
    Hue_Transform: { dynamic: !0, name: "Hue Transform", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Saturation_Transform: { dynamic: !0, name: "Saturation Transform", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Lightness_Transform: { dynamic: !0, name: "Lightness Transform", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Color_To_Change: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Matching_Tolerance: { dynamic: !0, name: "Matching Tolerance", type: PZ.property.type.NUMBER, value: 15, step: 0.1 },
    Matching_Softness: { dynamic: !0, name: "Matching Softness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Match_Colors: { dynamic: !0, name: "Match Colors", type: PZ.property.type.OPTION, value: 0, step: 1, items: "RGB;Hue;Chroma" },
    Invert_Color_Correction: { dynamic: !0, name: "Invert Color Correction", type: PZ.property.type.OPTION, value: 0, step: 1, items: "off;on" },
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
        View: { type: "f", value: 0 },
        Hue_Transform: { type: "f", value: 0 },
        Saturation_Transform: { type: "f", value: 0 },
        Lightness_Transform: { type: "f", value: 0 },
        Color_To_Change: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Matching_Tolerance: { type: "f", value: 15 },
        Matching_Softness: { type: "f", value: 0 },
        Match_Colors: { type: "f", value: 0 },
        Invert_Color_Correction: { type: "f", value: 0 },
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
    u.View.value = this.properties.View.get(e);
    u.Hue_Transform.value = this.properties.Hue_Transform.get(e);
    u.Saturation_Transform.value = this.properties.Saturation_Transform.get(e);
    u.Lightness_Transform.value = this.properties.Lightness_Transform.get(e);
    u.Color_To_Change.value.set(this.properties.Color_To_Change.get(e)[0]||0, this.properties.Color_To_Change.get(e)[1]||0, this.properties.Color_To_Change.get(e)[2]||0);
    u.Matching_Tolerance.value = this.properties.Matching_Tolerance.get(e);
    u.Matching_Softness.value = this.properties.Matching_Softness.get(e);
    u.Match_Colors.value = this.properties.Match_Colors.get(e);
    u.Invert_Color_Correction.value = this.properties.Invert_Color_Correction.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
