// AZ Glass (AlipFX) - Zoidium custom effect
// Source: AZ Glass (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-glass.glsl

(this.defaultName = "AZ Glass"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Image as a height-mapped glass surface with relief lighting.",
  }),
  (this.shaderfile = "preset/az-glass"),
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
    Property: { dynamic: !0, name: "Property", type: PZ.property.type.OPTION, value: 5, step: 1, items: "Red;Green;Blue;Alpha;Luminance;Lightness" },
    Softness: { dynamic: !0, name: "Softness", type: PZ.property.type.NUMBER, value: 2, step: 0.1 },
    Height: { dynamic: !0, name: "Height", type: PZ.property.type.NUMBER, value: 25, step: 0.1 },
    Displacement: { dynamic: !0, name: "Displacement", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
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
        Property: { type: "f", value: 5 },
        Softness: { type: "f", value: 2 },
        Height: { type: "f", value: 25 },
        Displacement: { type: "f", value: 100 },
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
    u.Displacement.value = this.properties.Displacement.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
