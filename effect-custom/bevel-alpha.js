// Bevel Alpha (AlipFX) - Zoidium custom effect
// Source: Bevel Alpha (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/bevel-alpha.glsl

(this.defaultName = "Bevel Alpha"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Adds a directional bevel highlight to alpha edges.",
  }),
  (this.shaderfile = "preset/bevel-alpha"),
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
    Edge_Thickness: { dynamic: !0, name: "Edge Thickness", type: PZ.property.type.NUMBER, value: 2, step: 0.1 },
    Light_Angle: { dynamic: !0, name: "Light Angle", type: PZ.property.type.NUMBER, value: -60, step: 0.1 },
    Light_Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Light_Intensity: { dynamic: !0, name: "Light Intensity", type: PZ.property.type.NUMBER, value: 0.4, step: 0.1 },
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
        Edge_Thickness: { type: "f", value: 2 },
        Light_Angle: { type: "f", value: -60 },
        Light_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Light_Intensity: { type: "f", value: 0.4 },
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
    u.Edge_Thickness.value = this.properties.Edge_Thickness.get(e);
    u.Light_Angle.value = this.properties.Light_Angle.get(e);
    u.Light_Color.value.set(this.properties.Light_Color.get(e)[0]||0, this.properties.Light_Color.get(e)[1]||0, this.properties.Light_Color.get(e)[2]||0);
    u.Light_Intensity.value = this.properties.Light_Intensity.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
