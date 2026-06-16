// AZ Vector Blur (AlipFX) - Zoidium custom effect
// Source: AZ Vector Blur (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-vector-blur.glsl

(this.defaultName = "AZ Vector Blur"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Directional blur driven by image property map.",
  }),
  (this.shaderfile = "preset/az-vector-blur"),
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
    Type: { dynamic: !0, name: "Type", type: PZ.property.type.OPTION, value: 4, items: "Natural;Constant Length;Perpendicular;Direction Center;Direction Fading" },
    Amount: { dynamic: !0, name: "Amount", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Angle_Offset: { dynamic: !0, name: "Angle Offset", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Ridge_Smoothness: { dynamic: !0, name: "Ridge Smoothness", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Revolutions: { dynamic: !0, name: "Revolutions", type: PZ.property.type.NUMBER, value: 2.5, step: 0.1 },
    Property: { dynamic: !0, name: "Property", type: PZ.property.type.OPTION, value: 5, items: "Red;Green;Blue;Alpha;Luminance;Lightness;Hue;Saturation" },
    Map_Softness: { dynamic: !0, name: "Map Softness", type: PZ.property.type.NUMBER, value: 150, step: 0.1 },
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
        Type: { type: "i", value: 4 },
        Amount: { type: "f", value: 100 },
        Angle_Offset: { type: "f", value: 0 },
        Ridge_Smoothness: { type: "f", value: 1 },
        Revolutions: { type: "f", value: 2.5 },
        Property: { type: "i", value: 5 },
        Map_Softness: { type: "f", value: 150 },
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
    u.Type.value = Math.round(this.properties.Type.get(e));
    u.Amount.value = this.properties.Amount.get(e);
    u.Angle_Offset.value = this.properties.Angle_Offset.get(e);
    u.Ridge_Smoothness.value = this.properties.Ridge_Smoothness.get(e);
    u.Revolutions.value = this.properties.Revolutions.get(e);
    u.Property.value = Math.round(this.properties.Property.get(e));
    u.Map_Softness.value = this.properties.Map_Softness.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
