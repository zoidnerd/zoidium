// Brush Strokes (AlipFX) - Zoidium custom effect
// Source: Brush Strokes (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/brush-strokes.glsl

(this.defaultName = "Brush Strokes"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Renders the image as angled paint brush strokes.",
  }),
  (this.shaderfile = "preset/brush-strokes"),
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
    Stroke_Angle: { dynamic: !0, name: "Stroke Angle", type: PZ.property.type.NUMBER, value: 135, step: 0.1 },
    Brush_Size: { dynamic: !0, name: "Brush Size", type: PZ.property.type.NUMBER, value: 10, step: 0.1 },
    Stroke_Length: { dynamic: !0, name: "Stroke Length", type: PZ.property.type.NUMBER, value: 5, step: 0.1 },
    Stroke_Density: { dynamic: !0, name: "Stroke Density", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Stroke_Randomness: { dynamic: !0, name: "Stroke Randomness", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Paint_Surface: { dynamic: !0, name: "Paint Surface", type: PZ.property.type.OPTION, value: 0, items: "Original;Black;White;Black Opaque" },
    Blend_With_Original: { dynamic: !0, name: "Blend With Original", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
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
        Stroke_Angle: { type: "f", value: 135 },
        Brush_Size: { type: "f", value: 10 },
        Stroke_Length: { type: "f", value: 5 },
        Stroke_Density: { type: "f", value: 1 },
        Stroke_Randomness: { type: "f", value: 1 },
        Paint_Surface: { type: "f", value: 0 },
        Blend_With_Original: { type: "f", value: 0 },
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
    u.Stroke_Angle.value = this.properties.Stroke_Angle.get(e);
    u.Brush_Size.value = this.properties.Brush_Size.get(e);
    u.Stroke_Length.value = this.properties.Stroke_Length.get(e);
    u.Stroke_Density.value = this.properties.Stroke_Density.get(e);
    u.Stroke_Randomness.value = this.properties.Stroke_Randomness.get(e);
    u.Paint_Surface.value = this.properties.Paint_Surface.get(e);
    u.Blend_With_Original.value = this.properties.Blend_With_Original.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
