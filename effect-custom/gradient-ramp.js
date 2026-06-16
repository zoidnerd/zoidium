// Gradient Ramp (AlipFX) - Zoidium custom effect
// Source: Gradient Ramp (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/gradient-ramp.glsl

(this.defaultName = "Gradient Ramp"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Two-color linear or radial gradient ramp.",
  }),
  (this.shaderfile = "preset/gradient-ramp"),
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
    Start_of_Ramp: { dynamic: !0, name: "Start of Ramp", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Start_Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    End_of_Ramp: { dynamic: !0, name: "End of Ramp", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    End_Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Ramp_Shape: { dynamic: !0, name: "Ramp Shape", type: PZ.property.type.OPTION, value: 0, items: "Linear;Radial" },
    Ramp_Scatter: { dynamic: !0, name: "Ramp Scatter", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Blend_With_Original: { dynamic: !0, name: "Blend With Original", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Swap_Colors: { dynamic: !0, name: "Swap Colors", type: PZ.property.type.OPTION, value: 0, items: "No;Yes" },
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
        Start_of_Ramp: { type: "v2", value: new THREE.Vector2(0, 0) },
        Start_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        End_of_Ramp: { type: "v2", value: new THREE.Vector2(0, 0) },
        End_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Ramp_Shape: { type: "i", value: 0 },
        Ramp_Scatter: { type: "f", value: 0 },
        Blend_With_Original: { type: "f", value: 0 },
        Swap_Colors: { type: "i", value: 0 },
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
    const _Start_of_Ramp = this.properties.Start_of_Ramp.get(e); u.Start_of_Ramp.value.set(_Start_of_Ramp[0]||0, _Start_of_Ramp[1]||0);
    u.Start_Color.value.set(this.properties.Start_Color.get(e)[0]||0, this.properties.Start_Color.get(e)[1]||0, this.properties.Start_Color.get(e)[2]||0);
    const _End_of_Ramp = this.properties.End_of_Ramp.get(e); u.End_of_Ramp.value.set(_End_of_Ramp[0]||0, _End_of_Ramp[1]||0);
    u.End_Color.value.set(this.properties.End_Color.get(e)[0]||0, this.properties.End_Color.get(e)[1]||0, this.properties.End_Color.get(e)[2]||0);
    u.Ramp_Shape.value = Math.round(this.properties.Ramp_Shape.get(e));
    u.Ramp_Scatter.value = this.properties.Ramp_Scatter.get(e);
    u.Blend_With_Original.value = this.properties.Blend_With_Original.get(e);
    u.Swap_Colors.value = Math.round(this.properties.Swap_Colors.get(e));
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
