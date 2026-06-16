// Change To Color (AlipFX) - Zoidium custom effect
// Source: Change To Color (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/change-to-color.glsl

(this.defaultName = "Change To Color"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Replaces or transforms a chosen color range.",
  }),
  (this.shaderfile = "preset/change-to-color"),
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
    From: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    To: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Change: { dynamic: !0, name: "Change", type: PZ.property.type.OPTION, value: 0, items: "Hue;Hue+Lightness;Hue+Saturation;All" },
    Change_By: { dynamic: !0, name: "Change By", type: PZ.property.type.OPTION, value: 0, items: "Set;Transform" },
    Hue: { dynamic: !0, name: "Hue", type: PZ.property.type.NUMBER, value: 5, step: 0.1 },
    Lightness: { dynamic: !0, name: "Lightness", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Saturation: { dynamic: !0, name: "Saturation", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Softness: { dynamic: !0, name: "Softness", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    View_Correction_Matte: { dynamic: !0, name: "View Correction Matte", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
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
        From: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        To: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Change: { type: "f", value: 0 },
        Change_By: { type: "f", value: 0 },
        Hue: { type: "f", value: 5 },
        Lightness: { type: "f", value: 50 },
        Saturation: { type: "f", value: 50 },
        Softness: { type: "f", value: 50 },
        View_Correction_Matte: { type: "f", value: 0 },
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
    u.From.value.set(this.properties.From.get(e)[0]||0, this.properties.From.get(e)[1]||0, this.properties.From.get(e)[2]||0);
    u.To.value.set(this.properties.To.get(e)[0]||0, this.properties.To.get(e)[1]||0, this.properties.To.get(e)[2]||0);
    u.Change.value = this.properties.Change.get(e);
    u.Change_By.value = this.properties.Change_By.get(e);
    u.Hue.value = this.properties.Hue.get(e);
    u.Lightness.value = this.properties.Lightness.get(e);
    u.Saturation.value = this.properties.Saturation.get(e);
    u.Softness.value = this.properties.Softness.get(e);
    u.View_Correction_Matte.value = this.properties.View_Correction_Matte.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
