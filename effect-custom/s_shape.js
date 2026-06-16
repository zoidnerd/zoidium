// S_Shape (AlipFX) - Zoidium custom effect
// Source: S_Shape (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/s_shape.glsl

(this.defaultName = "S Shape"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Polygon, star, or flower shape with blend and swirl options.",
  }),
  (this.shaderfile = "preset/s_shape"),
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
    Center_XY: { dynamic: !0, name: "Center XY", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Size: { dynamic: !0, name: "Size", type: PZ.property.type.NUMBER, value: 480, step: 0.1 },
    Rel_Width: { dynamic: !0, name: "Rel Width", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Rel_Height: { dynamic: !0, name: "Rel Height", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Points: { dynamic: !0, name: "Points", type: PZ.property.type.NUMBER, value: 7, step: 0.1 },
    Pointiness: { dynamic: !0, name: "Pointiness", type: PZ.property.type.NUMBER, value: 1.94, step: 0.1 },
    Roundness: { dynamic: !0, name: "Roundness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Swirl: { dynamic: !0, name: "Swirl", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Rotate: { dynamic: !0, name: "Rotate", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Rotate_Pre_Scale: { dynamic: !0, name: "Rotate Pre Scale", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Blur: { dynamic: !0, name: "Blur", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Brightness1: { dynamic: !0, name: "Brightness1", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Color1: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color0: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Offset0: { dynamic: !0, name: "Offset0", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Bg_Brightness: { dynamic: !0, name: "Bg Brightness", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Combine: { dynamic: !0, name: "Combine", type: PZ.property.type.OPTION, value: 6, step: 1, items: "FG Only;Multiply;Add;Screen;Difference;Overlay;Normal" },
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
        Center_XY: { type: "v2", value: new THREE.Vector2(0, 0) },
        Size: { type: "f", value: 480 },
        Rel_Width: { type: "f", value: 1 },
        Rel_Height: { type: "f", value: 1 },
        Points: { type: "f", value: 7 },
        Pointiness: { type: "f", value: 1.94 },
        Roundness: { type: "f", value: 0 },
        Swirl: { type: "f", value: 0 },
        Rotate: { type: "f", value: 0 },
        Rotate_Pre_Scale: { type: "f", value: 0 },
        Blur: { type: "f", value: 0 },
        Brightness1: { type: "f", value: 1 },
        Color1: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color0: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Offset0: { type: "f", value: 0 },
        Bg_Brightness: { type: "f", value: 1 },
        Combine: { type: "f", value: 6 },
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
    const _Center_XY = this.properties.Center_XY.get(e); u.Center_XY.value.set(_Center_XY[0]||0, _Center_XY[1]||0);
    u.Size.value = this.properties.Size.get(e);
    u.Rel_Width.value = this.properties.Rel_Width.get(e);
    u.Rel_Height.value = this.properties.Rel_Height.get(e);
    u.Points.value = this.properties.Points.get(e);
    u.Pointiness.value = this.properties.Pointiness.get(e);
    u.Roundness.value = this.properties.Roundness.get(e);
    u.Swirl.value = this.properties.Swirl.get(e);
    u.Rotate.value = this.properties.Rotate.get(e);
    u.Rotate_Pre_Scale.value = this.properties.Rotate_Pre_Scale.get(e);
    u.Blur.value = this.properties.Blur.get(e);
    u.Brightness1.value = this.properties.Brightness1.get(e);
    u.Color1.value.set(this.properties.Color1.get(e)[0]||0, this.properties.Color1.get(e)[1]||0, this.properties.Color1.get(e)[2]||0);
    u.Color0.value.set(this.properties.Color0.get(e)[0]||0, this.properties.Color0.get(e)[1]||0, this.properties.Color0.get(e)[2]||0);
    u.Offset0.value = this.properties.Offset0.get(e);
    u.Bg_Brightness.value = this.properties.Bg_Brightness.get(e);
    u.Combine.value = this.properties.Combine.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
