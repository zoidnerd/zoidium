// 8Bit PixCam (AlipFX) - Zoidium custom effect
// Source: 8Bit PixCam (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/8bit-pixcam.glsl

(this.defaultName = "8Bit PixCam"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Pixelates and posterizes image to 4 colors with dithering.",
  }),
  (this.shaderfile = "preset/8bit-pixcam"),
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
    Factor: { dynamic: !0, name: "Factor", type: PZ.property.type.NUMBER, value: 4, step: 0.1 },
    Brightness: { dynamic: !0, name: "Brightness", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Contrast: { dynamic: !0, name: "Contrast", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Dither_Level: { dynamic: !0, name: "Dither Level", type: PZ.property.type.NUMBER, value: -0.5, step: 0.1 },
    Color_1: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_2: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_3: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_4: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Draw_Grid_Lines: { dynamic: !0, name: "Draw Grid Lines", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Grid_Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
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
        Factor: { type: "f", value: 4 },
        Brightness: { type: "f", value: 1 },
        Contrast: { type: "f", value: 1 },
        Dither_Level: { type: "f", value: -0.5 },
        Color_1: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_2: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_3: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_4: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Draw_Grid_Lines: { type: "f", value: 0 },
        Grid_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
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
    u.Factor.value = this.properties.Factor.get(e);
    u.Brightness.value = this.properties.Brightness.get(e);
    u.Contrast.value = this.properties.Contrast.get(e);
    u.Dither_Level.value = this.properties.Dither_Level.get(e);
    u.Color_1.value.set(this.properties.Color_1.get(e)[0]||0, this.properties.Color_1.get(e)[1]||0, this.properties.Color_1.get(e)[2]||0);
    u.Color_2.value.set(this.properties.Color_2.get(e)[0]||0, this.properties.Color_2.get(e)[1]||0, this.properties.Color_2.get(e)[2]||0);
    u.Color_3.value.set(this.properties.Color_3.get(e)[0]||0, this.properties.Color_3.get(e)[1]||0, this.properties.Color_3.get(e)[2]||0);
    u.Color_4.value.set(this.properties.Color_4.get(e)[0]||0, this.properties.Color_4.get(e)[1]||0, this.properties.Color_4.get(e)[2]||0);
    u.Draw_Grid_Lines.value = this.properties.Draw_Grid_Lines.get(e);
    u.Grid_Color.value.set(this.properties.Grid_Color.get(e)[0]||0, this.properties.Grid_Color.get(e)[1]||0, this.properties.Grid_Color.get(e)[2]||0);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
