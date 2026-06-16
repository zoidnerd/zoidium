// Colorama (AlipFX) - Zoidium custom effect
// Source: Colorama (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/colorama.glsl

(this.defaultName = "Colorama"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Cycle palette mapping with phase, mask and modify.",
  }),
  (this.shaderfile = "preset/colorama"),
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
    Get_Phase_From: { dynamic: !0, name: "Get Phase From", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Luminance;Red;Green;Blue;Hue;Lightness;Saturation;Value;Alpha" },
    Add_Mode: { dynamic: !0, name: "Add Mode", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Modulo;Add;Average;Screen" },
    Phase_Shift: { dynamic: !0, name: "Phase Shift", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Color_1: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_2: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_3: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_4: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_5: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_6: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Cycle_Repetitions: { dynamic: !0, name: "Cycle Repetitions", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Interpolate_Palette: { dynamic: !0, name: "Interpolate Palette", type: PZ.property.type.OPTION, value: 1, step: 1, items: "Off;On" },
    Modify: { dynamic: !0, name: "Modify", type: PZ.property.type.OPTION, value: 0, step: 1, items: "As Is;R;G;B;RG;GB;RB;Hue;Lightness;Saturation;Hue+Lightness;Sat+Lightness;Hue+Saturation;Original" },
    Modify_Alpha: { dynamic: !0, name: "Modify Alpha", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Off;On" },
    Change_Empty_Pixels: { dynamic: !0, name: "Change Empty Pixels", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Off;On" },
    Matching_Colors: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Matching_Tolerance: { dynamic: !0, name: "Matching Tolerance", type: PZ.property.type.NUMBER, value: 0.5, step: 0.1 },
    Matching_Softness: { dynamic: !0, name: "Matching Softness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Matching_Mode: { dynamic: !0, name: "Matching Mode", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Off;RGB;Hue;Saturation" },
    Masking_Mode: { dynamic: !0, name: "Masking Mode", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Off;Luminance;Alpha;Inverted Luminance;Inverted Alpha" },
    Composite_Over_Layer: { dynamic: !0, name: "Composite Over Layer", type: PZ.property.type.OPTION, value: 1, step: 1, items: "Off;On" },
    Blend_With_Original: { dynamic: !0, name: "Blend With Original", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
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
        Get_Phase_From: { type: "f", value: 0 },
        Add_Mode: { type: "f", value: 0 },
        Phase_Shift: { type: "f", value: 0 },
        Color_1: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_2: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_3: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_4: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_5: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_6: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Cycle_Repetitions: { type: "f", value: 1 },
        Interpolate_Palette: { type: "f", value: 1 },
        Modify: { type: "f", value: 0 },
        Modify_Alpha: { type: "f", value: 0 },
        Change_Empty_Pixels: { type: "f", value: 0 },
        Matching_Colors: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Matching_Tolerance: { type: "f", value: 0.5 },
        Matching_Softness: { type: "f", value: 0 },
        Matching_Mode: { type: "f", value: 0 },
        Masking_Mode: { type: "f", value: 0 },
        Composite_Over_Layer: { type: "f", value: 1 },
        Blend_With_Original: { type: "f", value: 0 },
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
    u.Get_Phase_From.value = this.properties.Get_Phase_From.get(e);
    u.Add_Mode.value = this.properties.Add_Mode.get(e);
    u.Phase_Shift.value = this.properties.Phase_Shift.get(e);
    u.Color_1.value.set(this.properties.Color_1.get(e)[0]||0, this.properties.Color_1.get(e)[1]||0, this.properties.Color_1.get(e)[2]||0);
    u.Color_2.value.set(this.properties.Color_2.get(e)[0]||0, this.properties.Color_2.get(e)[1]||0, this.properties.Color_2.get(e)[2]||0);
    u.Color_3.value.set(this.properties.Color_3.get(e)[0]||0, this.properties.Color_3.get(e)[1]||0, this.properties.Color_3.get(e)[2]||0);
    u.Color_4.value.set(this.properties.Color_4.get(e)[0]||0, this.properties.Color_4.get(e)[1]||0, this.properties.Color_4.get(e)[2]||0);
    u.Color_5.value.set(this.properties.Color_5.get(e)[0]||0, this.properties.Color_5.get(e)[1]||0, this.properties.Color_5.get(e)[2]||0);
    u.Color_6.value.set(this.properties.Color_6.get(e)[0]||0, this.properties.Color_6.get(e)[1]||0, this.properties.Color_6.get(e)[2]||0);
    u.Cycle_Repetitions.value = this.properties.Cycle_Repetitions.get(e);
    u.Interpolate_Palette.value = this.properties.Interpolate_Palette.get(e);
    u.Modify.value = this.properties.Modify.get(e);
    u.Modify_Alpha.value = this.properties.Modify_Alpha.get(e);
    u.Change_Empty_Pixels.value = this.properties.Change_Empty_Pixels.get(e);
    u.Matching_Colors.value.set(this.properties.Matching_Colors.get(e)[0]||0, this.properties.Matching_Colors.get(e)[1]||0, this.properties.Matching_Colors.get(e)[2]||0);
    u.Matching_Tolerance.value = this.properties.Matching_Tolerance.get(e);
    u.Matching_Softness.value = this.properties.Matching_Softness.get(e);
    u.Matching_Mode.value = this.properties.Matching_Mode.get(e);
    u.Masking_Mode.value = this.properties.Masking_Mode.get(e);
    u.Composite_Over_Layer.value = this.properties.Composite_Over_Layer.get(e);
    u.Blend_With_Original.value = this.properties.Blend_With_Original.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
