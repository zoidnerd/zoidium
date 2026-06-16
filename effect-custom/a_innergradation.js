// A_InnerGradation (AlipFX) - Zoidium custom effect
// Source: A_InnerGradation (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/a_innergradation.glsl

(this.defaultName = "A InnerGradation"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Inner halo/grad with multi-color target selection.",
  }),
  (this.shaderfile = "preset/a_innergradation"),
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
    Inner_Mode: { dynamic: !0, name: "Inner Mode", type: PZ.property.type.OPTION, value: 0, items: "Default;Alpha Only;Fill Base" },
    Inner_Blur: { dynamic: !0, name: "Inner Blur", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Inner_Fill: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Fill_Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Size: { dynamic: !0, name: "Size", type: PZ.property.type.NUMBER, value: 14, step: 0.1 },
    Blend_Mode: { dynamic: !0, name: "Blend Mode", type: PZ.property.type.OPTION, value: 0, items: "Normal;Add;Multiply;Screen;Overlay;Darken;Hard Light" },
    Softness: { dynamic: !0, name: "Softness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Choker: { dynamic: !0, name: "Choker", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Opacity: { dynamic: !0, name: "Opacity", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Distance: { dynamic: !0, name: "Distance", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Angle: { dynamic: !0, name: "Angle", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    View_All_Selection_Color: { dynamic: !0, name: "View All Selection Color", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Split_Touching_Colors: { dynamic: !0, name: "Split Touching Colors", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Enable: { dynamic: !0, name: "Enable", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    View_Selection_Only: { dynamic: !0, name: "View Selection Only", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Target_Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Tolerance: { dynamic: !0, name: "Tolerance", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Use_Local_Transform: { dynamic: !0, name: "Use Local Transform", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Local_Distance: { dynamic: !0, name: "Local Distance", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Local_Angle: { dynamic: !0, name: "Local Angle", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Enable_2: { dynamic: !0, name: "Enable 2", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    View_Selection_Only_2: { dynamic: !0, name: "View Selection Only 2", type: PZ.property.type.OPTION, value: 1, items: "off;on" },
    Target_Color_2: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Tolerance_2: { dynamic: !0, name: "Tolerance 2", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Use_Local_Transform_2: { dynamic: !0, name: "Use Local Transform 2", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Local_Distance_2: { dynamic: !0, name: "Local Distance 2", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Local_Angle_2: { dynamic: !0, name: "Local Angle 2", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Enable_3: { dynamic: !0, name: "Enable 3", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    View_Selection_Only_3: { dynamic: !0, name: "View Selection Only 3", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Target_Color_3: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Tolerance_3: { dynamic: !0, name: "Tolerance 3", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Use_Local_Transform_3: { dynamic: !0, name: "Use Local Transform 3", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Local_Distance_3: { dynamic: !0, name: "Local Distance 3", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Local_Angle_3: { dynamic: !0, name: "Local Angle 3", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Enable_4: { dynamic: !0, name: "Enable 4", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    View_Selection_Only_4: { dynamic: !0, name: "View Selection Only 4", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Target_Color_4: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Tolerance_4: { dynamic: !0, name: "Tolerance 4", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Use_Local_Transform_4: { dynamic: !0, name: "Use Local Transform 4", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Local_Distance_4: { dynamic: !0, name: "Local Distance 4", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Local_Angle_4: { dynamic: !0, name: "Local Angle 4", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Enable_5: { dynamic: !0, name: "Enable 5", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    View_Selection_Only_5: { dynamic: !0, name: "View Selection Only 5", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Target_Color_5: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Tolerance_5: { dynamic: !0, name: "Tolerance 5", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Use_Local_Transform_5: { dynamic: !0, name: "Use Local Transform 5", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Local_Distance_5: { dynamic: !0, name: "Local Distance 5", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Local_Angle_5: { dynamic: !0, name: "Local Angle 5", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Enable_6: { dynamic: !0, name: "Enable 6", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    View_Selection_Only_6: { dynamic: !0, name: "View Selection Only 6", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Target_Color_6: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Tolerance_6: { dynamic: !0, name: "Tolerance 6", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Use_Local_Transform_6: { dynamic: !0, name: "Use Local Transform 6", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Local_Distance_6: { dynamic: !0, name: "Local Distance 6", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Local_Angle_6: { dynamic: !0, name: "Local Angle 6", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Enable_7: { dynamic: !0, name: "Enable 7", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    View_Selection_Only_7: { dynamic: !0, name: "View Selection Only 7", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Target_Color_7: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Tolerance_7: { dynamic: !0, name: "Tolerance 7", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Use_Local_Transform_7: { dynamic: !0, name: "Use Local Transform 7", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Local_Distance_7: { dynamic: !0, name: "Local Distance 7", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Local_Angle_7: { dynamic: !0, name: "Local Angle 7", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Enable_8: { dynamic: !0, name: "Enable 8", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    View_Selection_Only_8: { dynamic: !0, name: "View Selection Only 8", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Target_Color_8: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Tolerance_8: { dynamic: !0, name: "Tolerance 8", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Use_Local_Transform_8: { dynamic: !0, name: "Use Local Transform 8", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Local_Distance_8: { dynamic: !0, name: "Local Distance 8", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Local_Angle_8: { dynamic: !0, name: "Local Angle 8", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Enable_9: { dynamic: !0, name: "Enable 9", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    View_Selection_Only_9: { dynamic: !0, name: "View Selection Only 9", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Target_Color_9: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Tolerance_9: { dynamic: !0, name: "Tolerance 9", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Use_Local_Transform_9: { dynamic: !0, name: "Use Local Transform 9", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Local_Distance_9: { dynamic: !0, name: "Local Distance 9", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Local_Angle_9: { dynamic: !0, name: "Local Angle 9", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Enable_10: { dynamic: !0, name: "Enable 10", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    View_Selection_Only_10: { dynamic: !0, name: "View Selection Only 10", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Target_Color_10: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Tolerance_10: { dynamic: !0, name: "Tolerance 10", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Use_Local_Transform_10: { dynamic: !0, name: "Use Local Transform 10", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Local_Distance_10: { dynamic: !0, name: "Local Distance 10", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Local_Angle_10: { dynamic: !0, name: "Local Angle 10", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
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
        Inner_Mode: { type: "f", value: 0 },
        Inner_Blur: { type: "f", value: 0 },
        Inner_Fill: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Fill_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Size: { type: "f", value: 14 },
        Blend_Mode: { type: "f", value: 0 },
        Softness: { type: "f", value: 0 },
        Choker: { type: "f", value: 0 },
        Opacity: { type: "f", value: 100 },
        Distance: { type: "f", value: 0 },
        Angle: { type: "f", value: 0 },
        View_All_Selection_Color: { type: "f", value: 0 },
        Split_Touching_Colors: { type: "f", value: 0 },
        Enable: { type: "f", value: 0 },
        View_Selection_Only: { type: "f", value: 0 },
        Target_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Tolerance: { type: "f", value: 0 },
        Use_Local_Transform: { type: "f", value: 0 },
        Local_Distance: { type: "f", value: 0 },
        Local_Angle: { type: "f", value: 0 },
        Enable_2: { type: "f", value: 0 },
        View_Selection_Only_2: { type: "f", value: 1 },
        Target_Color_2: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Tolerance_2: { type: "f", value: 0 },
        Use_Local_Transform_2: { type: "f", value: 0 },
        Local_Distance_2: { type: "f", value: 0 },
        Local_Angle_2: { type: "f", value: 0 },
        Enable_3: { type: "f", value: 0 },
        View_Selection_Only_3: { type: "f", value: 0 },
        Target_Color_3: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Tolerance_3: { type: "f", value: 0 },
        Use_Local_Transform_3: { type: "f", value: 0 },
        Local_Distance_3: { type: "f", value: 0 },
        Local_Angle_3: { type: "f", value: 0 },
        Enable_4: { type: "f", value: 0 },
        View_Selection_Only_4: { type: "f", value: 0 },
        Target_Color_4: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Tolerance_4: { type: "f", value: 0 },
        Use_Local_Transform_4: { type: "f", value: 0 },
        Local_Distance_4: { type: "f", value: 0 },
        Local_Angle_4: { type: "f", value: 0 },
        Enable_5: { type: "f", value: 0 },
        View_Selection_Only_5: { type: "f", value: 0 },
        Target_Color_5: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Tolerance_5: { type: "f", value: 0 },
        Use_Local_Transform_5: { type: "f", value: 0 },
        Local_Distance_5: { type: "f", value: 0 },
        Local_Angle_5: { type: "f", value: 0 },
        Enable_6: { type: "f", value: 0 },
        View_Selection_Only_6: { type: "f", value: 0 },
        Target_Color_6: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Tolerance_6: { type: "f", value: 0 },
        Use_Local_Transform_6: { type: "f", value: 0 },
        Local_Distance_6: { type: "f", value: 0 },
        Local_Angle_6: { type: "f", value: 0 },
        Enable_7: { type: "f", value: 0 },
        View_Selection_Only_7: { type: "f", value: 0 },
        Target_Color_7: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Tolerance_7: { type: "f", value: 0 },
        Use_Local_Transform_7: { type: "f", value: 0 },
        Local_Distance_7: { type: "f", value: 0 },
        Local_Angle_7: { type: "f", value: 0 },
        Enable_8: { type: "f", value: 0 },
        View_Selection_Only_8: { type: "f", value: 0 },
        Target_Color_8: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Tolerance_8: { type: "f", value: 0 },
        Use_Local_Transform_8: { type: "f", value: 0 },
        Local_Distance_8: { type: "f", value: 0 },
        Local_Angle_8: { type: "f", value: 0 },
        Enable_9: { type: "f", value: 0 },
        View_Selection_Only_9: { type: "f", value: 0 },
        Target_Color_9: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Tolerance_9: { type: "f", value: 0 },
        Use_Local_Transform_9: { type: "f", value: 0 },
        Local_Distance_9: { type: "f", value: 0 },
        Local_Angle_9: { type: "f", value: 0 },
        Enable_10: { type: "f", value: 0 },
        View_Selection_Only_10: { type: "f", value: 0 },
        Target_Color_10: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Tolerance_10: { type: "f", value: 0 },
        Use_Local_Transform_10: { type: "f", value: 0 },
        Local_Distance_10: { type: "f", value: 0 },
        Local_Angle_10: { type: "f", value: 0 },
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
    u.Inner_Mode.value = this.properties.Inner_Mode.get(e);
    u.Inner_Blur.value = this.properties.Inner_Blur.get(e);
    u.Inner_Fill.value.set(this.properties.Inner_Fill.get(e)[0]||0, this.properties.Inner_Fill.get(e)[1]||0, this.properties.Inner_Fill.get(e)[2]||0);
    u.Fill_Color.value.set(this.properties.Fill_Color.get(e)[0]||0, this.properties.Fill_Color.get(e)[1]||0, this.properties.Fill_Color.get(e)[2]||0);
    u.Size.value = this.properties.Size.get(e);
    u.Blend_Mode.value = this.properties.Blend_Mode.get(e);
    u.Softness.value = this.properties.Softness.get(e);
    u.Choker.value = this.properties.Choker.get(e);
    u.Opacity.value = this.properties.Opacity.get(e);
    u.Distance.value = this.properties.Distance.get(e);
    u.Angle.value = this.properties.Angle.get(e);
    u.View_All_Selection_Color.value = this.properties.View_All_Selection_Color.get(e);
    u.Split_Touching_Colors.value = this.properties.Split_Touching_Colors.get(e);
    u.Enable.value = this.properties.Enable.get(e);
    u.View_Selection_Only.value = this.properties.View_Selection_Only.get(e);
    u.Target_Color.value.set(this.properties.Target_Color.get(e)[0]||0, this.properties.Target_Color.get(e)[1]||0, this.properties.Target_Color.get(e)[2]||0);
    u.Tolerance.value = this.properties.Tolerance.get(e);
    u.Use_Local_Transform.value = this.properties.Use_Local_Transform.get(e);
    u.Local_Distance.value = this.properties.Local_Distance.get(e);
    u.Local_Angle.value = this.properties.Local_Angle.get(e);
    u.Enable_2.value = this.properties.Enable_2.get(e);
    u.View_Selection_Only_2.value = this.properties.View_Selection_Only_2.get(e);
    u.Target_Color_2.value.set(this.properties.Target_Color_2.get(e)[0]||0, this.properties.Target_Color_2.get(e)[1]||0, this.properties.Target_Color_2.get(e)[2]||0);
    u.Tolerance_2.value = this.properties.Tolerance_2.get(e);
    u.Use_Local_Transform_2.value = this.properties.Use_Local_Transform_2.get(e);
    u.Local_Distance_2.value = this.properties.Local_Distance_2.get(e);
    u.Local_Angle_2.value = this.properties.Local_Angle_2.get(e);
    u.Enable_3.value = this.properties.Enable_3.get(e);
    u.View_Selection_Only_3.value = this.properties.View_Selection_Only_3.get(e);
    u.Target_Color_3.value.set(this.properties.Target_Color_3.get(e)[0]||0, this.properties.Target_Color_3.get(e)[1]||0, this.properties.Target_Color_3.get(e)[2]||0);
    u.Tolerance_3.value = this.properties.Tolerance_3.get(e);
    u.Use_Local_Transform_3.value = this.properties.Use_Local_Transform_3.get(e);
    u.Local_Distance_3.value = this.properties.Local_Distance_3.get(e);
    u.Local_Angle_3.value = this.properties.Local_Angle_3.get(e);
    u.Enable_4.value = this.properties.Enable_4.get(e);
    u.View_Selection_Only_4.value = this.properties.View_Selection_Only_4.get(e);
    u.Target_Color_4.value.set(this.properties.Target_Color_4.get(e)[0]||0, this.properties.Target_Color_4.get(e)[1]||0, this.properties.Target_Color_4.get(e)[2]||0);
    u.Tolerance_4.value = this.properties.Tolerance_4.get(e);
    u.Use_Local_Transform_4.value = this.properties.Use_Local_Transform_4.get(e);
    u.Local_Distance_4.value = this.properties.Local_Distance_4.get(e);
    u.Local_Angle_4.value = this.properties.Local_Angle_4.get(e);
    u.Enable_5.value = this.properties.Enable_5.get(e);
    u.View_Selection_Only_5.value = this.properties.View_Selection_Only_5.get(e);
    u.Target_Color_5.value.set(this.properties.Target_Color_5.get(e)[0]||0, this.properties.Target_Color_5.get(e)[1]||0, this.properties.Target_Color_5.get(e)[2]||0);
    u.Tolerance_5.value = this.properties.Tolerance_5.get(e);
    u.Use_Local_Transform_5.value = this.properties.Use_Local_Transform_5.get(e);
    u.Local_Distance_5.value = this.properties.Local_Distance_5.get(e);
    u.Local_Angle_5.value = this.properties.Local_Angle_5.get(e);
    u.Enable_6.value = this.properties.Enable_6.get(e);
    u.View_Selection_Only_6.value = this.properties.View_Selection_Only_6.get(e);
    u.Target_Color_6.value.set(this.properties.Target_Color_6.get(e)[0]||0, this.properties.Target_Color_6.get(e)[1]||0, this.properties.Target_Color_6.get(e)[2]||0);
    u.Tolerance_6.value = this.properties.Tolerance_6.get(e);
    u.Use_Local_Transform_6.value = this.properties.Use_Local_Transform_6.get(e);
    u.Local_Distance_6.value = this.properties.Local_Distance_6.get(e);
    u.Local_Angle_6.value = this.properties.Local_Angle_6.get(e);
    u.Enable_7.value = this.properties.Enable_7.get(e);
    u.View_Selection_Only_7.value = this.properties.View_Selection_Only_7.get(e);
    u.Target_Color_7.value.set(this.properties.Target_Color_7.get(e)[0]||0, this.properties.Target_Color_7.get(e)[1]||0, this.properties.Target_Color_7.get(e)[2]||0);
    u.Tolerance_7.value = this.properties.Tolerance_7.get(e);
    u.Use_Local_Transform_7.value = this.properties.Use_Local_Transform_7.get(e);
    u.Local_Distance_7.value = this.properties.Local_Distance_7.get(e);
    u.Local_Angle_7.value = this.properties.Local_Angle_7.get(e);
    u.Enable_8.value = this.properties.Enable_8.get(e);
    u.View_Selection_Only_8.value = this.properties.View_Selection_Only_8.get(e);
    u.Target_Color_8.value.set(this.properties.Target_Color_8.get(e)[0]||0, this.properties.Target_Color_8.get(e)[1]||0, this.properties.Target_Color_8.get(e)[2]||0);
    u.Tolerance_8.value = this.properties.Tolerance_8.get(e);
    u.Use_Local_Transform_8.value = this.properties.Use_Local_Transform_8.get(e);
    u.Local_Distance_8.value = this.properties.Local_Distance_8.get(e);
    u.Local_Angle_8.value = this.properties.Local_Angle_8.get(e);
    u.Enable_9.value = this.properties.Enable_9.get(e);
    u.View_Selection_Only_9.value = this.properties.View_Selection_Only_9.get(e);
    u.Target_Color_9.value.set(this.properties.Target_Color_9.get(e)[0]||0, this.properties.Target_Color_9.get(e)[1]||0, this.properties.Target_Color_9.get(e)[2]||0);
    u.Tolerance_9.value = this.properties.Tolerance_9.get(e);
    u.Use_Local_Transform_9.value = this.properties.Use_Local_Transform_9.get(e);
    u.Local_Distance_9.value = this.properties.Local_Distance_9.get(e);
    u.Local_Angle_9.value = this.properties.Local_Angle_9.get(e);
    u.Enable_10.value = this.properties.Enable_10.get(e);
    u.View_Selection_Only_10.value = this.properties.View_Selection_Only_10.get(e);
    u.Target_Color_10.value.set(this.properties.Target_Color_10.get(e)[0]||0, this.properties.Target_Color_10.get(e)[1]||0, this.properties.Target_Color_10.get(e)[2]||0);
    u.Tolerance_10.value = this.properties.Tolerance_10.get(e);
    u.Use_Local_Transform_10.value = this.properties.Use_Local_Transform_10.get(e);
    u.Local_Distance_10.value = this.properties.Local_Distance_10.get(e);
    u.Local_Angle_10.value = this.properties.Local_Angle_10.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
