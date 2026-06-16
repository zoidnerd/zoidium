// A_Wiggle (AlipFX) - Zoidium custom effect
// Source: A_Wiggle (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/a_wiggle.glsl

(this.defaultName = "A Wiggle"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Jiggles the image with position, scale, and rotation wobble.",
  }),
  (this.shaderfile = "preset/a_wiggle"),
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
    Wiggle_Type: { dynamic: !0, name: "Wiggle Type", type: PZ.property.type.OPTION, value: 0, items: "Smooth Random;Consistent Amplitude" },
    Global_Amplitude: { dynamic: !0, name: "Global Amplitude", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Global_Frequency: { dynamic: !0, name: "Global Frequency", type: PZ.property.type.NUMBER, value: 2, step: 0.1 },
    Anchor_Point: { dynamic: !0, name: "Anchor Point", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Pos_Separate_Dimension: { dynamic: !0, name: "Pos Separate Dimension", type: PZ.property.type.OPTION, value: 1, items: "Disabled;Enabled" },
    Pos_X: { dynamic: !0, name: "Pos X", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Pos_Freq_X_Mult: { dynamic: !0, name: "Pos Freq X Mult", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Pos_Y: { dynamic: !0, name: "Pos Y", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Pos_Freq_Y_Mult: { dynamic: !0, name: "Pos Freq Y Mult", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Scale_Separate_Dimension: { dynamic: !0, name: "Scale Separate Dimension", type: PZ.property.type.OPTION, value: 0, items: "Disabled;Enabled" },
    Scale_X: { dynamic: !0, name: "Scale X", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Scale_Freq_X_Mult: { dynamic: !0, name: "Scale Freq X Mult", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Scale_Y: { dynamic: !0, name: "Scale Y", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Scale_Freq_Y_Mult: { dynamic: !0, name: "Scale Freq Y Mult", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Rot_Angle: { dynamic: !0, name: "Rot Angle", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Rot_Freq_Mult: { dynamic: !0, name: "Rot Freq Mult", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Random_Seed: { dynamic: !0, name: "Random Seed", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
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
        Wiggle_Type: { type: "f", value: 0 },
        Global_Amplitude: { type: "f", value: 100 },
        Global_Frequency: { type: "f", value: 2 },
        Anchor_Point: { type: "v2", value: new THREE.Vector2(0, 0) },
        Pos_Separate_Dimension: { type: "f", value: 1 },
        Pos_X: { type: "f", value: 50 },
        Pos_Freq_X_Mult: { type: "f", value: 1 },
        Pos_Y: { type: "f", value: 50 },
        Pos_Freq_Y_Mult: { type: "f", value: 1 },
        Scale_Separate_Dimension: { type: "f", value: 0 },
        Scale_X: { type: "f", value: 0 },
        Scale_Freq_X_Mult: { type: "f", value: 1 },
        Scale_Y: { type: "f", value: 0 },
        Scale_Freq_Y_Mult: { type: "f", value: 1 },
        Rot_Angle: { type: "f", value: 0 },
        Rot_Freq_Mult: { type: "f", value: 1 },
        Random_Seed: { type: "f", value: 1 },
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
    u.Wiggle_Type.value = this.properties.Wiggle_Type.get(e);
    u.Global_Amplitude.value = this.properties.Global_Amplitude.get(e);
    u.Global_Frequency.value = this.properties.Global_Frequency.get(e);
    const _Anchor_Point = this.properties.Anchor_Point.get(e); u.Anchor_Point.value.set(_Anchor_Point[0]||0, _Anchor_Point[1]||0);
    u.Pos_Separate_Dimension.value = this.properties.Pos_Separate_Dimension.get(e);
    u.Pos_X.value = this.properties.Pos_X.get(e);
    u.Pos_Freq_X_Mult.value = this.properties.Pos_Freq_X_Mult.get(e);
    u.Pos_Y.value = this.properties.Pos_Y.get(e);
    u.Pos_Freq_Y_Mult.value = this.properties.Pos_Freq_Y_Mult.get(e);
    u.Scale_Separate_Dimension.value = this.properties.Scale_Separate_Dimension.get(e);
    u.Scale_X.value = this.properties.Scale_X.get(e);
    u.Scale_Freq_X_Mult.value = this.properties.Scale_Freq_X_Mult.get(e);
    u.Scale_Y.value = this.properties.Scale_Y.get(e);
    u.Scale_Freq_Y_Mult.value = this.properties.Scale_Freq_Y_Mult.get(e);
    u.Rot_Angle.value = this.properties.Rot_Angle.get(e);
    u.Rot_Freq_Mult.value = this.properties.Rot_Freq_Mult.get(e);
    u.Random_Seed.value = this.properties.Random_Seed.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
