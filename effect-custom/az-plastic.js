// AZ Plastic (AlipFX) - Zoidium custom effect
// Source: AZ Plastic (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-plastic.glsl

(this.defaultName = "AZ Plastic"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Plastic wrap effect with relief and reflection.",
  }),
  (this.shaderfile = "preset/az-plastic"),
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
    Property: { dynamic: !0, name: "Property", type: PZ.property.type.OPTION, value: 6, step: 1, items: "Red;Green;Blue;Alpha;Luminance;Lightness" },
    Softness: { dynamic: !0, name: "Softness", type: PZ.property.type.NUMBER, value: 123.8, step: 0.1 },
    Height: { dynamic: !0, name: "Height", type: PZ.property.type.NUMBER, value: -6.7, step: 0.1 },
    Cut_Min: { dynamic: !0, name: "Cut Min", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Cut_Max: { dynamic: !0, name: "Cut Max", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
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
        Property: { type: "f", value: 6 },
        Softness: { type: "f", value: 123.8 },
        Height: { type: "f", value: -6.7 },
        Cut_Min: { type: "f", value: 0 },
        Cut_Max: { type: "f", value: 100 },
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
    u.Property.value = this.properties.Property.get(e);
    u.Softness.value = this.properties.Softness.get(e);
    u.Height.value = this.properties.Height.get(e);
    u.Cut_Min.value = this.properties.Cut_Min.get(e);
    u.Cut_Max.value = this.properties.Cut_Max.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
