// AZ Cross Blur (AlipFX) - Zoidium custom effect
// Source: AZ Cross Blur (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-cross-blur.glsl

(this.defaultName = "AZ Cross Blur"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Separable X/Y Gaussian blur with blend transfer mode.",
  }),
  (this.shaderfile = "preset/az-cross-blur"),
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
    RadiusX: { dynamic: !0, name: "RadiusX", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    RadiusY: { dynamic: !0, name: "RadiusY", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Transfer_Mode: { dynamic: !0, name: "Transfer Mode", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Average;Add;Screen;Multiply;Lighten;Darken" },
    Repeat_Edge_Pixels: { dynamic: !0, name: "Repeat Edge Pixels", type: PZ.property.type.OPTION, value: 0, step: 1, items: "off;on" },
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
        RadiusX: { type: "f", value: 0 },
        RadiusY: { type: "f", value: 0 },
        Transfer_Mode: { type: "i", value: 0 },
        Repeat_Edge_Pixels: { type: "i", value: 0 },
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
    u.RadiusX.value = this.properties.RadiusX.get(e);
    u.RadiusY.value = this.properties.RadiusY.get(e);
    u.Transfer_Mode.value = Math.round(this.properties.Transfer_Mode.get(e));
    u.Repeat_Edge_Pixels.value = Math.round(this.properties.Repeat_Edge_Pixels.get(e));
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
