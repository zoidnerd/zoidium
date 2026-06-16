// Checkerboard (AlipFX) - Zoidium custom effect
// Source: Checkerboard (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/checkerboard.glsl

(this.defaultName = "Checkerboard"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Overlays a feathered checkerboard with blend modes.",
  }),
  (this.shaderfile = "preset/checkerboard"),
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
    Anchor: { dynamic: !0, name: "Anchor", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Size_from: { dynamic: !0, name: "Size from", type: PZ.property.type.OPTION, value: 1, step: 1, items: "Corner;Width & Height;Width Only" },
    Corner_Point: { dynamic: !0, name: "Corner Point", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Width: { dynamic: !0, name: "Width", type: PZ.property.type.NUMBER, value: 127.76, step: 0.1 },
    Height: { dynamic: !0, name: "Height", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Feather_Width: { dynamic: !0, name: "Feather Width", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Feather_Height: { dynamic: !0, name: "Feather Height", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Opacity: { dynamic: !0, name: "Opacity", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Blending_mode: { dynamic: !0, name: "Blending mode", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Normal;Mix;Tint;Add;Multiply;Screen;Overlay;Hard Light;Soft Light;Divide;Dodge;Darken;Lighten;Difference;Subtract;Hue;Saturation;Color;Luminosity" },
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
        Anchor: { type: "v2", value: new THREE.Vector2(0, 0) },
        Size_from: { type: "i", value: 1 },
        Corner_Point: { type: "v2", value: new THREE.Vector2(0, 0) },
        Width: { type: "f", value: 127.76 },
        Height: { type: "f", value: 100 },
        Feather_Width: { type: "f", value: 1 },
        Feather_Height: { type: "f", value: 1 },
        Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Opacity: { type: "f", value: 1 },
        Blending_mode: { type: "i", value: 0 },
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
    const _Anchor = this.properties.Anchor.get(e); u.Anchor.value.set(_Anchor[0]||0, _Anchor[1]||0);
    u.Size_from.value = Math.round(this.properties.Size_from.get(e));
    const _Corner_Point = this.properties.Corner_Point.get(e); u.Corner_Point.value.set(_Corner_Point[0]||0, _Corner_Point[1]||0);
    u.Width.value = this.properties.Width.get(e);
    u.Height.value = this.properties.Height.get(e);
    u.Feather_Width.value = this.properties.Feather_Width.get(e);
    u.Feather_Height.value = this.properties.Feather_Height.get(e);
    u.Color.value.set(this.properties.Color.get(e)[0]||0, this.properties.Color.get(e)[1]||0, this.properties.Color.get(e)[2]||0);
    u.Opacity.value = this.properties.Opacity.get(e);
    u.Blending_mode.value = Math.round(this.properties.Blending_mode.get(e));
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
