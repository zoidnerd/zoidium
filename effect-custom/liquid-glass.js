// Liquid Glass (AlipFX) - Zoidium custom effect
// Source: Liquid Glass (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/liquid-glass.glsl

(this.defaultName = "Liquid Glass"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Liquid glass distortion with quality presets and refraction.",
  }),
  (this.shaderfile = "preset/liquid-glass"),
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
    Source_Layer: { dynamic: !0, name: "Source Layer", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Quality: { dynamic: !0, name: "Quality", type: PZ.property.type.OPTION, value: 1, items: "Draft;Standard;High" },
    Strength: { dynamic: !0, name: "Strength", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Scale: { dynamic: !0, name: "Scale", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    IOR: { dynamic: !0, name: "Ior", type: PZ.property.type.NUMBER, value: 1.5, step: 0.1 },
    Thickness: { dynamic: !0, name: "Thickness", type: PZ.property.type.NUMBER, value: 2, step: 0.1 },
    Tint_Color: { dynamic: !0, name: "Tint Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Tint_Opacity: { dynamic: !0, name: "Tint Opacity", type: PZ.property.type.NUMBER, value: 10, step: 0.1 },
    Opacity: { dynamic: !0, name: "Opacity", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Intensity: { dynamic: !0, name: "Intensity", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Softness: { dynamic: !0, name: "Softness", type: PZ.property.type.NUMBER, value: 30, step: 0.1 },
    Edge_Width: { dynamic: !0, name: "Edge Width", type: PZ.property.type.NUMBER, value: 20, step: 0.1 },
    Light_Angle: { dynamic: !0, name: "Light Angle", type: PZ.property.type.NUMBER, value: 135, step: 1.0 },
    Light_Color: { dynamic: !0, name: "Light Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Highlight_Distance: { dynamic: !0, name: "Highlight Distance", type: PZ.property.type.NUMBER, value: 135, step: 1.0 },
    Amount: { dynamic: !0, name: "Amount", type: PZ.property.type.NUMBER, value: 5, step: 0.1 },
    Feather: { dynamic: !0, name: "Feather", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Edge_Blur: { dynamic: !0, name: "Edge Blur", type: PZ.property.type.NUMBER, value: 2, step: 0.1 },
    Feather: { dynamic: !0, name: "Feather", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Enable: { dynamic: !0, name: "Enable", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Shadow_Opacity: { dynamic: !0, name: "Shadow Opacity", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Shadow_Distance: { dynamic: !0, name: "Shadow Distance", type: PZ.property.type.NUMBER, value: 15, step: 0.1 },
    Shadow_Softness: { dynamic: !0, name: "Shadow Softness", type: PZ.property.type.NUMBER, value: 10, step: 0.1 },
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
        Source_Layer: { type: "f", value: 0 },
        Quality: { type: "i", value: 1 },
        Strength: { type: "f", value: 50 },
        Scale: { type: "f", value: 100 },
        IOR: { type: "f", value: 1.5 },
        Thickness: { type: "f", value: 2 },
        Tint_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Tint_Opacity: { type: "f", value: 10 },
        Opacity: { type: "f", value: 100 },
        Intensity: { type: "f", value: 50 },
        Softness: { type: "f", value: 30 },
        Edge_Width: { type: "f", value: 20 },
        Light_Angle: { type: "f", value: 135 },
        Light_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Highlight_Distance: { type: "f", value: 135 },
        Amount: { type: "f", value: 5 },
        Feather: { type: "f", value: 0 },
        Edge_Blur: { type: "f", value: 2 },
        Feather: { type: "f", value: 0 },
        Enable: { type: "f", value: 0 },
        Shadow_Opacity: { type: "f", value: 50 },
        Shadow_Distance: { type: "f", value: 15 },
        Shadow_Softness: { type: "f", value: 10 },
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
        u.Source_Layer.value = this.properties.Source_Layer.get(e);
        u.Quality.value = Math.round(this.properties.Quality.get(e));
        u.Strength.value = this.properties.Strength.get(e);
        u.Scale.value = this.properties.Scale.get(e);
        u.IOR.value = this.properties.IOR.get(e);
        u.Thickness.value = this.properties.Thickness.get(e);
        u.Tint_Color.value.set(this.properties.Tint_Color.get(e)[0]||0, this.properties.Tint_Color.get(e)[1]||0, this.properties.Tint_Color.get(e)[2]||0);
        u.Tint_Opacity.value = this.properties.Tint_Opacity.get(e);
        u.Opacity.value = this.properties.Opacity.get(e);
        u.Intensity.value = this.properties.Intensity.get(e);
        u.Softness.value = this.properties.Softness.get(e);
        u.Edge_Width.value = this.properties.Edge_Width.get(e);
        u.Light_Angle.value = this.properties.Light_Angle.get(e);
        u.Light_Color.value.set(this.properties.Light_Color.get(e)[0]||0, this.properties.Light_Color.get(e)[1]||0, this.properties.Light_Color.get(e)[2]||0);
        u.Highlight_Distance.value = this.properties.Highlight_Distance.get(e);
        u.Amount.value = this.properties.Amount.get(e);
        u.Feather.value = this.properties.Feather.get(e);
        u.Edge_Blur.value = this.properties.Edge_Blur.get(e);
        u.Feather.value = this.properties.Feather.get(e);
        u.Enable.value = this.properties.Enable.get(e);
        u.Shadow_Opacity.value = this.properties.Shadow_Opacity.get(e);
        u.Shadow_Distance.value = this.properties.Shadow_Distance.get(e);
        u.Shadow_Softness.value = this.properties.Shadow_Softness.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
