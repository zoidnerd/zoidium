// Mosaic (AlipFX) - Zoidium custom effect
// Source: Mosaic (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/mosaic.glsl

(this.defaultName = "Mosaic"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Pixelates image into uniform mosaic blocks.",
  }),
  (this.shaderfile = "preset/mosaic"),
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
    Horizontal_Blocks: { dynamic: !0, name: "Horizontal Blocks", type: PZ.property.type.NUMBER, value: 10, step: 0.1 },
    Vertical_Blocks: { dynamic: !0, name: "Vertical Blocks", type: PZ.property.type.NUMBER, value: 10, step: 0.1 },
    Sharp_Colors: { dynamic: !0, name: "Sharp Colors", type: PZ.property.type.OPTION, value: 0, items: "off;on", step: 1 },
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
        Horizontal_Blocks: { type: "f", value: 10 },
        Vertical_Blocks: { type: "f", value: 10 },
        Sharp_Colors: { type: "f", value: 0 },
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
    u.Horizontal_Blocks.value = this.properties.Horizontal_Blocks.get(e);
    u.Vertical_Blocks.value = this.properties.Vertical_Blocks.get(e);
    u.Sharp_Colors.value = this.properties.Sharp_Colors.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
