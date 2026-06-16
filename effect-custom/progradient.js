// proGradient (AlipFX) - Zoidium custom effect
// Source: ProGradient (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/progradient.glsl

(this.defaultName = "proGradient"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Multi-color gradient with shape, edge, stripes.",
  }),
  (this.shaderfile = "preset/progradient"),
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
    Gradient_Type: { dynamic: !0, name: "Gradient Type", type: PZ.property.type.OPTION, value: 3, items: "Linear;Radial;Angular;Diamond;Alpha Edge", step: 1 },
    Magnet_Perpendicular: { dynamic: !0, name: "Magnet Perpendicular", type: PZ.property.type.OPTION, value: 0, items: "off;on", step: 1 },
    Transparent_After_Max_Length: { dynamic: !0, name: "Transparent After Max Length", type: PZ.property.type.OPTION, value: 1, items: "off;on", step: 1 },
    Max_Length: { dynamic: !0, name: "Max Length", type: PZ.property.type.NUMBER, value: 0.58, step: 0.1 },
    Gradient_Color_Space: { dynamic: !0, name: "Gradient Color Space", type: PZ.property.type.OPTION, value: 2, items: "RGB;OKLab;LCh", step: 1 },
    Gradient_Hue_Interpolation: { dynamic: !0, name: "Gradient Hue Interpolation", type: PZ.property.type.OPTION, value: 0, items: "Shorter;Longer;Increasing;Decreasing", step: 1 },
    Color_1: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_2: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_3: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_4: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_5: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_6: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_7: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_8: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Gradient_Colors: { dynamic: !0, name: "Gradient Colors", type: PZ.property.type.NUMBER, value: 8, step: 0.1 },
    Gradient_Offset: { dynamic: !0, name: "Gradient Offset", type: PZ.property.type.NUMBER, value: 16.35, step: 0.1 },
    Gradient_Scale: { dynamic: !0, name: "Gradient Scale", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Gradient_Loop: { dynamic: !0, name: "Gradient Loop", type: PZ.property.type.OPTION, value: 1, items: "off;on", step: 1 },
    Gradient_Reflect: { dynamic: !0, name: "Gradient Reflect", type: PZ.property.type.OPTION, value: 1, items: "off;on", step: 1 },
    Gradient_Invert: { dynamic: !0, name: "Gradient Invert", type: PZ.property.type.OPTION, value: 0, items: "off;on", step: 1 },
    Scattering_Value: { dynamic: !0, name: "Scattering Value", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Scattering_Fix_Loop_Edge: { dynamic: !0, name: "Scattering Fix Loop Edge", type: PZ.property.type.OPTION, value: 1, items: "off;on", step: 1 },
    Scattering_Seed: { dynamic: !0, name: "Scattering Seed", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Stripes_Enabled: { dynamic: !0, name: "Stripes Enabled", type: PZ.property.type.OPTION, value: 1, items: "off;on", step: 1 },
    Stripes_Max_Offset: { dynamic: !0, name: "Stripes Max Offset", type: PZ.property.type.NUMBER, value: 5, step: 0.1 },
    Stripes_Perpendicular_Offset: { dynamic: !0, name: "Stripes Perpendicular Offset", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Stripes_Width: { dynamic: !0, name: "Stripes Width", type: PZ.property.type.NUMBER, value: 10, step: 0.1 },
    Stripes_Seed: { dynamic: !0, name: "Stripes Seed", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Opacity_Left: { dynamic: !0, name: "Opacity Left", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Opacity_Right: { dynamic: !0, name: "Opacity Right", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Opacity_Offset: { dynamic: !0, name: "Opacity Offset", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Opacity_Scale: { dynamic: !0, name: "Opacity Scale", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Opacity_Loop: { dynamic: !0, name: "Opacity Loop", type: PZ.property.type.OPTION, value: 0, items: "off;on", step: 1 },
    Definition_Mode: { dynamic: !0, name: "Definition Mode", type: PZ.property.type.OPTION, value: 1, items: "Start/End;Center/Angle", step: 1 },
    Start: { dynamic: !0, name: "Start", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    End: { dynamic: !0, name: "End", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Start_Part: { dynamic: !0, name: "Start Part", type: PZ.property.type.NUMBER, value: 0.28, step: 0.1 },
    End_Part: { dynamic: !0, name: "End Part", type: PZ.property.type.NUMBER, value: 0.77, step: 0.1 },
    Angle: { dynamic: !0, name: "Angle", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Center_X_Part: { dynamic: !0, name: "Center X Part", type: PZ.property.type.NUMBER, value: 0.5, step: 0.1 },
    Center_Y_Part: { dynamic: !0, name: "Center Y Part", type: PZ.property.type.NUMBER, value: 0.5, step: 0.1 },
    Radius_Part: { dynamic: !0, name: "Radius Part", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Start_Angle: { dynamic: !0, name: "Start Angle", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Color_Mode: { dynamic: !0, name: "Color Mode", type: PZ.property.type.OPTION, value: 0, items: "Overwrite;Add;Multiply", step: 1 },
    Opacity_Mode: { dynamic: !0, name: "Opacity Mode", type: PZ.property.type.OPTION, value: 1, items: "Replace;Multiply", step: 1 },
    Anti_Aliasing: { dynamic: !0, name: "Anti Aliasing", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
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
        Gradient_Type: { type: "f", value: 3 },
        Magnet_Perpendicular: { type: "f", value: 0 },
        Transparent_After_Max_Length: { type: "f", value: 1 },
        Max_Length: { type: "f", value: 0.58 },
        Gradient_Color_Space: { type: "f", value: 2 },
        Gradient_Hue_Interpolation: { type: "f", value: 0 },
        Color_1: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_2: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_3: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_4: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_5: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_6: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_7: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_8: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Gradient_Colors: { type: "f", value: 8 },
        Gradient_Offset: { type: "f", value: 16.35 },
        Gradient_Scale: { type: "f", value: 1 },
        Gradient_Loop: { type: "f", value: 1 },
        Gradient_Reflect: { type: "f", value: 1 },
        Gradient_Invert: { type: "f", value: 0 },
        Scattering_Value: { type: "f", value: 0 },
        Scattering_Fix_Loop_Edge: { type: "f", value: 1 },
        Scattering_Seed: { type: "f", value: 0 },
        Stripes_Enabled: { type: "f", value: 1 },
        Stripes_Max_Offset: { type: "f", value: 5 },
        Stripes_Perpendicular_Offset: { type: "f", value: 0 },
        Stripes_Width: { type: "f", value: 10 },
        Stripes_Seed: { type: "f", value: 0 },
        Opacity_Left: { type: "f", value: 1 },
        Opacity_Right: { type: "f", value: 1 },
        Opacity_Offset: { type: "f", value: 0 },
        Opacity_Scale: { type: "f", value: 1 },
        Opacity_Loop: { type: "f", value: 0 },
        Definition_Mode: { type: "f", value: 1 },
        Start: { type: "v2", value: new THREE.Vector2(0, 0) },
        End: { type: "v2", value: new THREE.Vector2(0, 0) },
        Start_Part: { type: "f", value: 0.28 },
        End_Part: { type: "f", value: 0.77 },
        Angle: { type: "f", value: 0 },
        Center_X_Part: { type: "f", value: 0.5 },
        Center_Y_Part: { type: "f", value: 0.5 },
        Radius_Part: { type: "f", value: 1 },
        Start_Angle: { type: "f", value: 0 },
        Color_Mode: { type: "f", value: 0 },
        Opacity_Mode: { type: "f", value: 1 },
        Anti_Aliasing: { type: "f", value: 1 },
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
    u.Gradient_Type.value = this.properties.Gradient_Type.get(e);
    u.Magnet_Perpendicular.value = this.properties.Magnet_Perpendicular.get(e);
    u.Transparent_After_Max_Length.value = this.properties.Transparent_After_Max_Length.get(e);
    u.Max_Length.value = this.properties.Max_Length.get(e);
    u.Gradient_Color_Space.value = this.properties.Gradient_Color_Space.get(e);
    u.Gradient_Hue_Interpolation.value = this.properties.Gradient_Hue_Interpolation.get(e);
    u.Color_1.value.set(this.properties.Color_1.get(e)[0]||0, this.properties.Color_1.get(e)[1]||0, this.properties.Color_1.get(e)[2]||0);
    u.Color_2.value.set(this.properties.Color_2.get(e)[0]||0, this.properties.Color_2.get(e)[1]||0, this.properties.Color_2.get(e)[2]||0);
    u.Color_3.value.set(this.properties.Color_3.get(e)[0]||0, this.properties.Color_3.get(e)[1]||0, this.properties.Color_3.get(e)[2]||0);
    u.Color_4.value.set(this.properties.Color_4.get(e)[0]||0, this.properties.Color_4.get(e)[1]||0, this.properties.Color_4.get(e)[2]||0);
    u.Color_5.value.set(this.properties.Color_5.get(e)[0]||0, this.properties.Color_5.get(e)[1]||0, this.properties.Color_5.get(e)[2]||0);
    u.Color_6.value.set(this.properties.Color_6.get(e)[0]||0, this.properties.Color_6.get(e)[1]||0, this.properties.Color_6.get(e)[2]||0);
    u.Color_7.value.set(this.properties.Color_7.get(e)[0]||0, this.properties.Color_7.get(e)[1]||0, this.properties.Color_7.get(e)[2]||0);
    u.Color_8.value.set(this.properties.Color_8.get(e)[0]||0, this.properties.Color_8.get(e)[1]||0, this.properties.Color_8.get(e)[2]||0);
    u.Gradient_Colors.value = this.properties.Gradient_Colors.get(e);
    u.Gradient_Offset.value = this.properties.Gradient_Offset.get(e);
    u.Gradient_Scale.value = this.properties.Gradient_Scale.get(e);
    u.Gradient_Loop.value = this.properties.Gradient_Loop.get(e);
    u.Gradient_Reflect.value = this.properties.Gradient_Reflect.get(e);
    u.Gradient_Invert.value = this.properties.Gradient_Invert.get(e);
    u.Scattering_Value.value = this.properties.Scattering_Value.get(e);
    u.Scattering_Fix_Loop_Edge.value = this.properties.Scattering_Fix_Loop_Edge.get(e);
    u.Scattering_Seed.value = this.properties.Scattering_Seed.get(e);
    u.Stripes_Enabled.value = this.properties.Stripes_Enabled.get(e);
    u.Stripes_Max_Offset.value = this.properties.Stripes_Max_Offset.get(e);
    u.Stripes_Perpendicular_Offset.value = this.properties.Stripes_Perpendicular_Offset.get(e);
    u.Stripes_Width.value = this.properties.Stripes_Width.get(e);
    u.Stripes_Seed.value = this.properties.Stripes_Seed.get(e);
    u.Opacity_Left.value = this.properties.Opacity_Left.get(e);
    u.Opacity_Right.value = this.properties.Opacity_Right.get(e);
    u.Opacity_Offset.value = this.properties.Opacity_Offset.get(e);
    u.Opacity_Scale.value = this.properties.Opacity_Scale.get(e);
    u.Opacity_Loop.value = this.properties.Opacity_Loop.get(e);
    u.Definition_Mode.value = this.properties.Definition_Mode.get(e);
    const _Start = this.properties.Start.get(e); u.Start.value.set(_Start[0]||0, _Start[1]||0);
    const _End = this.properties.End.get(e); u.End.value.set(_End[0]||0, _End[1]||0);
    u.Start_Part.value = this.properties.Start_Part.get(e);
    u.End_Part.value = this.properties.End_Part.get(e);
    u.Angle.value = this.properties.Angle.get(e);
    u.Center_X_Part.value = this.properties.Center_X_Part.get(e);
    u.Center_Y_Part.value = this.properties.Center_Y_Part.get(e);
    u.Radius_Part.value = this.properties.Radius_Part.get(e);
    u.Start_Angle.value = this.properties.Start_Angle.get(e);
    u.Color_Mode.value = this.properties.Color_Mode.get(e);
    u.Opacity_Mode.value = this.properties.Opacity_Mode.get(e);
    u.Anti_Aliasing.value = this.properties.Anti_Aliasing.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
