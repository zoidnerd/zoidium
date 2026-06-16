// Transform (AlipFX) - Zoidium custom effect
// Source: Transform (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/transform.glsl

(this.defaultName = "Transform"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Full 2D transform with scale, skew, rotation, and opacity.",
  }),
  (this.shaderfile = "preset/transform"),
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
    Anchor_Point: { dynamic: !0, name: "Anchor Point", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Position: { dynamic: !0, name: "Position", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Uniform_Scale: { dynamic: !0, name: "Uniform Scale", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Off;On" },
    Scale_Height: { dynamic: !0, name: "Scale Height", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Scale_Width: { dynamic: !0, name: "Scale Width", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Skew: { dynamic: !0, name: "Skew", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Skew_Axis: { dynamic: !0, name: "Skew Axis", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Rotation: { dynamic: !0, name: "Rotation", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Opacity: { dynamic: !0, name: "Opacity", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Use_Composition_Shutter_Angle: { dynamic: !0, name: "Use Composition Shutter Angle", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Shutter_Angle: { dynamic: !0, name: "Shutter Angle", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Sampling: { dynamic: !0, name: "Sampling", type: PZ.property.type.OPTION, value: 0, items: "bilinear;bicubic" },
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
        Anchor_Point: { type: "v2", value: new THREE.Vector2(0, 0) },
        Position: { type: "v2", value: new THREE.Vector2(0, 0) },
        Uniform_Scale: { type: "f", value: 0 },
        Scale_Height: { type: "f", value: 100 },
        Scale_Width: { type: "f", value: 100 },
        Skew: { type: "f", value: 0 },
        Skew_Axis: { type: "f", value: 0 },
        Rotation: { type: "f", value: 0 },
        Opacity: { type: "f", value: 100 },
        Use_Composition_Shutter_Angle: { type: "f", value: 1 },
        Shutter_Angle: { type: "f", value: 0 },
        Sampling: { type: "f", value: 0 },
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
    const _Anchor_Point = this.properties.Anchor_Point.get(e); u.Anchor_Point.value.set(_Anchor_Point[0]||0, _Anchor_Point[1]||0);
    const _Position = this.properties.Position.get(e); u.Position.value.set(_Position[0]||0, _Position[1]||0);
    u.Uniform_Scale.value = this.properties.Uniform_Scale.get(e);
    u.Scale_Height.value = this.properties.Scale_Height.get(e);
    u.Scale_Width.value = this.properties.Scale_Width.get(e);
    u.Skew.value = this.properties.Skew.get(e);
    u.Skew_Axis.value = this.properties.Skew_Axis.get(e);
    u.Rotation.value = this.properties.Rotation.get(e);
    u.Opacity.value = this.properties.Opacity.get(e);
    u.Use_Composition_Shutter_Angle.value = this.properties.Use_Composition_Shutter_Angle.get(e);
    u.Shutter_Angle.value = this.properties.Shutter_Angle.get(e);
    u.Sampling.value = this.properties.Sampling.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
