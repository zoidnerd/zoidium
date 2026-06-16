// S_Shake (AlipFX) - Zoidium custom effect
// Source: S_Shake (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/s_shake.glsl

(this.defaultName = "S Shake"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Position and RGB shake with X/Y/Z/Tilt per-axis amp.",
  }),
  (this.shaderfile = "preset/s_shake"),
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
    Style: { dynamic: !0, name: "Style", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Smooth;Twitch;Jumpy" },
    Amplitude: { dynamic: !0, name: "Amplitude", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Frequency: { dynamic: !0, name: "Frequency", type: PZ.property.type.NUMBER, value: 8, step: 0.1 },
    Phase: { dynamic: !0, name: "Phase", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Z_Dist: { dynamic: !0, name: "Z Dist", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Motion_Blur: { dynamic: !0, name: "Motion Blur", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Off;On" },
    Mo_Blur_Length: { dynamic: !0, name: "Mo Blur Length", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Seed: { dynamic: !0, name: "Seed", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Wrap_X: { dynamic: !0, name: "Wrap X", type: PZ.property.type.OPTION, value: 2, step: 1, items: "None;Wrap;Reflect" },
    Wrap_Y: { dynamic: !0, name: "Wrap Y", type: PZ.property.type.OPTION, value: 2, step: 1, items: "None;Wrap;Reflect" },
    X_Rand_Amp: { dynamic: !0, name: "X Rand Amp", type: PZ.property.type.NUMBER, value: 192, step: 0.1 },
    X_Rand_Freq: { dynamic: !0, name: "X Rand Freq", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    X_Wave_Amp: { dynamic: !0, name: "X Wave Amp", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    X_Wave_Freq: { dynamic: !0, name: "X Wave Freq", type: PZ.property.type.NUMBER, value: 0.5, step: 0.1 },
    X_Phase: { dynamic: !0, name: "X Phase", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Y_Rand_Amp: { dynamic: !0, name: "Y Rand Amp", type: PZ.property.type.NUMBER, value: 96, step: 0.1 },
    Y_Rand_Freq: { dynamic: !0, name: "Y Rand Freq", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Y_Wave_Amp: { dynamic: !0, name: "Y Wave Amp", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Y_Wave_Freq: { dynamic: !0, name: "Y Wave Freq", type: PZ.property.type.NUMBER, value: 0.5, step: 0.1 },
    Y_Phase: { dynamic: !0, name: "Y Phase", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Z_Rand_Amp: { dynamic: !0, name: "Z Rand Amp", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Z_Rand_Freq: { dynamic: !0, name: "Z Rand Freq", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Z_Wave_Amp: { dynamic: !0, name: "Z Wave Amp", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Z_Wave_Freq: { dynamic: !0, name: "Z Wave Freq", type: PZ.property.type.NUMBER, value: 0.5, step: 0.1 },
    Z_Phase: { dynamic: !0, name: "Z Phase", type: PZ.property.type.NUMBER, value: 8, step: 0.1 },
    Tilt_Rand_Amp: { dynamic: !0, name: "Tilt Rand Amp", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Tilt_Rand_Freq: { dynamic: !0, name: "Tilt Rand Freq", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Tilt_Wave_Amp: { dynamic: !0, name: "Tilt Wave Amp", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Tilt_Wave_Freq: { dynamic: !0, name: "Tilt Wave Freq", type: PZ.property.type.NUMBER, value: 0.5, step: 0.1 },
    Tilt_Phase: { dynamic: !0, name: "Tilt Phase", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Red_Amplitude: { dynamic: !0, name: "Red Amplitude", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Green_Amplitude: { dynamic: !0, name: "Green Amplitude", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Blue_Amplitude: { dynamic: !0, name: "Blue Amplitude", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Red_Phase: { dynamic: !0, name: "Red Phase", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Green_Phase: { dynamic: !0, name: "Green Phase", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Blue_Phase: { dynamic: !0, name: "Blue Phase", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    RGB_Randomness: { dynamic: !0, name: "RGB Randomness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    RGB_Frequency: { dynamic: !0, name: "RGB Frequency", type: PZ.property.type.NUMBER, value: 2, step: 0.1 },
    Crop_Left: { dynamic: !0, name: "Crop Left", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Crop_Right: { dynamic: !0, name: "Crop Right", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Crop_Top: { dynamic: !0, name: "Crop Top", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Crop_Bottom: { dynamic: !0, name: "Crop Bottom", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
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
        Style: { type: "f", value: 0 },
        Amplitude: { type: "f", value: 1 },
        Frequency: { type: "f", value: 8 },
        Phase: { type: "f", value: 0 },
        Z_Dist: { type: "f", value: 1 },
        Motion_Blur: { type: "f", value: 0 },
        Mo_Blur_Length: { type: "f", value: 1 },
        Seed: { type: "f", value: 0 },
        Wrap_X: { type: "f", value: 2 },
        Wrap_Y: { type: "f", value: 2 },
        X_Rand_Amp: { type: "f", value: 192 },
        X_Rand_Freq: { type: "f", value: 1 },
        X_Wave_Amp: { type: "f", value: 0 },
        X_Wave_Freq: { type: "f", value: 0.5 },
        X_Phase: { type: "f", value: 0 },
        Y_Rand_Amp: { type: "f", value: 96 },
        Y_Rand_Freq: { type: "f", value: 1 },
        Y_Wave_Amp: { type: "f", value: 0 },
        Y_Wave_Freq: { type: "f", value: 0.5 },
        Y_Phase: { type: "f", value: 0 },
        Z_Rand_Amp: { type: "f", value: 0 },
        Z_Rand_Freq: { type: "f", value: 1 },
        Z_Wave_Amp: { type: "f", value: 0 },
        Z_Wave_Freq: { type: "f", value: 0.5 },
        Z_Phase: { type: "f", value: 8 },
        Tilt_Rand_Amp: { type: "f", value: 0 },
        Tilt_Rand_Freq: { type: "f", value: 1 },
        Tilt_Wave_Amp: { type: "f", value: 0 },
        Tilt_Wave_Freq: { type: "f", value: 0.5 },
        Tilt_Phase: { type: "f", value: 0 },
        Red_Amplitude: { type: "f", value: 1 },
        Green_Amplitude: { type: "f", value: 1 },
        Blue_Amplitude: { type: "f", value: 1 },
        Red_Phase: { type: "f", value: 0 },
        Green_Phase: { type: "f", value: 0 },
        Blue_Phase: { type: "f", value: 0 },
        RGB_Randomness: { type: "f", value: 0 },
        RGB_Frequency: { type: "f", value: 2 },
        Crop_Left: { type: "f", value: 0 },
        Crop_Right: { type: "f", value: 0 },
        Crop_Top: { type: "f", value: 0 },
        Crop_Bottom: { type: "f", value: 0 },
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
    u.Style.value = this.properties.Style.get(e);
    u.Amplitude.value = this.properties.Amplitude.get(e);
    u.Frequency.value = this.properties.Frequency.get(e);
    u.Phase.value = this.properties.Phase.get(e);
    u.Z_Dist.value = this.properties.Z_Dist.get(e);
    u.Motion_Blur.value = this.properties.Motion_Blur.get(e);
    u.Mo_Blur_Length.value = this.properties.Mo_Blur_Length.get(e);
    u.Seed.value = this.properties.Seed.get(e);
    u.Wrap_X.value = this.properties.Wrap_X.get(e);
    u.Wrap_Y.value = this.properties.Wrap_Y.get(e);
    u.X_Rand_Amp.value = this.properties.X_Rand_Amp.get(e);
    u.X_Rand_Freq.value = this.properties.X_Rand_Freq.get(e);
    u.X_Wave_Amp.value = this.properties.X_Wave_Amp.get(e);
    u.X_Wave_Freq.value = this.properties.X_Wave_Freq.get(e);
    u.X_Phase.value = this.properties.X_Phase.get(e);
    u.Y_Rand_Amp.value = this.properties.Y_Rand_Amp.get(e);
    u.Y_Rand_Freq.value = this.properties.Y_Rand_Freq.get(e);
    u.Y_Wave_Amp.value = this.properties.Y_Wave_Amp.get(e);
    u.Y_Wave_Freq.value = this.properties.Y_Wave_Freq.get(e);
    u.Y_Phase.value = this.properties.Y_Phase.get(e);
    u.Z_Rand_Amp.value = this.properties.Z_Rand_Amp.get(e);
    u.Z_Rand_Freq.value = this.properties.Z_Rand_Freq.get(e);
    u.Z_Wave_Amp.value = this.properties.Z_Wave_Amp.get(e);
    u.Z_Wave_Freq.value = this.properties.Z_Wave_Freq.get(e);
    u.Z_Phase.value = this.properties.Z_Phase.get(e);
    u.Tilt_Rand_Amp.value = this.properties.Tilt_Rand_Amp.get(e);
    u.Tilt_Rand_Freq.value = this.properties.Tilt_Rand_Freq.get(e);
    u.Tilt_Wave_Amp.value = this.properties.Tilt_Wave_Amp.get(e);
    u.Tilt_Wave_Freq.value = this.properties.Tilt_Wave_Freq.get(e);
    u.Tilt_Phase.value = this.properties.Tilt_Phase.get(e);
    u.Red_Amplitude.value = this.properties.Red_Amplitude.get(e);
    u.Green_Amplitude.value = this.properties.Green_Amplitude.get(e);
    u.Blue_Amplitude.value = this.properties.Blue_Amplitude.get(e);
    u.Red_Phase.value = this.properties.Red_Phase.get(e);
    u.Green_Phase.value = this.properties.Green_Phase.get(e);
    u.Blue_Phase.value = this.properties.Blue_Phase.get(e);
    u.RGB_Randomness.value = this.properties.RGB_Randomness.get(e);
    u.RGB_Frequency.value = this.properties.RGB_Frequency.get(e);
    u.Crop_Left.value = this.properties.Crop_Left.get(e);
    u.Crop_Right.value = this.properties.Crop_Right.get(e);
    u.Crop_Top.value = this.properties.Crop_Top.get(e);
    u.Crop_Bottom.value = this.properties.Crop_Bottom.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
