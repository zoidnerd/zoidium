// Fast Box Blur (AlipFX) - Zoidium custom effect
// Source: Fast Box Blur (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/fast-box-blur.glsl

(this.defaultName = "Fast Box Blur"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Box blurs the image with optional iterations and edge repeat.",
  }),
  (this.shaderfile = "preset/fast-box-blur"),
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
    Blur_Radius: { dynamic: !0, name: "Blur Radius", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Iterations: { dynamic: !0, name: "Iterations", type: PZ.property.type.NUMBER, value: 3, step: 0.1 },
    Blur_Dimensions: { dynamic: !0, name: "Blur Dimensions", type: PZ.property.type.OPTION, value: 0, items: "Both;Horizontal;Vertical" },
    Repeat_Edge_Pixels: { dynamic: !0, name: "Repeat Edge Pixels", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
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
        Blur_Radius: { type: "f", value: 0 },
        Iterations: { type: "f", value: 3 },
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
    u.Blur_Radius.value = this.properties.Blur_Radius.get(e);
    u.Iterations.value = this.properties.Iterations.get(e);
    u.Blur_Dimensions.value = this.properties.Blur_Dimensions.get(e);
    u.Repeat_Edge_Pixels.value = this.properties.Repeat_Edge_Pixels.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
