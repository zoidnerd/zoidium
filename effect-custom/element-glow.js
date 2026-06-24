// Element Glow (AlipFX) - Zoidium custom effect
// Source: Element Glow (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/element-glow.glsl

(this.defaultName = "Element Glow"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Selective glow based on luminance/range with tint and blend options.",
  }),
  (this.shaderfile = "preset/element-glow"),
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
    Solid_Inner: { dynamic: !0, name: "Solid Inner", type: PZ.property.type.NUMBER, value: 0.5, step: 0.1 },
    Filled_Band: { dynamic: !0, name: "Filled Band", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Outer_Soft: { dynamic: !0, name: "Outer Soft", type: PZ.property.type.NUMBER, value: 0.2, step: 0.1 },
    Range_Mode: { dynamic: !0, name: "Range Mode", type: PZ.property.type.OPTION, value: 0, items: "Luminance;Lightness;Hue;Saturation;R;G;B;A" },
    Invert_Range: { dynamic: !0, name: "Invert Range", type: PZ.property.type.OPTION, value: 0, items: "Disabled;Enabled" },
    Radius: { dynamic: !0, name: "Radius", type: PZ.property.type.NUMBER, value: 40, step: 0.1 },
    Intensity: { dynamic: !0, name: "Intensity", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Blend: { dynamic: !0, name: "Blend", type: PZ.property.type.OPTION, value: 0, items: "Add;Screen;Normal;Under" },
    Tint: { dynamic: !0, name: "Tint", type: PZ.property.type.OPTION, value: 0, items: "Disabled;Enabled" },
    Gradient_Colors: { dynamic: !0, name: "Gradient Colors", type: PZ.property.type.NUMBER, value: 2, step: 0.1 },
    Color_1: { dynamic: !0, name: "Color 1", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_2: { dynamic: !0, name: "Color 2", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_3: { dynamic: !0, name: "Color 3", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_4: { dynamic: !0, name: "Color 4", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_5: { dynamic: !0, name: "Color 5", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_6: { dynamic: !0, name: "Color 6", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_7: { dynamic: !0, name: "Color 7", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_8: { dynamic: !0, name: "Color 8", type: PZ.property.type.COLOR, value: [0, 0, 0] },
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
        Solid_Inner: { type: "f", value: 0.5 },
        Filled_Band: { type: "f", value: 1 },
        Outer_Soft: { type: "f", value: 0.2 },
        Range_Mode: { type: "i", value: 0 },
        Invert_Range: { type: "i", value: 0 },
        Radius: { type: "f", value: 40 },
        Intensity: { type: "f", value: 100 },
        Blend: { type: "i", value: 0 },
        Tint: { type: "i", value: 0 },
        Gradient_Colors: { type: "f", value: 2 },
        Color_1: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_2: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_3: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_4: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_5: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_6: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_7: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_8: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
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
        u.Solid_Inner.value = this.properties.Solid_Inner.get(e);
        u.Filled_Band.value = this.properties.Filled_Band.get(e);
        u.Outer_Soft.value = this.properties.Outer_Soft.get(e);
        u.Range_Mode.value = Math.round(this.properties.Range_Mode.get(e));
        u.Invert_Range.value = Math.round(this.properties.Invert_Range.get(e));
        u.Radius.value = this.properties.Radius.get(e);
        u.Intensity.value = this.properties.Intensity.get(e);
        u.Blend.value = Math.round(this.properties.Blend.get(e));
        u.Tint.value = Math.round(this.properties.Tint.get(e));
        u.Gradient_Colors.value = this.properties.Gradient_Colors.get(e);
        u.Color_1.value.set(this.properties.Color_1.get(e)[0]||0, this.properties.Color_1.get(e)[1]||0, this.properties.Color_1.get(e)[2]||0);
        u.Color_2.value.set(this.properties.Color_2.get(e)[0]||0, this.properties.Color_2.get(e)[1]||0, this.properties.Color_2.get(e)[2]||0);
        u.Color_3.value.set(this.properties.Color_3.get(e)[0]||0, this.properties.Color_3.get(e)[1]||0, this.properties.Color_3.get(e)[2]||0);
        u.Color_4.value.set(this.properties.Color_4.get(e)[0]||0, this.properties.Color_4.get(e)[1]||0, this.properties.Color_4.get(e)[2]||0);
        u.Color_5.value.set(this.properties.Color_5.get(e)[0]||0, this.properties.Color_5.get(e)[1]||0, this.properties.Color_5.get(e)[2]||0);
        u.Color_6.value.set(this.properties.Color_6.get(e)[0]||0, this.properties.Color_6.get(e)[1]||0, this.properties.Color_6.get(e)[2]||0);
        u.Color_7.value.set(this.properties.Color_7.get(e)[0]||0, this.properties.Color_7.get(e)[1]||0, this.properties.Color_7.get(e)[2]||0);
        u.Color_8.value.set(this.properties.Color_8.get(e)[0]||0, this.properties.Color_8.get(e)[1]||0, this.properties.Color_8.get(e)[2]||0);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
