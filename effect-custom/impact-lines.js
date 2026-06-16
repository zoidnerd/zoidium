// Impact Lines (AlipFX) - Zoidium custom effect
// Source: Impact Lines (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/impact-lines.glsl

(this.defaultName = "Impact Lines"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Radiating speed lines or impact lines from center.",
  }),
  (this.shaderfile = "preset/impact-lines"),
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
    time: { dynamic: !0, name: "time", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Mode: { dynamic: !0, name: "Mode", type: PZ.property.type.OPTION, value: 0, items: "Radial Lines;Speed Lines" },
    Center: { dynamic: !0, name: "Center", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Lines: { dynamic: !0, name: "Lines", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Center_Gap: { dynamic: !0, name: "Center Gap", type: PZ.property.type.NUMBER, value: 0.01, step: 0.1 },
    Outer_Radius: { dynamic: !0, name: "Outer Radius", type: PZ.property.type.NUMBER, value: 500, step: 0.1 },
    Radial_Expansion: { dynamic: !0, name: "Radial Expansion", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Radial_Y_Scale: { dynamic: !0, name: "Radial Y Scale", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Speed_Line_Length: { dynamic: !0, name: "Speed Line Length", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Opacity: { dynamic: !0, name: "Opacity", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Thickness: { dynamic: !0, name: "Thickness", type: PZ.property.type.NUMBER, value: 27.05, step: 0.1 },
    Taper: { dynamic: !0, name: "Taper", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Start_Taper: { dynamic: !0, name: "Start Taper", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    End_Taper: { dynamic: !0, name: "End Taper", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Line_Style: { dynamic: !0, name: "Line Style", type: PZ.property.type.OPTION, value: 0, items: "Clean;Zigzag;Tilda" },
    Rough_Edge: { dynamic: !0, name: "Rough Edge", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Style_Count: { dynamic: !0, name: "Style Count", type: PZ.property.type.NUMBER, value: 8, step: 0.1 },
    Variation: { dynamic: !0, name: "Variation", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Animate: { dynamic: !0, name: "Animate", type: PZ.property.type.OPTION, value: 0, items: "Off;Grow;Flow;Infinite Speed Line" },
    Auto_Animation: { dynamic: !0, name: "Auto Animation", type: PZ.property.type.OPTION, value: 1, items: "Disabled;Enabled" },
    Direction: { dynamic: !0, name: "Direction", type: PZ.property.type.OPTION, value: 0, items: "Outward;Inward" },
    Grow_Phase: { dynamic: !0, name: "Grow Phase", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Flow_Phase: { dynamic: !0, name: "Flow Phase", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Speed: { dynamic: !0, name: "Speed", type: PZ.property.type.NUMBER, value: 3, step: 0.1 },
    Speed_Variation: { dynamic: !0, name: "Speed Variation", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Flow_Life_Time: { dynamic: !0, name: "Flow Life Time", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Flow_Length: { dynamic: !0, name: "Flow Length", type: PZ.property.type.NUMBER, value: 200, step: 0.1 },
    Flow_Min_Scale: { dynamic: !0, name: "Flow Min Scale", type: PZ.property.type.NUMBER, value: 6.9, step: 0.1 },
    Phase_Randomness: { dynamic: !0, name: "Phase Randomness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Rotation: { dynamic: !0, name: "Rotation", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Length_Origin: { dynamic: !0, name: "Length Origin", type: PZ.property.type.OPTION, value: 0, items: "Start;Center;End" },
    Angle_Range: { dynamic: !0, name: "Angle Range", type: PZ.property.type.NUMBER, value: 360, step: 0.1 },
    Angle_Offset: { dynamic: !0, name: "Angle Offset", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Fade_Start: { dynamic: !0, name: "Fade Start", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Fade_End: { dynamic: !0, name: "Fade End", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Cap_Style: { dynamic: !0, name: "Cap Style", type: PZ.property.type.OPTION, value: 1, items: "Butt;Round" },
    Dash_Length: { dynamic: !0, name: "Dash Length", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Dash_Gap: { dynamic: !0, name: "Dash Gap", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Dash_Gap_Randomness: { dynamic: !0, name: "Dash Gap Randomness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Angle_Randomness: { dynamic: !0, name: "Angle Randomness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Length_Randomness: { dynamic: !0, name: "Length Randomness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Start_Position_Randomness: { dynamic: !0, name: "Start Position Randomness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Thickness_Randomness: { dynamic: !0, name: "Thickness Randomness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Opacity_Randomness: { dynamic: !0, name: "Opacity Randomness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Speed_Spacing_Randomness: { dynamic: !0, name: "Speed Spacing Randomness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Speed_Position_Randomness: { dynamic: !0, name: "Speed Position Randomness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Color_Randomness: { dynamic: !0, name: "Color Randomness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Seed: { dynamic: !0, name: "Seed", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Rotation_Randomness: { dynamic: !0, name: "Rotation Randomness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Flow_Fade: { dynamic: !0, name: "Flow Fade", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Depth_Curve: { dynamic: !0, name: "Depth Curve", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    FPS: { dynamic: !0, name: "FPS", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Evolution_Enable: { dynamic: !0, name: "Evolution Enable", type: PZ.property.type.OPTION, value: 0, items: "Disabled;Enabled" },
    Auto_Evolution: { dynamic: !0, name: "Auto Evolution", type: PZ.property.type.OPTION, value: 0, items: "Disabled;Enabled" },
    Auto_Evolution_Speed: { dynamic: !0, name: "Auto Evolution Speed", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Evolution: { dynamic: !0, name: "Evolution", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Evolution_Amount: { dynamic: !0, name: "Evolution Amount", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Evolution_Speed: { dynamic: !0, name: "Evolution Speed", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Evolution_Angle: { dynamic: !0, name: "Evolution Angle", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Evolution_Rotation: { dynamic: !0, name: "Evolution Rotation", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Evolution_Rotation_Randomness: { dynamic: !0, name: "Evolution Rotation Randomness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Evolution_Length: { dynamic: !0, name: "Evolution Length", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Evolution_Thickness: { dynamic: !0, name: "Evolution Thickness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Evolution_Opacity: { dynamic: !0, name: "Evolution Opacity", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Output_Mode: { dynamic: !0, name: "Output Mode", type: PZ.property.type.OPTION, value: 0, items: "Composite;Lines Only" },
    Blend_Mode: { dynamic: !0, name: "Blend Mode", type: PZ.property.type.OPTION, value: 0, items: "Normal;Add;Multiply" },
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
        time: { type: "f", value: 0 },
        Mode: { type: "f", value: 0 },
        Center: { type: "v2", value: new THREE.Vector2(0, 0) },
        Lines: { type: "f", value: 50 },
        Center_Gap: { type: "f", value: 0.01 },
        Outer_Radius: { type: "f", value: 500 },
        Radial_Expansion: { type: "f", value: 0 },
        Radial_Y_Scale: { type: "f", value: 1 },
        Speed_Line_Length: { type: "f", value: 100 },
        Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Opacity: { type: "f", value: 1 },
        Thickness: { type: "f", value: 27.05 },
        Taper: { type: "f", value: 0 },
        Start_Taper: { type: "f", value: 0 },
        End_Taper: { type: "f", value: 0 },
        Line_Style: { type: "f", value: 0 },
        Rough_Edge: { type: "f", value: 0 },
        Style_Count: { type: "f", value: 8 },
        Variation: { type: "f", value: 0 },
        Animate: { type: "f", value: 0 },
        Auto_Animation: { type: "f", value: 1 },
        Direction: { type: "f", value: 0 },
        Grow_Phase: { type: "f", value: 0 },
        Flow_Phase: { type: "f", value: 0 },
        Speed: { type: "f", value: 3 },
        Speed_Variation: { type: "f", value: 0 },
        Flow_Life_Time: { type: "f", value: 0 },
        Flow_Length: { type: "f", value: 200 },
        Flow_Min_Scale: { type: "f", value: 6.9 },
        Phase_Randomness: { type: "f", value: 0 },
        Rotation: { type: "f", value: 0 },
        Length_Origin: { type: "f", value: 0 },
        Angle_Range: { type: "f", value: 360 },
        Angle_Offset: { type: "f", value: 0 },
        Fade_Start: { type: "f", value: 0 },
        Fade_End: { type: "f", value: 0 },
        Cap_Style: { type: "f", value: 1 },
        Dash_Length: { type: "f", value: 0 },
        Dash_Gap: { type: "f", value: 0 },
        Dash_Gap_Randomness: { type: "f", value: 0 },
        Angle_Randomness: { type: "f", value: 0 },
        Length_Randomness: { type: "f", value: 0 },
        Start_Position_Randomness: { type: "f", value: 0 },
        Thickness_Randomness: { type: "f", value: 0 },
        Opacity_Randomness: { type: "f", value: 0 },
        Speed_Spacing_Randomness: { type: "f", value: 0 },
        Speed_Position_Randomness: { type: "f", value: 0 },
        Color_Randomness: { type: "f", value: 0 },
        Seed: { type: "f", value: 0 },
        Rotation_Randomness: { type: "f", value: 0 },
        Flow_Fade: { type: "f", value: 0 },
        Depth_Curve: { type: "f", value: 0 },
        FPS: { type: "f", value: 0 },
        Evolution_Enable: { type: "f", value: 0 },
        Auto_Evolution: { type: "f", value: 0 },
        Auto_Evolution_Speed: { type: "f", value: 1 },
        Evolution: { type: "f", value: 0 },
        Evolution_Amount: { type: "f", value: 100 },
        Evolution_Speed: { type: "f", value: 1 },
        Evolution_Angle: { type: "f", value: 0 },
        Evolution_Rotation: { type: "f", value: 0 },
        Evolution_Rotation_Randomness: { type: "f", value: 0 },
        Evolution_Length: { type: "f", value: 0 },
        Evolution_Thickness: { type: "f", value: 0 },
        Evolution_Opacity: { type: "f", value: 0 },
        Output_Mode: { type: "f", value: 0 },
        Blend_Mode: { type: "f", value: 0 },
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
    u.time.value = this.properties.time.get(e);
    u.Mode.value = this.properties.Mode.get(e);
    const _Center = this.properties.Center.get(e); u.Center.value.set(_Center[0]||0, _Center[1]||0);
    u.Lines.value = this.properties.Lines.get(e);
    u.Center_Gap.value = this.properties.Center_Gap.get(e);
    u.Outer_Radius.value = this.properties.Outer_Radius.get(e);
    u.Radial_Expansion.value = this.properties.Radial_Expansion.get(e);
    u.Radial_Y_Scale.value = this.properties.Radial_Y_Scale.get(e);
    u.Speed_Line_Length.value = this.properties.Speed_Line_Length.get(e);
    u.Color.value.set(this.properties.Color.get(e)[0]||0, this.properties.Color.get(e)[1]||0, this.properties.Color.get(e)[2]||0);
    u.Opacity.value = this.properties.Opacity.get(e);
    u.Thickness.value = this.properties.Thickness.get(e);
    u.Taper.value = this.properties.Taper.get(e);
    u.Start_Taper.value = this.properties.Start_Taper.get(e);
    u.End_Taper.value = this.properties.End_Taper.get(e);
    u.Line_Style.value = this.properties.Line_Style.get(e);
    u.Rough_Edge.value = this.properties.Rough_Edge.get(e);
    u.Style_Count.value = this.properties.Style_Count.get(e);
    u.Variation.value = this.properties.Variation.get(e);
    u.Animate.value = this.properties.Animate.get(e);
    u.Auto_Animation.value = this.properties.Auto_Animation.get(e);
    u.Direction.value = this.properties.Direction.get(e);
    u.Grow_Phase.value = this.properties.Grow_Phase.get(e);
    u.Flow_Phase.value = this.properties.Flow_Phase.get(e);
    u.Speed.value = this.properties.Speed.get(e);
    u.Speed_Variation.value = this.properties.Speed_Variation.get(e);
    u.Flow_Life_Time.value = this.properties.Flow_Life_Time.get(e);
    u.Flow_Length.value = this.properties.Flow_Length.get(e);
    u.Flow_Min_Scale.value = this.properties.Flow_Min_Scale.get(e);
    u.Phase_Randomness.value = this.properties.Phase_Randomness.get(e);
    u.Rotation.value = this.properties.Rotation.get(e);
    u.Length_Origin.value = this.properties.Length_Origin.get(e);
    u.Angle_Range.value = this.properties.Angle_Range.get(e);
    u.Angle_Offset.value = this.properties.Angle_Offset.get(e);
    u.Fade_Start.value = this.properties.Fade_Start.get(e);
    u.Fade_End.value = this.properties.Fade_End.get(e);
    u.Cap_Style.value = this.properties.Cap_Style.get(e);
    u.Dash_Length.value = this.properties.Dash_Length.get(e);
    u.Dash_Gap.value = this.properties.Dash_Gap.get(e);
    u.Dash_Gap_Randomness.value = this.properties.Dash_Gap_Randomness.get(e);
    u.Angle_Randomness.value = this.properties.Angle_Randomness.get(e);
    u.Length_Randomness.value = this.properties.Length_Randomness.get(e);
    u.Start_Position_Randomness.value = this.properties.Start_Position_Randomness.get(e);
    u.Thickness_Randomness.value = this.properties.Thickness_Randomness.get(e);
    u.Opacity_Randomness.value = this.properties.Opacity_Randomness.get(e);
    u.Speed_Spacing_Randomness.value = this.properties.Speed_Spacing_Randomness.get(e);
    u.Speed_Position_Randomness.value = this.properties.Speed_Position_Randomness.get(e);
    u.Color_Randomness.value = this.properties.Color_Randomness.get(e);
    u.Seed.value = this.properties.Seed.get(e);
    u.Rotation_Randomness.value = this.properties.Rotation_Randomness.get(e);
    u.Flow_Fade.value = this.properties.Flow_Fade.get(e);
    u.Depth_Curve.value = this.properties.Depth_Curve.get(e);
    u.FPS.value = this.properties.FPS.get(e);
    u.Evolution_Enable.value = this.properties.Evolution_Enable.get(e);
    u.Auto_Evolution.value = this.properties.Auto_Evolution.get(e);
    u.Auto_Evolution_Speed.value = this.properties.Auto_Evolution_Speed.get(e);
    u.Evolution.value = this.properties.Evolution.get(e);
    u.Evolution_Amount.value = this.properties.Evolution_Amount.get(e);
    u.Evolution_Speed.value = this.properties.Evolution_Speed.get(e);
    u.Evolution_Angle.value = this.properties.Evolution_Angle.get(e);
    u.Evolution_Rotation.value = this.properties.Evolution_Rotation.get(e);
    u.Evolution_Rotation_Randomness.value = this.properties.Evolution_Rotation_Randomness.get(e);
    u.Evolution_Length.value = this.properties.Evolution_Length.get(e);
    u.Evolution_Thickness.value = this.properties.Evolution_Thickness.get(e);
    u.Evolution_Opacity.value = this.properties.Evolution_Opacity.get(e);
    u.Output_Mode.value = this.properties.Output_Mode.get(e);
    u.Blend_Mode.value = this.properties.Blend_Mode.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
