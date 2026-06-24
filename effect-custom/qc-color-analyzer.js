// QC Color Analyzer (AlipFX) - Zoidium custom effect
// Source: QC Color Analyzer (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/qc-color-analyzer.glsl

(this.defaultName = "QC Color Analyzer"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Color analyzer sample readouts with point inspection.",
  }),
  (this.shaderfile = "preset/qc-color-analyzer"),
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
    Sample_Point: { dynamic: !0, name: "Sample Point", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Circle_Size: { dynamic: !0, name: "Circle Size", type: PZ.property.type.NUMBER, value: 20, step: 0.1 },
    Sample_Point_Radius: { dynamic: !0, name: "Sample Point Radius", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Scale: { dynamic: !0, name: "Scale", type: PZ.property.type.NUMBER, value: 5, step: 0.1 },
    Offset_X: { dynamic: !0, name: "Offset X", type: PZ.property.type.NUMBER, value: 10, step: 0.1 },
    Offset_Y: { dynamic: !0, name: "Offset Y", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    BG_Opacity: { dynamic: !0, name: "Bg Opacity", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Lock_Color: { dynamic: !0, name: "Lock Color", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Show_Circle: { dynamic: !0, name: "Show Circle", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Show_Swatch: { dynamic: !0, name: "Show Swatch", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Show_LCH: { dynamic: !0, name: "Show Lch", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Show_HSV: { dynamic: !0, name: "Show Hsv", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Show_RGB: { dynamic: !0, name: "Show Rgb", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
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
        Sample_Point: { type: "v2", value: new THREE.Vector2(0, 0) },
        Circle_Size: { type: "f", value: 20 },
        Sample_Point_Radius: { type: "f", value: 0 },
        Scale: { type: "f", value: 5 },
        Offset_X: { type: "f", value: 10 },
        Offset_Y: { type: "f", value: 0 },
        BG_Opacity: { type: "f", value: 100 },
        Lock_Color: { type: "f", value: 1 },
        Show_Circle: { type: "f", value: 1 },
        Show_Swatch: { type: "f", value: 1 },
        Show_LCH: { type: "f", value: 1 },
        Show_HSV: { type: "f", value: 1 },
        Show_RGB: { type: "f", value: 1 },
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
        const _Sample_Point = this.properties.Sample_Point.get(e); u.Sample_Point.value.set(_Sample_Point[0]||0, _Sample_Point[1]||0);
        u.Circle_Size.value = this.properties.Circle_Size.get(e);
        u.Sample_Point_Radius.value = this.properties.Sample_Point_Radius.get(e);
        u.Scale.value = this.properties.Scale.get(e);
        u.Offset_X.value = this.properties.Offset_X.get(e);
        u.Offset_Y.value = this.properties.Offset_Y.get(e);
        u.BG_Opacity.value = this.properties.BG_Opacity.get(e);
        u.Lock_Color.value = this.properties.Lock_Color.get(e);
        u.Show_Circle.value = this.properties.Show_Circle.get(e);
        u.Show_Swatch.value = this.properties.Show_Swatch.get(e);
        u.Show_LCH.value = this.properties.Show_LCH.get(e);
        u.Show_HSV.value = this.properties.Show_HSV.get(e);
        u.Show_RGB.value = this.properties.Show_RGB.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
