// scl_Film Strip (AlipFX) - Zoidium custom effect
// Source: scl_Film Strip (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/scl_film-strip.glsl

(this.defaultName = "scl Film Strip"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Filmstrip frame with base, main, and sub perforation rows.",
  }),
  (this.shaderfile = "preset/scl_film-strip"),
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
    Base_Scale_X: { dynamic: !0, name: "Base Scale X", type: PZ.property.type.NUMBER, value: 1920, step: 0.1 },
    Base_Scale_Y: { dynamic: !0, name: "Base Scale Y", type: PZ.property.type.NUMBER, value: 422.8, step: 0.1 },
    Base_Offset_Paths: { dynamic: !0, name: "Base Offset Paths", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Base_Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Base_Stroke: { dynamic: !0, name: "Base Stroke", type: PZ.property.type.OPTION, value: 0, step: 1, items: "off;on" },
    Base_Stroke_Width: { dynamic: !0, name: "Base Stroke Width", type: PZ.property.type.NUMBER, value: 5, step: 0.1 },
    Base_Stroke_Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Base_Copies: { dynamic: !0, name: "Base Copies", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Base_Position: { dynamic: !0, name: "Base Position", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Main_Scale_X: { dynamic: !0, name: "Main Scale X", type: PZ.property.type.NUMBER, value: 480, step: 0.1 },
    Main_Scale_Y: { dynamic: !0, name: "Main Scale Y", type: PZ.property.type.NUMBER, value: 340, step: 0.1 },
    Main_Roundness: { dynamic: !0, name: "Main Roundness", type: PZ.property.type.NUMBER, value: 15, step: 0.1 },
    Main_Offset_Paths: { dynamic: !0, name: "Main Offset Paths", type: PZ.property.type.NUMBER, value: -7, step: 0.1 },
    Main_Copies: { dynamic: !0, name: "Main Copies", type: PZ.property.type.NUMBER, value: 4, step: 0.1 },
    Main_Position: { dynamic: !0, name: "Main Position", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Sub_Scale_X: { dynamic: !0, name: "Sub Scale X", type: PZ.property.type.NUMBER, value: 35, step: 0.1 },
    Sub_Scale_Y: { dynamic: !0, name: "Sub Scale Y", type: PZ.property.type.NUMBER, value: 25, step: 0.1 },
    Sub_Roundness: { dynamic: !0, name: "Sub Roundness", type: PZ.property.type.NUMBER, value: 5, step: 0.1 },
    Sub_Offset_Paths: { dynamic: !0, name: "Sub Offset Paths", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Sub_Copies: { dynamic: !0, name: "Sub Copies", type: PZ.property.type.NUMBER, value: 21, step: 0.1 },
    Sub_Position: { dynamic: !0, name: "Sub Position", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
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
        Base_Scale_X: { type: "f", value: 1920 },
        Base_Scale_Y: { type: "f", value: 422.8 },
        Base_Offset_Paths: { type: "f", value: 0 },
        Base_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Base_Stroke: { type: "f", value: 0 },
        Base_Stroke_Width: { type: "f", value: 5 },
        Base_Stroke_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Base_Copies: { type: "f", value: 1 },
        Base_Position: { type: "v2", value: new THREE.Vector2(0, 0) },
        Main_Scale_X: { type: "f", value: 480 },
        Main_Scale_Y: { type: "f", value: 340 },
        Main_Roundness: { type: "f", value: 15 },
        Main_Offset_Paths: { type: "f", value: -7 },
        Main_Copies: { type: "f", value: 4 },
        Main_Position: { type: "v2", value: new THREE.Vector2(0, 0) },
        Sub_Scale_X: { type: "f", value: 35 },
        Sub_Scale_Y: { type: "f", value: 25 },
        Sub_Roundness: { type: "f", value: 5 },
        Sub_Offset_Paths: { type: "f", value: 0 },
        Sub_Copies: { type: "f", value: 21 },
        Sub_Position: { type: "v2", value: new THREE.Vector2(0, 0) },
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
    u.Base_Scale_X.value = this.properties.Base_Scale_X.get(e);
    u.Base_Scale_Y.value = this.properties.Base_Scale_Y.get(e);
    u.Base_Offset_Paths.value = this.properties.Base_Offset_Paths.get(e);
    u.Base_Color.value.set(this.properties.Base_Color.get(e)[0]||0, this.properties.Base_Color.get(e)[1]||0, this.properties.Base_Color.get(e)[2]||0);
    u.Base_Stroke.value = this.properties.Base_Stroke.get(e);
    u.Base_Stroke_Width.value = this.properties.Base_Stroke_Width.get(e);
    u.Base_Stroke_Color.value.set(this.properties.Base_Stroke_Color.get(e)[0]||0, this.properties.Base_Stroke_Color.get(e)[1]||0, this.properties.Base_Stroke_Color.get(e)[2]||0);
    u.Base_Copies.value = this.properties.Base_Copies.get(e);
    const _Base_Position = this.properties.Base_Position.get(e); u.Base_Position.value.set(_Base_Position[0]||0, _Base_Position[1]||0);
    u.Main_Scale_X.value = this.properties.Main_Scale_X.get(e);
    u.Main_Scale_Y.value = this.properties.Main_Scale_Y.get(e);
    u.Main_Roundness.value = this.properties.Main_Roundness.get(e);
    u.Main_Offset_Paths.value = this.properties.Main_Offset_Paths.get(e);
    u.Main_Copies.value = this.properties.Main_Copies.get(e);
    const _Main_Position = this.properties.Main_Position.get(e); u.Main_Position.value.set(_Main_Position[0]||0, _Main_Position[1]||0);
    u.Sub_Scale_X.value = this.properties.Sub_Scale_X.get(e);
    u.Sub_Scale_Y.value = this.properties.Sub_Scale_Y.get(e);
    u.Sub_Roundness.value = this.properties.Sub_Roundness.get(e);
    u.Sub_Offset_Paths.value = this.properties.Sub_Offset_Paths.get(e);
    u.Sub_Copies.value = this.properties.Sub_Copies.get(e);
    const _Sub_Position = this.properties.Sub_Position.get(e); u.Sub_Position.value.set(_Sub_Position[0]||0, _Sub_Position[1]||0);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
