// Stretch (AlipFX) - Zoidium custom effect
// Source: Stretch (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/stretch.glsl

(this.defaultName = "Stretch"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Pixel shift along an axis with directional easing.",
  }),
  (this.shaderfile = "preset/stretch"),
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
    Angle: { dynamic: !0, name: "Angle", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Shift_Amount: { dynamic: !0, name: "Shift Amount", type: PZ.property.type.NUMBER, value: 81.7, step: 0.1 },
    Direction: { dynamic: !0, name: "Direction", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Both Sides;Positive;Negative" },
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
        Angle: { type: "f", value: 0 },
        Shift_Amount: { type: "f", value: 81.7 },
        Direction: { type: "f", value: 0 },
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
    u.Angle.value = this.properties.Angle.get(e);
    u.Shift_Amount.value = this.properties.Shift_Amount.get(e);
    u.Direction.value = this.properties.Direction.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
