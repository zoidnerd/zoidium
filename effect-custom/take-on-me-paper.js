// Take On Me Paper (AlipFX) - Zoidium custom effect
// Source: Take On Me Paper (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/take-on-me-paper.glsl

(this.defaultName = "Take On Me Paper"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Pencil-sketch / paper line-art with hatching overlay.",
  }),
  (this.shaderfile = "preset/take-on-me-paper"),
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
    Hatch_Density: { dynamic: !0, name: "Hatch Density", type: PZ.property.type.NUMBER, value: 0.2, step: 0.1 },
    Outline_Strength: { dynamic: !0, name: "Outline Strength", type: PZ.property.type.NUMBER, value: 2.2, step: 0.1 },
    Shading_Darkness: { dynamic: !0, name: "Shading Darkness", type: PZ.property.type.NUMBER, value: 0.5, step: 0.1 },
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
        Hatch_Density: { type: "f", value: 0.2 },
        Outline_Strength: { type: "f", value: 2.2 },
        Shading_Darkness: { type: "f", value: 0.5 },
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
        u.Hatch_Density.value = this.properties.Hatch_Density.get(e);
        u.Outline_Strength.value = this.properties.Outline_Strength.get(e);
        u.Shading_Darkness.value = this.properties.Shading_Darkness.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
