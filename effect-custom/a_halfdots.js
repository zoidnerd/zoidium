// A_HalfDots (AlipFX) - Zoidium custom effect
// Source: A_HalfDots (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/a_halfdots.glsl

(this.defaultName = "A HalfDots"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Dot pattern overlay with random shapes and ramp.",
  }),
  (this.shaderfile = "preset/a_halfdots"),
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
    Composite: { dynamic: !0, name: "Composite", type: PZ.property.type.OPTION, value: 0, items: "Transparent;Over Original;Fill Only;Original Only" },
    Source_Map: { dynamic: !0, name: "Source Map", type: PZ.property.type.OPTION, value: 0, items: "Alpha 1;R;G;B;Alpha;Luma;Hue;Lightness;Saturation;Max;Average" },
    Dot_Shape: { dynamic: !0, name: "Dot Shape", type: PZ.property.type.OPTION, value: 0, items: "Circle;Square;Diamond;Heart;Star;Random" },
    Shape_1: { dynamic: !0, name: "Shape 1", type: PZ.property.type.OPTION, value: 0, items: "Circle;Square;Diamond;Heart;Star" },
    Shape_2: { dynamic: !0, name: "Shape 2", type: PZ.property.type.OPTION, value: 0, items: "Circle;Square;Diamond;Heart;Star" },
    Shape_3: { dynamic: !0, name: "Shape 3", type: PZ.property.type.OPTION, value: 0, items: "Circle;Square;Diamond;Heart;Star" },
    Shape_4: { dynamic: !0, name: "Shape 4", type: PZ.property.type.OPTION, value: 0, items: "Circle;Square;Diamond;Heart;Star" },
    Fill_Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Dot_Size: { dynamic: !0, name: "Dot Size", type: PZ.property.type.NUMBER, value: 20, step: 0.1 },
    Grid_Spacing: { dynamic: !0, name: "Grid Spacing", type: PZ.property.type.NUMBER, value: 30, step: 0.1 },
    Grid_Angle: { dynamic: !0, name: "Grid Angle", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Dots_Angle: { dynamic: !0, name: "Dots Angle", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Scale: { dynamic: !0, name: "Scale", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Rotate: { dynamic: !0, name: "Rotate", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Random_Seed: { dynamic: !0, name: "Random Seed", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Invert_Pattern: { dynamic: !0, name: "Invert Pattern", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Enable_Ramp: { dynamic: !0, name: "Enable Ramp", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Ramp_Style: { dynamic: !0, name: "Ramp Style", type: PZ.property.type.OPTION, value: 1, items: "Linear;Radial;Mirrored;Box" },
    Start_Point: { dynamic: !0, name: "Start Point", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    End_Point: { dynamic: !0, name: "End Point", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
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
        Composite: { type: "f", value: 0 },
        Source_Map: { type: "f", value: 0 },
        Dot_Shape: { type: "f", value: 0 },
        Shape_1: { type: "f", value: 0 },
        Shape_2: { type: "f", value: 0 },
        Shape_3: { type: "f", value: 0 },
        Shape_4: { type: "f", value: 0 },
        Fill_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Dot_Size: { type: "f", value: 20 },
        Grid_Spacing: { type: "f", value: 30 },
        Grid_Angle: { type: "f", value: 0 },
        Dots_Angle: { type: "f", value: 0 },
        Scale: { type: "f", value: 0 },
        Rotate: { type: "f", value: 0 },
        Random_Seed: { type: "f", value: 0 },
        Invert_Pattern: { type: "f", value: 0 },
        Enable_Ramp: { type: "f", value: 0 },
        Ramp_Style: { type: "f", value: 1 },
        Start_Point: { type: "v2", value: new THREE.Vector2(0, 0) },
        End_Point: { type: "v2", value: new THREE.Vector2(0, 0) },
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
    u.Composite.value = this.properties.Composite.get(e);
    u.Source_Map.value = this.properties.Source_Map.get(e);
    u.Dot_Shape.value = this.properties.Dot_Shape.get(e);
    u.Shape_1.value = this.properties.Shape_1.get(e);
    u.Shape_2.value = this.properties.Shape_2.get(e);
    u.Shape_3.value = this.properties.Shape_3.get(e);
    u.Shape_4.value = this.properties.Shape_4.get(e);
    u.Fill_Color.value.set(this.properties.Fill_Color.get(e)[0]||0, this.properties.Fill_Color.get(e)[1]||0, this.properties.Fill_Color.get(e)[2]||0);
    u.Dot_Size.value = this.properties.Dot_Size.get(e);
    u.Grid_Spacing.value = this.properties.Grid_Spacing.get(e);
    u.Grid_Angle.value = this.properties.Grid_Angle.get(e);
    u.Dots_Angle.value = this.properties.Dots_Angle.get(e);
    u.Scale.value = this.properties.Scale.get(e);
    u.Rotate.value = this.properties.Rotate.get(e);
    u.Random_Seed.value = this.properties.Random_Seed.get(e);
    u.Invert_Pattern.value = this.properties.Invert_Pattern.get(e);
    u.Enable_Ramp.value = this.properties.Enable_Ramp.get(e);
    u.Ramp_Style.value = this.properties.Ramp_Style.get(e);
    const _Start_Point = this.properties.Start_Point.get(e); u.Start_Point.value.set(_Start_Point[0]||0, _Start_Point[1]||0);
    const _End_Point = this.properties.End_Point.get(e); u.End_Point.value.set(_End_Point[0]||0, _End_Point[1]||0);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
