// AZ Glasswork (AlipFX) - Zoidium custom effect
// Source: Glasswork (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-glasswork.glsl

(this.defaultName = "AZ Glasswork"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Glass refraction with chromatic aberration and edge highlights.",
  }),
  (this.shaderfile = "preset/az-glasswork"),
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
    Pattern_Type: { dynamic: !0, name: "Pattern Type", type: PZ.property.type.OPTION, value: 2, items: "Strips;ZigZag;Rhombuses;Waves" },
    Show_Pattern: { dynamic: !0, name: "Show Pattern", type: PZ.property.type.OPTION, value: 0, items: "Disabled;Enabled" },
    X_Displacement: { dynamic: !0, name: "X Displacement", type: PZ.property.type.NUMBER, value: 5, step: 0.1 },
    Y_Displacement: { dynamic: !0, name: "Y Displacement", type: PZ.property.type.NUMBER, value: 2.5, step: 0.1 },
    Pattern_Smoothness: { dynamic: !0, name: "Pattern Smoothness", type: PZ.property.type.NUMBER, value: 92.9, step: 0.1 },
    Pattern_Size: { dynamic: !0, name: "Pattern Size", type: PZ.property.type.NUMBER, value: 12.2, step: 0.1 },
    Pattern_Angle: { dynamic: !0, name: "Pattern Angle", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Pattern_Position: { dynamic: !0, name: "Pattern Position", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Blur_Samples: { dynamic: !0, name: "Blur Samples", type: PZ.property.type.NUMBER, value: 8, step: 0.1 },
    Bluriness: { dynamic: !0, name: "Bluriness", type: PZ.property.type.NUMBER, value: 10, step: 0.1 },
    Frostiness: { dynamic: !0, name: "Frostiness", type: PZ.property.type.NUMBER, value: 40, step: 0.1 },
    Frost_Scale: { dynamic: !0, name: "Frost Scale", type: PZ.property.type.NUMBER, value: 0.5, step: 0.1 },
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
        Pattern_Type: { type: "i", value: 2 },
        Show_Pattern: { type: "i", value: 0 },
        X_Displacement: { type: "f", value: 5 },
        Y_Displacement: { type: "f", value: 2.5 },
        Pattern_Smoothness: { type: "f", value: 92.9 },
        Pattern_Size: { type: "f", value: 12.2 },
        Pattern_Angle: { type: "f", value: 0 },
        Pattern_Position: { type: "v2", value: new THREE.Vector2(0, 0) },
        Blur_Samples: { type: "f", value: 8 },
        Bluriness: { type: "f", value: 10 },
        Frostiness: { type: "f", value: 40 },
        Frost_Scale: { type: "f", value: 0.5 },
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
        u.Pattern_Type.value = Math.round(this.properties.Pattern_Type.get(e));
        u.Show_Pattern.value = Math.round(this.properties.Show_Pattern.get(e));
        u.X_Displacement.value = this.properties.X_Displacement.get(e);
        u.Y_Displacement.value = this.properties.Y_Displacement.get(e);
        u.Pattern_Smoothness.value = this.properties.Pattern_Smoothness.get(e);
        u.Pattern_Size.value = this.properties.Pattern_Size.get(e);
        u.Pattern_Angle.value = this.properties.Pattern_Angle.get(e);
        const _Pattern_Position = this.properties.Pattern_Position.get(e); u.Pattern_Position.value.set(_Pattern_Position[0]||0, _Pattern_Position[1]||0);
        u.Blur_Samples.value = this.properties.Blur_Samples.get(e);
        u.Bluriness.value = this.properties.Bluriness.get(e);
        u.Frostiness.value = this.properties.Frostiness.get(e);
        u.Frost_Scale.value = this.properties.Frost_Scale.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
