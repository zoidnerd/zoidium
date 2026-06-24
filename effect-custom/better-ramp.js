// Better Ramp (AlipFX) - Zoidium custom effect
// Source: Better Ramp (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/better-ramp.glsl

(this.defaultName = "Better Ramp"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Multi-stop color ramp with linear/radial mapping and blend modes.",
  }),
  (this.shaderfile = "preset/better-ramp"),
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
    Start_Point: { dynamic: !0, name: "Start Point", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Start_Color: { dynamic: !0, name: "Start Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Start_Opacity: { dynamic: !0, name: "Start Opacity", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    End_Point: { dynamic: !0, name: "End Point", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    End_Color: { dynamic: !0, name: "End Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    End_Opacity: { dynamic: !0, name: "End Opacity", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Type: { dynamic: !0, name: "Type", type: PZ.property.type.OPTION, value: 0, items: "Linear;Radial" },
    Swap_Colors: { dynamic: !0, name: "Swap Colors", type: PZ.property.type.OPTION, value: 0, items: "Disabled;Enabled" },
    Radial_Highlight_Angle: { dynamic: !0, name: "Radial Highlight Angle", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Radial_Highlight_Length: { dynamic: !0, name: "Radial Highlight Length", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Blend: { dynamic: !0, name: "Blend", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Bias: { dynamic: !0, name: "Bias", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Scatter: { dynamic: !0, name: "Scatter", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Perceptual_Mix: { dynamic: !0, name: "Perceptual Mix", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Blend_Mode: { dynamic: !0, name: "Blend Mode", type: PZ.property.type.OPTION, value: 1, items: "Normal;Dissolve;Darken;Multiply;Color Burn;Linear Burn;Darken Color;Lighten;Screen;Color Dodge;Linear Dodge;Lighten Color" },
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
        Start_Point: { type: "v2", value: new THREE.Vector2(0, 0) },
        Start_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Start_Opacity: { type: "f", value: 1 },
        End_Point: { type: "v2", value: new THREE.Vector2(0, 0) },
        End_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        End_Opacity: { type: "f", value: 1 },
        Type: { type: "i", value: 0 },
        Swap_Colors: { type: "i", value: 0 },
        Radial_Highlight_Angle: { type: "f", value: 0 },
        Radial_Highlight_Length: { type: "f", value: 100 },
        Blend: { type: "f", value: 100 },
        Bias: { type: "f", value: 50 },
        Scatter: { type: "f", value: 0 },
        Perceptual_Mix: { type: "f", value: 100 },
        Blend_Mode: { type: "i", value: 1 },
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
        const _Start_Point = this.properties.Start_Point.get(e); u.Start_Point.value.set(_Start_Point[0]||0, _Start_Point[1]||0);
        u.Start_Color.value.set(this.properties.Start_Color.get(e)[0]||0, this.properties.Start_Color.get(e)[1]||0, this.properties.Start_Color.get(e)[2]||0);
        u.Start_Opacity.value = this.properties.Start_Opacity.get(e);
        const _End_Point = this.properties.End_Point.get(e); u.End_Point.value.set(_End_Point[0]||0, _End_Point[1]||0);
        u.End_Color.value.set(this.properties.End_Color.get(e)[0]||0, this.properties.End_Color.get(e)[1]||0, this.properties.End_Color.get(e)[2]||0);
        u.End_Opacity.value = this.properties.End_Opacity.get(e);
        u.Type.value = Math.round(this.properties.Type.get(e));
        u.Swap_Colors.value = Math.round(this.properties.Swap_Colors.get(e));
        u.Radial_Highlight_Angle.value = this.properties.Radial_Highlight_Angle.get(e);
        u.Radial_Highlight_Length.value = this.properties.Radial_Highlight_Length.get(e);
        u.Blend.value = this.properties.Blend.get(e);
        u.Bias.value = this.properties.Bias.get(e);
        u.Scatter.value = this.properties.Scatter.get(e);
        u.Perceptual_Mix.value = this.properties.Perceptual_Mix.get(e);
        u.Blend_Mode.value = Math.round(this.properties.Blend_Mode.get(e));
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
