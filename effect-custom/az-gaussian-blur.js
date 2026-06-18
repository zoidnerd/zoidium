// Gaussian Blur (AlipFX) - Zoidium custom effect
// Source: Gaussian Blur (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/gaussian-blur.glsl

(this.defaultName = "AZ Gaussian Blur"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Smooth Gaussian blur with adjustable direction.",
  }),
  (this.shaderfile = "preset/az-gaussian-blur"),
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
    Blurriness: { dynamic: !0, name: "Blurriness", type: PZ.property.type.NUMBER, value: 18.49, step: 0.1 },
    Blur_Dimensions: { dynamic: !0, name: "Blur Dimensions", type: PZ.property.type.OPTION, value: 0, items: "Both;Horizontal;Vertical" },
    Repeat_Edge_Pixels: { dynamic: !0, name: "Repeat Edge Pixels", type: PZ.property.type.OPTION, value: 0, items: "Off;On" },
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
        Blurriness: { type: "f", value: 18.49 },
        Blur_Dimensions: { type: "f", value: 0 },
        Repeat_Edge_Pixels: { type: "f", value: 0 },
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
    u.Blurriness.value = this.properties.Blurriness.get(e);
    u.Blur_Dimensions.value = this.properties.Blur_Dimensions.get(e);
    u.Repeat_Edge_Pixels.value = this.properties.Repeat_Edge_Pixels.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
