// AZ Dot Pixel (AlipFX) - Zoidium custom effect
// Source: Dot Pixel (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-dot-pixel.glsl

(this.defaultName = "AZ Dot Pixel"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Dot/pixel mosaic effect with shaded variants.",
  }),
  (this.shaderfile = "preset/az-dot-pixel"),
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
    Image_Center: { dynamic: !0, name: "Image Center", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Dimension_Factor: { dynamic: !0, name: "Dimension Factor", type: PZ.property.type.NUMBER, value: 12, step: 0.1 },
    Outer_Roundness: { dynamic: !0, name: "Outer Roundness", type: PZ.property.type.NUMBER, value: -2, step: 0.1 },
    Inner_Radius: { dynamic: !0, name: "Inner Radius", type: PZ.property.type.NUMBER, value: 7, step: 0.1 },
    Shading: { dynamic: !0, name: "Shading", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Shading_Type: { dynamic: !0, name: "Shading Type", type: PZ.property.type.OPTION, value: 0, items: "Sphere;Ring" },
    Fill_Background: { dynamic: !0, name: "Fill Background", type: PZ.property.type.OPTION, value: 0, items: "Disabled;Enabled" },
    BG_Color: { dynamic: !0, name: "Bg Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
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
        Image_Center: { type: "v2", value: new THREE.Vector2(0, 0) },
        Dimension_Factor: { type: "f", value: 12 },
        Outer_Roundness: { type: "f", value: -2 },
        Inner_Radius: { type: "f", value: 7 },
        Shading: { type: "f", value: 0 },
        Shading_Type: { type: "i", value: 0 },
        Fill_Background: { type: "i", value: 0 },
        BG_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
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
        const _Image_Center = this.properties.Image_Center.get(e); u.Image_Center.value.set(_Image_Center[0]||0, _Image_Center[1]||0);
        u.Dimension_Factor.value = this.properties.Dimension_Factor.get(e);
        u.Outer_Roundness.value = this.properties.Outer_Roundness.get(e);
        u.Inner_Radius.value = this.properties.Inner_Radius.get(e);
        u.Shading.value = this.properties.Shading.get(e);
        u.Shading_Type.value = Math.round(this.properties.Shading_Type.get(e));
        u.Fill_Background.value = Math.round(this.properties.Fill_Background.get(e));
        u.BG_Color.value.set(this.properties.BG_Color.get(e)[0]||0, this.properties.BG_Color.get(e)[1]||0, this.properties.BG_Color.get(e)[2]||0);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
