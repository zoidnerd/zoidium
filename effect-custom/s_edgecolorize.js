// S_EdgeColorize (AlipFX) - Zoidium custom effect
// Source: S_EdgeColorize (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/s_edgecolorize.glsl

(this.defaultName = "S EdgeColorize"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Directional edge detection with tinted color outlines.",
  }),
  (this.shaderfile = "preset/s_edgecolorize"),
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
    Edge_Smooth: { dynamic: !0, name: "Edge Smooth", type: PZ.property.type.NUMBER, value: 5.38, step: 0.1 },
    Subpixel_Smooth: { dynamic: !0, name: "Subpixel Smooth", type: PZ.property.type.OPTION, value: 1, step: 1, items: "off;on" },
    Brightness: { dynamic: !0, name: "Brightness", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Rotate_Colors: { dynamic: !0, name: "Rotate Colors", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Background: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Top: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Right: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Bottom: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Left: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
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
        Edge_Smooth: { type: "f", value: 5.38 },
        Subpixel_Smooth: { type: "f", value: 1 },
        Brightness: { type: "f", value: 1 },
        Rotate_Colors: { type: "f", value: 0 },
        Background: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Top: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Right: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Bottom: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Left: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
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
    u.Edge_Smooth.value = this.properties.Edge_Smooth.get(e);
    u.Subpixel_Smooth.value = this.properties.Subpixel_Smooth.get(e);
    u.Brightness.value = this.properties.Brightness.get(e);
    u.Rotate_Colors.value = this.properties.Rotate_Colors.get(e);
    u.Background.value.set(this.properties.Background.get(e)[0]||0, this.properties.Background.get(e)[1]||0, this.properties.Background.get(e)[2]||0);
    u.Top.value.set(this.properties.Top.get(e)[0]||0, this.properties.Top.get(e)[1]||0, this.properties.Top.get(e)[2]||0);
    u.Right.value.set(this.properties.Right.get(e)[0]||0, this.properties.Right.get(e)[1]||0, this.properties.Right.get(e)[2]||0);
    u.Bottom.value.set(this.properties.Bottom.get(e)[0]||0, this.properties.Bottom.get(e)[1]||0, this.properties.Bottom.get(e)[2]||0);
    u.Left.value.set(this.properties.Left.get(e)[0]||0, this.properties.Left.get(e)[1]||0, this.properties.Left.get(e)[2]||0);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
