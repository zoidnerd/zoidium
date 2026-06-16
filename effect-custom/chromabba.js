// ChromAbba (AlipFX) - Zoidium custom effect
// Source: ChromAbba (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/chromabba.glsl

(this.defaultName = "ChromAbba"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Radial chromatic blur with edge attraction and separation.",
  }),
  (this.shaderfile = "preset/chromabba"),
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
    Samples: { dynamic: !0, name: "Samples", type: PZ.property.type.NUMBER, value: 16, step: 0.1 },
    Strength: { dynamic: !0, name: "Strength", type: PZ.property.type.NUMBER, value: 40, step: 0.1 },
    Separation: { dynamic: !0, name: "Separation", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Edge_Attraction_Power: { dynamic: !0, name: "Edge Attraction Power", type: PZ.property.type.NUMBER, value: 4, step: 0.1 },
    Direction: { dynamic: !0, name: "Direction", type: PZ.property.type.OPTION, value: 1, step: 1, items: "Outward;Inward;Symmetric" },
    Edge_Mode: { dynamic: !0, name: "Edge Mode", type: PZ.property.type.OPTION, value: 1, step: 1, items: "Transparent;Mirror;Clamp;Wrap" },
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
        Samples: { type: "f", value: 16 },
        Strength: { type: "f", value: 40 },
        Separation: { type: "f", value: 100 },
        Edge_Attraction_Power: { type: "f", value: 4 },
        Direction: { type: "f", value: 1 },
        Edge_Mode: { type: "f", value: 1 },
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
    u.Samples.value = this.properties.Samples.get(e);
    u.Strength.value = this.properties.Strength.get(e);
    u.Separation.value = this.properties.Separation.get(e);
    u.Edge_Attraction_Power.value = this.properties.Edge_Attraction_Power.get(e);
    u.Direction.value = this.properties.Direction.get(e);
    u.Edge_Mode.value = this.properties.Edge_Mode.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
