// TexGraph (AlipFX) - Zoidium custom effect
// Source: TexGraph (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/texgraph.glsl

(this.defaultName = "TexGraph"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Renders image as random 3x5 bitmap-font characters per block.",
  }),
  (this.shaderfile = "preset/texgraph"),
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
    Scale: { dynamic: !0, name: "Scale", type: PZ.property.type.NUMBER, value: 3, step: 0.1 },
    Erode: { dynamic: !0, name: "Erode", type: PZ.property.type.OPTION, value: 0, step: 1, items: "off;on" },
    Dither_Level: { dynamic: !0, name: "Dither Level", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Text_Color_from_SRC: { dynamic: !0, name: "Text Color from SRC", type: PZ.property.type.OPTION, value: 1, step: 1, items: "Use Custom;Use Source" },
    Text_BG_Color_from_SRC: { dynamic: !0, name: "Text BG Color from SRC", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Use Custom;Use Source" },
    Text_Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Text_BG_Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Text_BG_Alpha: { dynamic: !0, name: "Text BG Alpha", type: PZ.property.type.NUMBER, value: 200.8, step: 0.1 },
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
        Scale: { type: "f", value: 3 },
        Erode: { type: "f", value: 0 },
        Dither_Level: { type: "f", value: 0 },
        Text_Color_from_SRC: { type: "f", value: 1 },
        Text_BG_Color_from_SRC: { type: "f", value: 0 },
        Text_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Text_BG_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Text_BG_Alpha: { type: "f", value: 200.8 },
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
    u.Scale.value = this.properties.Scale.get(e);
    u.Erode.value = this.properties.Erode.get(e);
    u.Dither_Level.value = this.properties.Dither_Level.get(e);
    u.Text_Color_from_SRC.value = this.properties.Text_Color_from_SRC.get(e);
    u.Text_BG_Color_from_SRC.value = this.properties.Text_BG_Color_from_SRC.get(e);
    u.Text_Color.value.set(this.properties.Text_Color.get(e)[0]||0, this.properties.Text_Color.get(e)[1]||0, this.properties.Text_Color.get(e)[2]||0);
    u.Text_BG_Color.value.set(this.properties.Text_BG_Color.get(e)[0]||0, this.properties.Text_BG_Color.get(e)[1]||0, this.properties.Text_BG_Color.get(e)[2]||0);
    u.Text_BG_Alpha.value = this.properties.Text_BG_Alpha.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
