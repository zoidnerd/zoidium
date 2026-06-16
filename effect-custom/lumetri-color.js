// Lumetri Color (AlipFX) - Zoidium custom effect
// Source: Lumetri Color (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/lumetri-color.glsl

(this.defaultName = "Lumetri Color"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Full color grading with curves, wheels, secondary and vignette.",
  }),
  (this.shaderfile = "preset/lumetri-color"),
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
    WB_Selector: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Temperature: { dynamic: !0, name: "Temperature", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Tint: { dynamic: !0, name: "Tint", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Exposure: { dynamic: !0, name: "Exposure", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Contrast: { dynamic: !0, name: "Contrast", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Highlights: { dynamic: !0, name: "Highlights", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Shadows: { dynamic: !0, name: "Shadows", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Whites: { dynamic: !0, name: "Whites", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Blacks: { dynamic: !0, name: "Blacks", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Saturation_Basic: { dynamic: !0, name: "Saturation Basic", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Faded_Film: { dynamic: !0, name: "Faded Film", type: PZ.property.type.NUMBER, value: 64.6, step: 0.1 },
    Sharpen: { dynamic: !0, name: "Sharpen", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Vibrance: { dynamic: !0, name: "Vibrance", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Saturation_Creative: { dynamic: !0, name: "Saturation Creative", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Highlight_Tint: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Shadow_Tint: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Tint_Balance: { dynamic: !0, name: "Tint Balance", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    RGBW_Modes: { dynamic: !0, name: "RGBW Modes", type: PZ.property.type.OPTION, value: 1, step: 1, items: "Luminance;Red;Green;Blue" },
    Curve_Shadow: { dynamic: !0, name: "Curve Shadow", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Curve_Highlight: { dynamic: !0, name: "Curve Highlight", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Hue_Selector: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Saturation_Selector: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Luma_Selector: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Curve_Hue: { dynamic: !0, name: "Curve Hue", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Curve_Sat: { dynamic: !0, name: "Curve Sat", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Curve_Luma: { dynamic: !0, name: "Curve Luma", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    CW_Highlights: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    CW_Midtones: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    CW_Shadows: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Secondary_Set_Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Secondary_Add_Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Secondary_Remove_Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Secondary_Show_Mask: { dynamic: !0, name: "Secondary Show Mask", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Off;On" },
    Secondary_Mask_View: { dynamic: !0, name: "Secondary Mask View", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Color;Desat;Grayscale" },
    Secondary_Invert_Mask: { dynamic: !0, name: "Secondary Invert Mask", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Off;On" },
    Secondary_Hue_Range: { dynamic: !0, name: "Secondary Hue Range", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Secondary_Hue_Feather: { dynamic: !0, name: "Secondary Hue Feather", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Secondary_Sat_Range: { dynamic: !0, name: "Secondary Sat Range", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Secondary_Sat_Feather: { dynamic: !0, name: "Secondary Sat Feather", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Secondary_Lum_Range: { dynamic: !0, name: "Secondary Lum Range", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Secondary_Lum_Feather: { dynamic: !0, name: "Secondary Lum Feather", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Secondary_Denoise: { dynamic: !0, name: "Secondary Denoise", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Secondary_Blur: { dynamic: !0, name: "Secondary Blur", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Secondary_Color_Wheels: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Secondary_Temperature: { dynamic: !0, name: "Secondary Temperature", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Secondary_Tint: { dynamic: !0, name: "Secondary Tint", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Secondary_Contrast: { dynamic: !0, name: "Secondary Contrast", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Secondary_Sharpen: { dynamic: !0, name: "Secondary Sharpen", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Secondary_Saturation: { dynamic: !0, name: "Secondary Saturation", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Vignette_Amount: { dynamic: !0, name: "Vignette Amount", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Vignette_Midpoint: { dynamic: !0, name: "Vignette Midpoint", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Vignette_Roundness: { dynamic: !0, name: "Vignette Roundness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Vignette_Feather: { dynamic: !0, name: "Vignette Feather", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
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
        WB_Selector: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Temperature: { type: "f", value: 0 },
        Tint: { type: "f", value: 0 },
        Exposure: { type: "f", value: 0 },
        Contrast: { type: "f", value: 0 },
        Highlights: { type: "f", value: 0 },
        Shadows: { type: "f", value: 0 },
        Whites: { type: "f", value: 0 },
        Blacks: { type: "f", value: 0 },
        Saturation_Basic: { type: "f", value: 100 },
        Faded_Film: { type: "f", value: 64.6 },
        Sharpen: { type: "f", value: 50 },
        Vibrance: { type: "f", value: 0 },
        Saturation_Creative: { type: "f", value: 100 },
        Highlight_Tint: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Shadow_Tint: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Tint_Balance: { type: "f", value: 0 },
        RGBW_Modes: { type: "f", value: 1 },
        Curve_Shadow: { type: "f", value: 0 },
        Curve_Highlight: { type: "f", value: 0 },
        Hue_Selector: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Saturation_Selector: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Luma_Selector: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Curve_Hue: { type: "f", value: 0 },
        Curve_Sat: { type: "f", value: 0 },
        Curve_Luma: { type: "f", value: 0 },
        CW_Highlights: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        CW_Midtones: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        CW_Shadows: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Secondary_Set_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Secondary_Add_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Secondary_Remove_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Secondary_Show_Mask: { type: "f", value: 0 },
        Secondary_Mask_View: { type: "f", value: 0 },
        Secondary_Invert_Mask: { type: "f", value: 0 },
        Secondary_Hue_Range: { type: "f", value: 0 },
        Secondary_Hue_Feather: { type: "f", value: 0 },
        Secondary_Sat_Range: { type: "f", value: 0 },
        Secondary_Sat_Feather: { type: "f", value: 0 },
        Secondary_Lum_Range: { type: "f", value: 0 },
        Secondary_Lum_Feather: { type: "f", value: 0 },
        Secondary_Denoise: { type: "f", value: 0 },
        Secondary_Blur: { type: "f", value: 0 },
        Secondary_Color_Wheels: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Secondary_Temperature: { type: "f", value: 0 },
        Secondary_Tint: { type: "f", value: 0 },
        Secondary_Contrast: { type: "f", value: 0 },
        Secondary_Sharpen: { type: "f", value: 0 },
        Secondary_Saturation: { type: "f", value: 100 },
        Vignette_Amount: { type: "f", value: 0 },
        Vignette_Midpoint: { type: "f", value: 50 },
        Vignette_Roundness: { type: "f", value: 0 },
        Vignette_Feather: { type: "f", value: 50 },
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
    u.WB_Selector.value.set(this.properties.WB_Selector.get(e)[0]||0, this.properties.WB_Selector.get(e)[1]||0, this.properties.WB_Selector.get(e)[2]||0);
    u.Temperature.value = this.properties.Temperature.get(e);
    u.Tint.value = this.properties.Tint.get(e);
    u.Exposure.value = this.properties.Exposure.get(e);
    u.Contrast.value = this.properties.Contrast.get(e);
    u.Highlights.value = this.properties.Highlights.get(e);
    u.Shadows.value = this.properties.Shadows.get(e);
    u.Whites.value = this.properties.Whites.get(e);
    u.Blacks.value = this.properties.Blacks.get(e);
    u.Saturation_Basic.value = this.properties.Saturation_Basic.get(e);
    u.Faded_Film.value = this.properties.Faded_Film.get(e);
    u.Sharpen.value = this.properties.Sharpen.get(e);
    u.Vibrance.value = this.properties.Vibrance.get(e);
    u.Saturation_Creative.value = this.properties.Saturation_Creative.get(e);
    u.Highlight_Tint.value.set(this.properties.Highlight_Tint.get(e)[0]||0, this.properties.Highlight_Tint.get(e)[1]||0, this.properties.Highlight_Tint.get(e)[2]||0);
    u.Shadow_Tint.value.set(this.properties.Shadow_Tint.get(e)[0]||0, this.properties.Shadow_Tint.get(e)[1]||0, this.properties.Shadow_Tint.get(e)[2]||0);
    u.Tint_Balance.value = this.properties.Tint_Balance.get(e);
    u.RGBW_Modes.value = this.properties.RGBW_Modes.get(e);
    u.Curve_Shadow.value = this.properties.Curve_Shadow.get(e);
    u.Curve_Highlight.value = this.properties.Curve_Highlight.get(e);
    u.Hue_Selector.value.set(this.properties.Hue_Selector.get(e)[0]||0, this.properties.Hue_Selector.get(e)[1]||0, this.properties.Hue_Selector.get(e)[2]||0);
    u.Saturation_Selector.value.set(this.properties.Saturation_Selector.get(e)[0]||0, this.properties.Saturation_Selector.get(e)[1]||0, this.properties.Saturation_Selector.get(e)[2]||0);
    u.Luma_Selector.value.set(this.properties.Luma_Selector.get(e)[0]||0, this.properties.Luma_Selector.get(e)[1]||0, this.properties.Luma_Selector.get(e)[2]||0);
    u.Curve_Hue.value = this.properties.Curve_Hue.get(e);
    u.Curve_Sat.value = this.properties.Curve_Sat.get(e);
    u.Curve_Luma.value = this.properties.Curve_Luma.get(e);
    u.CW_Highlights.value.set(this.properties.CW_Highlights.get(e)[0]||0, this.properties.CW_Highlights.get(e)[1]||0, this.properties.CW_Highlights.get(e)[2]||0);
    u.CW_Midtones.value.set(this.properties.CW_Midtones.get(e)[0]||0, this.properties.CW_Midtones.get(e)[1]||0, this.properties.CW_Midtones.get(e)[2]||0);
    u.CW_Shadows.value.set(this.properties.CW_Shadows.get(e)[0]||0, this.properties.CW_Shadows.get(e)[1]||0, this.properties.CW_Shadows.get(e)[2]||0);
    u.Secondary_Set_Color.value.set(this.properties.Secondary_Set_Color.get(e)[0]||0, this.properties.Secondary_Set_Color.get(e)[1]||0, this.properties.Secondary_Set_Color.get(e)[2]||0);
    u.Secondary_Add_Color.value.set(this.properties.Secondary_Add_Color.get(e)[0]||0, this.properties.Secondary_Add_Color.get(e)[1]||0, this.properties.Secondary_Add_Color.get(e)[2]||0);
    u.Secondary_Remove_Color.value.set(this.properties.Secondary_Remove_Color.get(e)[0]||0, this.properties.Secondary_Remove_Color.get(e)[1]||0, this.properties.Secondary_Remove_Color.get(e)[2]||0);
    u.Secondary_Show_Mask.value = this.properties.Secondary_Show_Mask.get(e);
    u.Secondary_Mask_View.value = this.properties.Secondary_Mask_View.get(e);
    u.Secondary_Invert_Mask.value = this.properties.Secondary_Invert_Mask.get(e);
    u.Secondary_Hue_Range.value = this.properties.Secondary_Hue_Range.get(e);
    u.Secondary_Hue_Feather.value = this.properties.Secondary_Hue_Feather.get(e);
    u.Secondary_Sat_Range.value = this.properties.Secondary_Sat_Range.get(e);
    u.Secondary_Sat_Feather.value = this.properties.Secondary_Sat_Feather.get(e);
    u.Secondary_Lum_Range.value = this.properties.Secondary_Lum_Range.get(e);
    u.Secondary_Lum_Feather.value = this.properties.Secondary_Lum_Feather.get(e);
    u.Secondary_Denoise.value = this.properties.Secondary_Denoise.get(e);
    u.Secondary_Blur.value = this.properties.Secondary_Blur.get(e);
    u.Secondary_Color_Wheels.value.set(this.properties.Secondary_Color_Wheels.get(e)[0]||0, this.properties.Secondary_Color_Wheels.get(e)[1]||0, this.properties.Secondary_Color_Wheels.get(e)[2]||0);
    u.Secondary_Temperature.value = this.properties.Secondary_Temperature.get(e);
    u.Secondary_Tint.value = this.properties.Secondary_Tint.get(e);
    u.Secondary_Contrast.value = this.properties.Secondary_Contrast.get(e);
    u.Secondary_Sharpen.value = this.properties.Secondary_Sharpen.get(e);
    u.Secondary_Saturation.value = this.properties.Secondary_Saturation.get(e);
    u.Vignette_Amount.value = this.properties.Vignette_Amount.get(e);
    u.Vignette_Midpoint.value = this.properties.Vignette_Midpoint.get(e);
    u.Vignette_Roundness.value = this.properties.Vignette_Roundness.get(e);
    u.Vignette_Feather.value = this.properties.Vignette_Feather.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
