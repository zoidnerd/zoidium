// Circle (AlipFX) - Zoidium custom effect
// Source: Circle (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/circle.glsl

(this.defaultName = "Circle"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Overlays a circle or ring with feather and blend modes.",
  }),
  (this.shaderfile = "preset/circle"),
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
    Center: { dynamic: !0, name: "Center", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Radius: { dynamic: !0, name: "Radius", type: PZ.property.type.NUMBER, value: 75, step: 0.1 },
    Edge: { dynamic: !0, name: "Edge", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Solid;Edge;Ring;Ring Percent;Ring Percent + Feather" },
    Edge_Radius: { dynamic: !0, name: "Edge Radius", type: PZ.property.type.NUMBER, value: 10, step: 0.1 },
    Thickness: { dynamic: !0, name: "Thickness", type: PZ.property.type.NUMBER, value: 332, step: 0.1 },
    Feather_Outer_Edge: { dynamic: !0, name: "Feather Outer Edge", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Feather_Inner_Edge: { dynamic: !0, name: "Feather Inner Edge", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Invert_Circle: { dynamic: !0, name: "Invert Circle", type: PZ.property.type.OPTION, value: 0, step: 1, items: "off;on" },
    Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Opacity: { dynamic: !0, name: "Opacity", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Blending_Mode: { dynamic: !0, name: "Blending Mode", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Normal;Normal (alpha);Tint;Add;Multiply;Screen;Overlay;Soft Light;Hard Light;Dodge;Burn;Darken;Lighten;Difference;Subtract;Hue;Saturation;Color;Luminosity" },
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
        Center: { type: "v2", value: new THREE.Vector2(0, 0) },
        Radius: { type: "f", value: 75 },
        Edge: { type: "f", value: 0 },
        Edge_Radius: { type: "f", value: 10 },
        Thickness: { type: "f", value: 332 },
        Feather_Outer_Edge: { type: "f", value: 0 },
        Feather_Inner_Edge: { type: "f", value: 0 },
        Invert_Circle: { type: "f", value: 0 },
        Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Opacity: { type: "f", value: 100 },
        Blending_Mode: { type: "f", value: 0 },
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
    const _Center = this.properties.Center.get(e); u.Center.value.set(_Center[0]||0, _Center[1]||0);
    u.Radius.value = this.properties.Radius.get(e);
    u.Edge.value = this.properties.Edge.get(e);
    u.Edge_Radius.value = this.properties.Edge_Radius.get(e);
    u.Thickness.value = this.properties.Thickness.get(e);
    u.Feather_Outer_Edge.value = this.properties.Feather_Outer_Edge.get(e);
    u.Feather_Inner_Edge.value = this.properties.Feather_Inner_Edge.get(e);
    u.Invert_Circle.value = this.properties.Invert_Circle.get(e);
    u.Color.value.set(this.properties.Color.get(e)[0]||0, this.properties.Color.get(e)[1]||0, this.properties.Color.get(e)[2]||0);
    u.Opacity.value = this.properties.Opacity.get(e);
    u.Blending_Mode.value = this.properties.Blending_Mode.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
