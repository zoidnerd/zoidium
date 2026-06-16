// Nisai Stroke (AlipFX) - Zoidium custom effect
// Source: Nisai Stroke (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/nisai-stroke.glsl

(this.defaultName = "Nisai Stroke"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Outline stroke with shape style and blend mode.",
  }),
  (this.shaderfile = "preset/nisai-stroke"),
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
    Stroke_Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Stroke_Width: { dynamic: !0, name: "Stroke Width", type: PZ.property.type.NUMBER, value: 18.3, step: 0.1 },
    Stroke_Only: { dynamic: !0, name: "Stroke Only", type: PZ.property.type.OPTION, value: 0, items: "off;on", step: 1 },
    Placement: { dynamic: !0, name: "Placement", type: PZ.property.type.OPTION, value: 0, items: "Outside;Inside;Edge;Full", step: 1 },
    Shape_Style: { dynamic: !0, name: "Shape Style", type: PZ.property.type.OPTION, value: 0, items: "Hard;Glow;Halftone", step: 1 },
    Color_Source: { dynamic: !0, name: "Color Source", type: PZ.property.type.OPTION, value: 0, items: "Solid;Gradient", step: 1 },
    Source_Opacity: { dynamic: !0, name: "Source Opacity", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Stroke_Opacity: { dynamic: !0, name: "Stroke Opacity", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Blend_Mode: { dynamic: !0, name: "Blend Mode", type: PZ.property.type.OPTION, value: 0, items: "Normal;Add;Screen;Multiply", step: 1 },
    Softness: { dynamic: !0, name: "Softness", type: PZ.property.type.NUMBER, value: 22, step: 0.1 },
    Falloff: { dynamic: !0, name: "Falloff", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Cell_Size: { dynamic: !0, name: "Cell Size", type: PZ.property.type.NUMBER, value: 14, step: 0.1 },
    Screen_Angle: { dynamic: !0, name: "Screen Angle", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Grid_Offset: { dynamic: !0, name: "Grid Offset", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Start_Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    End_Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Blend_Start: { dynamic: !0, name: "Blend Start", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Blend_End: { dynamic: !0, name: "Blend End", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Angle: { dynamic: !0, name: "Angle", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Transition: { dynamic: !0, name: "Transition", type: PZ.property.type.OPTION, value: 0, items: "Linear;Halftone", step: 1 },
    Halftone_Cell_Size: { dynamic: !0, name: "Halftone Cell Size", type: PZ.property.type.NUMBER, value: 30, step: 0.1 },
    Gradient_Screen_Angle: { dynamic: !0, name: "Gradient Screen Angle", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Gradient_Grid_Offset: { dynamic: !0, name: "Gradient Grid Offset", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Halftone_Invert: { dynamic: !0, name: "Halftone Invert", type: PZ.property.type.OPTION, value: 0, items: "off;on", step: 1 },
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
        Stroke_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Stroke_Width: { type: "f", value: 18.3 },
        Stroke_Only: { type: "f", value: 0 },
        Placement: { type: "f", value: 0 },
        Shape_Style: { type: "f", value: 0 },
        Color_Source: { type: "f", value: 0 },
        Source_Opacity: { type: "f", value: 100 },
        Stroke_Opacity: { type: "f", value: 100 },
        Blend_Mode: { type: "f", value: 0 },
        Softness: { type: "f", value: 22 },
        Falloff: { type: "f", value: 1 },
        Cell_Size: { type: "f", value: 14 },
        Screen_Angle: { type: "f", value: 0 },
        Grid_Offset: { type: "v2", value: new THREE.Vector2(0, 0) },
        Start_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        End_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Blend_Start: { type: "f", value: 0 },
        Blend_End: { type: "f", value: 100 },
        Angle: { type: "f", value: 0 },
        Transition: { type: "f", value: 0 },
        Halftone_Cell_Size: { type: "f", value: 30 },
        Gradient_Screen_Angle: { type: "f", value: 0 },
        Gradient_Grid_Offset: { type: "v2", value: new THREE.Vector2(0, 0) },
        Halftone_Invert: { type: "f", value: 0 },
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
    u.Stroke_Color.value.set(this.properties.Stroke_Color.get(e)[0]||0, this.properties.Stroke_Color.get(e)[1]||0, this.properties.Stroke_Color.get(e)[2]||0);
    u.Stroke_Width.value = this.properties.Stroke_Width.get(e);
    u.Stroke_Only.value = this.properties.Stroke_Only.get(e);
    u.Placement.value = this.properties.Placement.get(e);
    u.Shape_Style.value = this.properties.Shape_Style.get(e);
    u.Color_Source.value = this.properties.Color_Source.get(e);
    u.Source_Opacity.value = this.properties.Source_Opacity.get(e);
    u.Stroke_Opacity.value = this.properties.Stroke_Opacity.get(e);
    u.Blend_Mode.value = this.properties.Blend_Mode.get(e);
    u.Softness.value = this.properties.Softness.get(e);
    u.Falloff.value = this.properties.Falloff.get(e);
    u.Cell_Size.value = this.properties.Cell_Size.get(e);
    u.Screen_Angle.value = this.properties.Screen_Angle.get(e);
    const _Grid_Offset = this.properties.Grid_Offset.get(e); u.Grid_Offset.value.set(_Grid_Offset[0]||0, _Grid_Offset[1]||0);
    u.Start_Color.value.set(this.properties.Start_Color.get(e)[0]||0, this.properties.Start_Color.get(e)[1]||0, this.properties.Start_Color.get(e)[2]||0);
    u.End_Color.value.set(this.properties.End_Color.get(e)[0]||0, this.properties.End_Color.get(e)[1]||0, this.properties.End_Color.get(e)[2]||0);
    u.Blend_Start.value = this.properties.Blend_Start.get(e);
    u.Blend_End.value = this.properties.Blend_End.get(e);
    u.Angle.value = this.properties.Angle.get(e);
    u.Transition.value = this.properties.Transition.get(e);
    u.Halftone_Cell_Size.value = this.properties.Halftone_Cell_Size.get(e);
    u.Gradient_Screen_Angle.value = this.properties.Gradient_Screen_Angle.get(e);
    const _Gradient_Grid_Offset = this.properties.Gradient_Grid_Offset.get(e); u.Gradient_Grid_Offset.value.set(_Gradient_Grid_Offset[0]||0, _Gradient_Grid_Offset[1]||0);
    u.Halftone_Invert.value = this.properties.Halftone_Invert.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
