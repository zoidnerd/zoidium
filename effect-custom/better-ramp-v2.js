// Better Ramp V2 (AlipFX) - Zoidium custom effect
// Source: Better Ramp V2 (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/better-ramp-v2.glsl

(this.defaultName = "Better Ramp V2"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Advanced multi-stop color ramp with offset, warp, scatter, and blend controls.",
  }),
  (this.shaderfile = "preset/better-ramp-v2"),
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
    Type: { dynamic: !0, name: "Type", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Color_1: { dynamic: !0, name: "Color 1", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_2: { dynamic: !0, name: "Color 2", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_3: { dynamic: !0, name: "Color 3", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_4: { dynamic: !0, name: "Color 4", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_5: { dynamic: !0, name: "Color 5", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_6: { dynamic: !0, name: "Color 6", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_7: { dynamic: !0, name: "Color 7", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_8: { dynamic: !0, name: "Color 8", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Gradient_Colors: { dynamic: !0, name: "Gradient Colors", type: PZ.property.type.NUMBER, value: 4, step: 0.1 },
    Start_Point: { dynamic: !0, name: "Start Point", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    End_Point: { dynamic: !0, name: "End Point", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Reverse: { dynamic: !0, name: "Reverse", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Radial_Highlight_Angle: { dynamic: !0, name: "Radial Highlight Angle", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Radial_Highlight_Length: { dynamic: !0, name: "Radial Highlight Length", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Offset: { dynamic: !0, name: "Offset", type: PZ.property.type.NUMBER, value: -45, step: 0.1 },
    Warp_Blend: { dynamic: !0, name: "Warp Blend", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Scatter: { dynamic: !0, name: "Scatter", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Blend_Mode: { dynamic: !0, name: "Blend Mode", type: PZ.property.type.OPTION, value: 0, items: "None;Normal;Screen;Add;Multiply;Overlay;Soft Light;Hard Light;Color Dodge;Color Burn;Darken;Lighten;Difference;Exclusion" },
    Blend_Opacity: { dynamic: !0, name: "Blend Opacity", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
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
        Type: { type: "f", value: 1 },
        Color_1: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_2: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_3: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_4: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_5: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_6: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_7: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_8: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Gradient_Colors: { type: "f", value: 4 },
        Start_Point: { type: "v2", value: new THREE.Vector2(0, 0) },
        End_Point: { type: "v2", value: new THREE.Vector2(0, 0) },
        Reverse: { type: "f", value: 0 },
        Radial_Highlight_Angle: { type: "f", value: 0 },
        Radial_Highlight_Length: { type: "f", value: 0 },
        Offset: { type: "f", value: -45 },
        Warp_Blend: { type: "f", value: 0 },
        Scatter: { type: "f", value: 0 },
        Blend_Mode: { type: "i", value: 0 },
        Blend_Opacity: { type: "f", value: 100 },
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
        u.Type.value = this.properties.Type.get(e);
        u.Color_1.value.set(this.properties.Color_1.get(e)[0]||0, this.properties.Color_1.get(e)[1]||0, this.properties.Color_1.get(e)[2]||0);
        u.Color_2.value.set(this.properties.Color_2.get(e)[0]||0, this.properties.Color_2.get(e)[1]||0, this.properties.Color_2.get(e)[2]||0);
        u.Color_3.value.set(this.properties.Color_3.get(e)[0]||0, this.properties.Color_3.get(e)[1]||0, this.properties.Color_3.get(e)[2]||0);
        u.Color_4.value.set(this.properties.Color_4.get(e)[0]||0, this.properties.Color_4.get(e)[1]||0, this.properties.Color_4.get(e)[2]||0);
        u.Color_5.value.set(this.properties.Color_5.get(e)[0]||0, this.properties.Color_5.get(e)[1]||0, this.properties.Color_5.get(e)[2]||0);
        u.Color_6.value.set(this.properties.Color_6.get(e)[0]||0, this.properties.Color_6.get(e)[1]||0, this.properties.Color_6.get(e)[2]||0);
        u.Color_7.value.set(this.properties.Color_7.get(e)[0]||0, this.properties.Color_7.get(e)[1]||0, this.properties.Color_7.get(e)[2]||0);
        u.Color_8.value.set(this.properties.Color_8.get(e)[0]||0, this.properties.Color_8.get(e)[1]||0, this.properties.Color_8.get(e)[2]||0);
        u.Gradient_Colors.value = this.properties.Gradient_Colors.get(e);
        const _Start_Point = this.properties.Start_Point.get(e); u.Start_Point.value.set(_Start_Point[0]||0, _Start_Point[1]||0);
        const _End_Point = this.properties.End_Point.get(e); u.End_Point.value.set(_End_Point[0]||0, _End_Point[1]||0);
        u.Reverse.value = this.properties.Reverse.get(e);
        u.Radial_Highlight_Angle.value = this.properties.Radial_Highlight_Angle.get(e);
        u.Radial_Highlight_Length.value = this.properties.Radial_Highlight_Length.get(e);
        u.Offset.value = this.properties.Offset.get(e);
        u.Warp_Blend.value = this.properties.Warp_Blend.get(e);
        u.Scatter.value = this.properties.Scatter.get(e);
        u.Blend_Mode.value = Math.round(this.properties.Blend_Mode.get(e));
        u.Blend_Opacity.value = this.properties.Blend_Opacity.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
