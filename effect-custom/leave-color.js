// Leave Color (AlipFX) - Zoidium custom effect
// Source: Leave Color (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/leave-color.glsl

(this.defaultName = "Leave Color"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Desaturate image, keeping one target color.",
  }),
  (this.shaderfile = "preset/leave-color"),
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
    Amount_to_Decolor: { dynamic: !0, name: "Amount to Decolor", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Color_To_Leave: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Tolerance: { dynamic: !0, name: "Tolerance", type: PZ.property.type.NUMBER, value: 15, step: 0.1 },
    Edge_Softness: { dynamic: !0, name: "Edge Softness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Match_Colors: { dynamic: !0, name: "Match Colors", type: PZ.property.type.OPTION, value: 0, items: "RGB;Hue" },
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
        Amount_to_Decolor: { type: "f", value: 0 },
        Color_To_Leave: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Tolerance: { type: "f", value: 15 },
        Edge_Softness: { type: "f", value: 0 },
        Match_Colors: { type: "f", value: 0 },
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
    u.Amount_to_Decolor.value = this.properties.Amount_to_Decolor.get(e);
    u.Color_To_Leave.value.set(this.properties.Color_To_Leave.get(e)[0]||0, this.properties.Color_To_Leave.get(e)[1]||0, this.properties.Color_To_Leave.get(e)[2]||0);
    u.Tolerance.value = this.properties.Tolerance.get(e);
    u.Edge_Softness.value = this.properties.Edge_Softness.get(e);
    u.Match_Colors.value = this.properties.Match_Colors.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
