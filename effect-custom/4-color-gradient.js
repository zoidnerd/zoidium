// 4-Color Gradient (AlipFX) - Zoidium custom effect
// Source: 4-Color Gradient (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/4-color-gradient.glsl

(this.defaultName = "4-Color Gradient"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Four-point gradient overlay with jitter and blend mode.",
  }),
  (this.shaderfile = "preset/4-color-gradient"),
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
    Point_1: { dynamic: !0, name: "Point 1", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Color_1: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Point_2: { dynamic: !0, name: "Point 2", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Color_2: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Point_3: { dynamic: !0, name: "Point 3", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Color_3: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Point_4: { dynamic: !0, name: "Point 4", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Color_4: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Blend: { dynamic: !0, name: "Blend", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Jitter: { dynamic: !0, name: "Jitter", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Opacity: { dynamic: !0, name: "Opacity", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Blending_Mode: { dynamic: !0, name: "Blending Mode", type: PZ.property.type.OPTION, value: 1, step: 1, items: "Normal;Add;Multiply;Screen;Overlay;Soft Light;Hard Light;Color Dodge;Color Burn;Darken;Lighten;Difference;Exclusion;Hue;Saturation;Color;Luminosity" },
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
        Point_1: { type: "v2", value: new THREE.Vector2(0, 0) },
        Color_1: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Point_2: { type: "v2", value: new THREE.Vector2(0, 0) },
        Color_2: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Point_3: { type: "v2", value: new THREE.Vector2(0, 0) },
        Color_3: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Point_4: { type: "v2", value: new THREE.Vector2(0, 0) },
        Color_4: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Blend: { type: "f", value: 100 },
        Jitter: { type: "f", value: 100 },
        Opacity: { type: "f", value: 100 },
        Blending_Mode: { type: "f", value: 1 },
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
    const _Point_1 = this.properties.Point_1.get(e); u.Point_1.value.set(_Point_1[0]||0, _Point_1[1]||0);
    u.Color_1.value.set(this.properties.Color_1.get(e)[0]||0, this.properties.Color_1.get(e)[1]||0, this.properties.Color_1.get(e)[2]||0);
    const _Point_2 = this.properties.Point_2.get(e); u.Point_2.value.set(_Point_2[0]||0, _Point_2[1]||0);
    u.Color_2.value.set(this.properties.Color_2.get(e)[0]||0, this.properties.Color_2.get(e)[1]||0, this.properties.Color_2.get(e)[2]||0);
    const _Point_3 = this.properties.Point_3.get(e); u.Point_3.value.set(_Point_3[0]||0, _Point_3[1]||0);
    u.Color_3.value.set(this.properties.Color_3.get(e)[0]||0, this.properties.Color_3.get(e)[1]||0, this.properties.Color_3.get(e)[2]||0);
    const _Point_4 = this.properties.Point_4.get(e); u.Point_4.value.set(_Point_4[0]||0, _Point_4[1]||0);
    u.Color_4.value.set(this.properties.Color_4.get(e)[0]||0, this.properties.Color_4.get(e)[1]||0, this.properties.Color_4.get(e)[2]||0);
    u.Blend.value = this.properties.Blend.get(e);
    u.Jitter.value = this.properties.Jitter.get(e);
    u.Opacity.value = this.properties.Opacity.get(e);
    u.Blending_Mode.value = this.properties.Blending_Mode.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
