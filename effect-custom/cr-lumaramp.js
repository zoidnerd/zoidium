// CR-LumaRamp (AlipFX) - Zoidium custom effect
// Source: CR-LumaRamp (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/cr-lumaramp.glsl

(this.defaultName = "CR-LumaRamp"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Cross-process luma-based gradient ramp with multiple color stops.",
  }),
  (this.shaderfile = "preset/cr-lumaramp"),
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
    Color_1: { dynamic: !0, name: "Color 1", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_2: { dynamic: !0, name: "Color 2", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_3: { dynamic: !0, name: "Color 3", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_4: { dynamic: !0, name: "Color 4", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_5: { dynamic: !0, name: "Color 5", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_6: { dynamic: !0, name: "Color 6", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_7: { dynamic: !0, name: "Color 7", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_8: { dynamic: !0, name: "Color 8", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Gradient_Colors: { dynamic: !0, name: "Gradient Colors", type: PZ.property.type.NUMBER, value: 8, step: 0.1 },
    Preset: { dynamic: !0, name: "Preset", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Interpolation: { dynamic: !0, name: "Interpolation", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Invert: { dynamic: !0, name: "Invert", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Repeats: { dynamic: !0, name: "Repeats", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
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
        Color_1: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_2: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_3: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_4: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_5: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_6: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_7: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_8: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Gradient_Colors: { type: "f", value: 8 },
        Preset: { type: "f", value: 0 },
        Interpolation: { type: "f", value: 0 },
        Invert: { type: "f", value: 0 },
        Repeats: { type: "f", value: 0 },
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
        u.Color_1.value.set(this.properties.Color_1.get(e)[0]||0, this.properties.Color_1.get(e)[1]||0, this.properties.Color_1.get(e)[2]||0);
        u.Color_2.value.set(this.properties.Color_2.get(e)[0]||0, this.properties.Color_2.get(e)[1]||0, this.properties.Color_2.get(e)[2]||0);
        u.Color_3.value.set(this.properties.Color_3.get(e)[0]||0, this.properties.Color_3.get(e)[1]||0, this.properties.Color_3.get(e)[2]||0);
        u.Color_4.value.set(this.properties.Color_4.get(e)[0]||0, this.properties.Color_4.get(e)[1]||0, this.properties.Color_4.get(e)[2]||0);
        u.Color_5.value.set(this.properties.Color_5.get(e)[0]||0, this.properties.Color_5.get(e)[1]||0, this.properties.Color_5.get(e)[2]||0);
        u.Color_6.value.set(this.properties.Color_6.get(e)[0]||0, this.properties.Color_6.get(e)[1]||0, this.properties.Color_6.get(e)[2]||0);
        u.Color_7.value.set(this.properties.Color_7.get(e)[0]||0, this.properties.Color_7.get(e)[1]||0, this.properties.Color_7.get(e)[2]||0);
        u.Color_8.value.set(this.properties.Color_8.get(e)[0]||0, this.properties.Color_8.get(e)[1]||0, this.properties.Color_8.get(e)[2]||0);
        u.Gradient_Colors.value = this.properties.Gradient_Colors.get(e);
        u.Preset.value = this.properties.Preset.get(e);
        u.Interpolation.value = this.properties.Interpolation.get(e);
        u.Invert.value = this.properties.Invert.get(e);
        u.Repeats.value = this.properties.Repeats.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
