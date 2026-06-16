// MultiSlicer (AlipFX) - Zoidium custom effect
// Source: MultiSlicer (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/multislicer.glsl

(this.defaultName = "MultiSlicer"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Slices image into strips with per-slice shift.",
  }),
  (this.shaderfile = "preset/multislicer"),
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
    Shift: { dynamic: !0, name: "Shift", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Width: { dynamic: !0, name: "Width", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Number_of_Slices: { dynamic: !0, name: "Number of Slices", type: PZ.property.type.NUMBER, value: 10, step: 0.1 },
    Anchor_Point: { dynamic: !0, name: "Anchor Point", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Angle: { dynamic: !0, name: "Angle", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Seed: { dynamic: !0, name: "Seed", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
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
        Shift: { type: "f", value: 0 },
        Width: { type: "f", value: 100 },
        Number_of_Slices: { type: "f", value: 10 },
        Anchor_Point: { type: "v2", value: new THREE.Vector2(0, 0) },
        Angle: { type: "f", value: 0 },
        Seed: { type: "f", value: 0 },
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
    u.Shift.value = this.properties.Shift.get(e);
    u.Width.value = this.properties.Width.get(e);
    u.Number_of_Slices.value = this.properties.Number_of_Slices.get(e);
    const _Anchor_Point = this.properties.Anchor_Point.get(e); u.Anchor_Point.value.set(_Anchor_Point[0]||0, _Anchor_Point[1]||0);
    u.Angle.value = this.properties.Angle.get(e);
    u.Seed.value = this.properties.Seed.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
