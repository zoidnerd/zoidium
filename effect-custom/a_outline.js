// A_Outline (AlipFX) - Zoidium custom effect
// Source: A_Outline (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/a_outline.glsl

(this.defaultName = "A Outline"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Dual outline and long shadow with offset.",
  }),
  (this.shaderfile = "preset/a_outline"),
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
    Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Size: { dynamic: !0, name: "Size", type: PZ.property.type.NUMBER, value: 12, step: 0.1 },
    Offset: { dynamic: !0, name: "Offset", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Opacity: { dynamic: !0, name: "Opacity", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Sharp: { dynamic: !0, name: "Sharp", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Smooth;Sharp" },
    Long_Shadow: { dynamic: !0, name: "Long Shadow", type: PZ.property.type.OPTION, value: 1, step: 1, items: "Off;On" },
    Enable_Outline_2: { dynamic: !0, name: "Enable Outline 2", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Off;On" },
    Color_Outline_2: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Size_Outline_2: { dynamic: !0, name: "Size Outline 2", type: PZ.property.type.NUMBER, value: 22, step: 0.1 },
    Offset_Outline_2: { dynamic: !0, name: "Offset Outline 2", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Opacity_Outline_2: { dynamic: !0, name: "Opacity Outline 2", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Sharp_Outline_2: { dynamic: !0, name: "Sharp Outline 2", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Long_Shadow_Outline_2: { dynamic: !0, name: "Long Shadow Outline 2", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
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
        Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Size: { type: "f", value: 12 },
        Offset: { type: "v2", value: new THREE.Vector2(0, 0) },
        Opacity: { type: "f", value: 100 },
        Sharp: { type: "f", value: 0 },
        Long_Shadow: { type: "f", value: 1 },
        Enable_Outline_2: { type: "f", value: 0 },
        Color_Outline_2: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Size_Outline_2: { type: "f", value: 22 },
        Offset_Outline_2: { type: "v2", value: new THREE.Vector2(0, 0) },
        Opacity_Outline_2: { type: "f", value: 100 },
        Sharp_Outline_2: { type: "f", value: 0 },
        Long_Shadow_Outline_2: { type: "f", value: 1 },
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
    u.Color.value.set(this.properties.Color.get(e)[0]||0, this.properties.Color.get(e)[1]||0, this.properties.Color.get(e)[2]||0);
    u.Size.value = this.properties.Size.get(e);
    const _Offset = this.properties.Offset.get(e); u.Offset.value.set(_Offset[0]||0, _Offset[1]||0);
    u.Opacity.value = this.properties.Opacity.get(e);
    u.Sharp.value = this.properties.Sharp.get(e);
    u.Long_Shadow.value = this.properties.Long_Shadow.get(e);
    u.Enable_Outline_2.value = this.properties.Enable_Outline_2.get(e);
    u.Color_Outline_2.value.set(this.properties.Color_Outline_2.get(e)[0]||0, this.properties.Color_Outline_2.get(e)[1]||0, this.properties.Color_Outline_2.get(e)[2]||0);
    u.Size_Outline_2.value = this.properties.Size_Outline_2.get(e);
    const _Offset_Outline_2 = this.properties.Offset_Outline_2.get(e); u.Offset_Outline_2.value.set(_Offset_Outline_2[0]||0, _Offset_Outline_2[1]||0);
    u.Opacity_Outline_2.value = this.properties.Opacity_Outline_2.get(e);
    u.Sharp_Outline_2.value = this.properties.Sharp_Outline_2.get(e);
    u.Long_Shadow_Outline_2.value = this.properties.Long_Shadow_Outline_2.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
