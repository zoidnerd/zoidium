// Cartoon (AlipFX) - Zoidium custom effect
// Source: Cartoon (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/cartoon.glsl

(this.defaultName = "Cartoon"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Cel-shaded cartoon look with posterized edges.",
  }),
  (this.shaderfile = "preset/cartoon"),
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
    Render: { dynamic: !0, name: "Render", type: PZ.property.type.OPTION, value: 0, items: "Fill;Edges;Fill and Edges" },
    Detail_Radius: { dynamic: !0, name: "Detail Radius", type: PZ.property.type.NUMBER, value: 8, step: 0.1 },
    Detail_Threshold: { dynamic: !0, name: "Detail Threshold", type: PZ.property.type.NUMBER, value: 10, step: 0.1 },
    Shading_Steps: { dynamic: !0, name: "Shading Steps", type: PZ.property.type.NUMBER, value: 8, step: 0.1 },
    Shading_Smoothness: { dynamic: !0, name: "Shading Smoothness", type: PZ.property.type.NUMBER, value: 70, step: 0.1 },
    Threshold: { dynamic: !0, name: "Threshold", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Width: { dynamic: !0, name: "Width", type: PZ.property.type.NUMBER, value: 1.5, step: 0.1 },
    Softness: { dynamic: !0, name: "Softness", type: PZ.property.type.NUMBER, value: 60, step: 0.1 },
    Opacity: { dynamic: !0, name: "Opacity", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Edge_Enhancement: { dynamic: !0, name: "Edge Enhancement", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Edge_Black_Level: { dynamic: !0, name: "Edge Black Level", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Edge_Contrast: { dynamic: !0, name: "Edge Contrast", type: PZ.property.type.NUMBER, value: 0.62, step: 0.1 },
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
        Render: { type: "f", value: 0 },
        Detail_Radius: { type: "f", value: 8 },
        Detail_Threshold: { type: "f", value: 10 },
        Shading_Steps: { type: "f", value: 8 },
        Shading_Smoothness: { type: "f", value: 70 },
        Threshold: { type: "f", value: 1 },
        Width: { type: "f", value: 1.5 },
        Softness: { type: "f", value: 60 },
        Opacity: { type: "f", value: 100 },
        Edge_Enhancement: { type: "f", value: 1 },
        Edge_Black_Level: { type: "f", value: 0 },
        Edge_Contrast: { type: "f", value: 0.62 },
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
    u.Render.value = this.properties.Render.get(e);
    u.Detail_Radius.value = this.properties.Detail_Radius.get(e);
    u.Detail_Threshold.value = this.properties.Detail_Threshold.get(e);
    u.Shading_Steps.value = this.properties.Shading_Steps.get(e);
    u.Shading_Smoothness.value = this.properties.Shading_Smoothness.get(e);
    u.Threshold.value = this.properties.Threshold.get(e);
    u.Width.value = this.properties.Width.get(e);
    u.Softness.value = this.properties.Softness.get(e);
    u.Opacity.value = this.properties.Opacity.get(e);
    u.Edge_Enhancement.value = this.properties.Edge_Enhancement.get(e);
    u.Edge_Black_Level.value = this.properties.Edge_Black_Level.get(e);
    u.Edge_Contrast.value = this.properties.Edge_Contrast.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
