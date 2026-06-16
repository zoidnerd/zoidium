// Tint (AlipFX) - Zoidium custom effect
// Source: Tint (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/tint.glsl

(this.defaultName = "Tint"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Two-color gradient tint mapping black and white to colors.",
  }),
  (this.shaderfile = "preset/tint"),
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
    Map_Black_To: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Map_White_To: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Amount_to_Tint: { dynamic: !0, name: "Amount to Tint", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Swap_Colors: { dynamic: !0, name: "Swap Colors", type: PZ.property.type.OPTION, value: 0, step: 1, items: "off;on" },
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
        Map_Black_To: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Map_White_To: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Amount_to_Tint: { type: "f", value: 100 },
        Swap_Colors: { type: "f", value: 0 },
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
    u.Map_Black_To.value.set(this.properties.Map_Black_To.get(e)[0]||0, this.properties.Map_Black_To.get(e)[1]||0, this.properties.Map_Black_To.get(e)[2]||0);
    u.Map_White_To.value.set(this.properties.Map_White_To.get(e)[0]||0, this.properties.Map_White_To.get(e)[1]||0, this.properties.Map_White_To.get(e)[2]||0);
    u.Amount_to_Tint.value = this.properties.Amount_to_Tint.get(e);
    u.Swap_Colors.value = this.properties.Swap_Colors.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
