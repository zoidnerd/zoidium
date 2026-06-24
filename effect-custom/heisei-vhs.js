// HEISEI-VHS (AlipFX) - Zoidium custom effect
// Source: HEISEI-VHS (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/heisei-vhs.glsl

(this.defaultName = "HEISEI-VHS"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Heisei-era VHS look with JPEG noise, chroma bleed, scanlines, and dropout.",
  }),
  (this.shaderfile = "preset/heisei-vhs"),
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
    Apply_JPEG_Block_Noise: { dynamic: !0, name: "Apply Jpeg Block Noise", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    JPEG_Quality: { dynamic: !0, name: "Jpeg Quality", type: PZ.property.type.NUMBER, value: 10, step: 0.1 },
    Crush_Blacks: { dynamic: !0, name: "Crush Blacks", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Blow_out_Whites: { dynamic: !0, name: "Blow Out Whites", type: PZ.property.type.NUMBER, value: 181.5, step: 1.0 },
    Apply_Thick_Ringing: { dynamic: !0, name: "Apply Thick Ringing", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Sharpen_Intensity: { dynamic: !0, name: "Sharpen Intensity", type: PZ.property.type.NUMBER, value: 10.51, step: 0.1 },
    Sharpen_Width: { dynamic: !0, name: "Sharpen Width", type: PZ.property.type.NUMBER, value: 1.9, step: 0.1 },
    Apply_Color_Cast: { dynamic: !0, name: "Apply Color Cast", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Red_Tint_Shift: { dynamic: !0, name: "Red Tint Shift", type: PZ.property.type.NUMBER, value: 0.99, step: 0.1 },
    Green_Tint_Shift: { dynamic: !0, name: "Green Tint Shift", type: PZ.property.type.NUMBER, value: 1.02, step: 0.1 },
    Blue_Tint_Shift: { dynamic: !0, name: "Blue Tint Shift", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Luminance_Bandwidth: { dynamic: !0, name: "Luminance Bandwidth", type: PZ.property.type.NUMBER, value: 0.41, step: 0.1 },
    Chroma_I_Bandwidth: { dynamic: !0, name: "Chroma I Bandwidth", type: PZ.property.type.NUMBER, value: 0.04, step: 0.1 },
    Chroma_Q_Bandwidth: { dynamic: !0, name: "Chroma Q Bandwidth", type: PZ.property.type.NUMBER, value: 0.04, step: 0.1 },
    Chroma_Crosstalk: { dynamic: !0, name: "Chroma Crosstalk", type: PZ.property.type.NUMBER, value: 0.41, step: 0.1 },
    Chroma_Shift_X: { dynamic: !0, name: "Chroma Shift X", type: PZ.property.type.NUMBER, value: 6, step: 0.1 },
    Luma_Noise: { dynamic: !0, name: "Luma Noise", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Chroma_Noise: { dynamic: !0, name: "Chroma Noise", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Jitter_Frequency: { dynamic: !0, name: "Jitter Frequency", type: PZ.property.type.NUMBER, value: 12.11, step: 0.1 },
    Jitter_Amplitude: { dynamic: !0, name: "Jitter Amplitude", type: PZ.property.type.NUMBER, value: 19.54, step: 0.1 },
    Independent_Jitter: { dynamic: !0, name: "Independent Jitter", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Jitter_Roughness: { dynamic: !0, name: "Jitter Roughness", type: PZ.property.type.NUMBER, value: 13.52, step: 0.1 },
    Head_Switch_Height: { dynamic: !0, name: "Head Switch Height", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Bottom_Distortion: { dynamic: !0, name: "Bottom Distortion", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Bottom_Static_Density: { dynamic: !0, name: "Bottom Static Density", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Dropout_Count: { dynamic: !0, name: "Dropout Count", type: PZ.property.type.NUMBER, value: 13, step: 0.1 },
    Scratch_Max_Length: { dynamic: !0, name: "Scratch Max Length", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Scratch_Intensity: { dynamic: !0, name: "Scratch Intensity", type: PZ.property.type.NUMBER, value: 0.38, step: 0.1 },
    Apply_Scanlines: { dynamic: !0, name: "Apply Scanlines", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Scanline_Brightness: { dynamic: !0, name: "Scanline Brightness", type: PZ.property.type.NUMBER, value: 0.5, step: 0.1 },
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
        Apply_JPEG_Block_Noise: { type: "f", value: 1 },
        JPEG_Quality: { type: "f", value: 10 },
        Crush_Blacks: { type: "f", value: 1 },
        Blow_out_Whites: { type: "f", value: 181.5 },
        Apply_Thick_Ringing: { type: "f", value: 1 },
        Sharpen_Intensity: { type: "f", value: 10.51 },
        Sharpen_Width: { type: "f", value: 1.9 },
        Apply_Color_Cast: { type: "f", value: 1 },
        Red_Tint_Shift: { type: "f", value: 0.99 },
        Green_Tint_Shift: { type: "f", value: 1.02 },
        Blue_Tint_Shift: { type: "f", value: 1 },
        Luminance_Bandwidth: { type: "f", value: 0.41 },
        Chroma_I_Bandwidth: { type: "f", value: 0.04 },
        Chroma_Q_Bandwidth: { type: "f", value: 0.04 },
        Chroma_Crosstalk: { type: "f", value: 0.41 },
        Chroma_Shift_X: { type: "f", value: 6 },
        Luma_Noise: { type: "f", value: 1 },
        Chroma_Noise: { type: "f", value: 1 },
        Jitter_Frequency: { type: "f", value: 12.11 },
        Jitter_Amplitude: { type: "f", value: 19.54 },
        Independent_Jitter: { type: "f", value: 0 },
        Jitter_Roughness: { type: "f", value: 13.52 },
        Head_Switch_Height: { type: "f", value: 0 },
        Bottom_Distortion: { type: "f", value: 0 },
        Bottom_Static_Density: { type: "f", value: 1 },
        Dropout_Count: { type: "f", value: 13 },
        Scratch_Max_Length: { type: "f", value: 0 },
        Scratch_Intensity: { type: "f", value: 0.38 },
        Apply_Scanlines: { type: "f", value: 1 },
        Scanline_Brightness: { type: "f", value: 0.5 },
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
        u.Apply_JPEG_Block_Noise.value = this.properties.Apply_JPEG_Block_Noise.get(e);
        u.JPEG_Quality.value = this.properties.JPEG_Quality.get(e);
        u.Crush_Blacks.value = this.properties.Crush_Blacks.get(e);
        u.Blow_out_Whites.value = this.properties.Blow_out_Whites.get(e);
        u.Apply_Thick_Ringing.value = this.properties.Apply_Thick_Ringing.get(e);
        u.Sharpen_Intensity.value = this.properties.Sharpen_Intensity.get(e);
        u.Sharpen_Width.value = this.properties.Sharpen_Width.get(e);
        u.Apply_Color_Cast.value = this.properties.Apply_Color_Cast.get(e);
        u.Red_Tint_Shift.value = this.properties.Red_Tint_Shift.get(e);
        u.Green_Tint_Shift.value = this.properties.Green_Tint_Shift.get(e);
        u.Blue_Tint_Shift.value = this.properties.Blue_Tint_Shift.get(e);
        u.Luminance_Bandwidth.value = this.properties.Luminance_Bandwidth.get(e);
        u.Chroma_I_Bandwidth.value = this.properties.Chroma_I_Bandwidth.get(e);
        u.Chroma_Q_Bandwidth.value = this.properties.Chroma_Q_Bandwidth.get(e);
        u.Chroma_Crosstalk.value = this.properties.Chroma_Crosstalk.get(e);
        u.Chroma_Shift_X.value = this.properties.Chroma_Shift_X.get(e);
        u.Luma_Noise.value = this.properties.Luma_Noise.get(e);
        u.Chroma_Noise.value = this.properties.Chroma_Noise.get(e);
        u.Jitter_Frequency.value = this.properties.Jitter_Frequency.get(e);
        u.Jitter_Amplitude.value = this.properties.Jitter_Amplitude.get(e);
        u.Independent_Jitter.value = this.properties.Independent_Jitter.get(e);
        u.Jitter_Roughness.value = this.properties.Jitter_Roughness.get(e);
        u.Head_Switch_Height.value = this.properties.Head_Switch_Height.get(e);
        u.Bottom_Distortion.value = this.properties.Bottom_Distortion.get(e);
        u.Bottom_Static_Density.value = this.properties.Bottom_Static_Density.get(e);
        u.Dropout_Count.value = this.properties.Dropout_Count.get(e);
        u.Scratch_Max_Length.value = this.properties.Scratch_Max_Length.get(e);
        u.Scratch_Intensity.value = this.properties.Scratch_Intensity.get(e);
        u.Apply_Scanlines.value = this.properties.Apply_Scanlines.get(e);
        u.Scanline_Brightness.value = this.properties.Scanline_Brightness.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
