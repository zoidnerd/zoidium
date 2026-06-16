// AZ Bender (AlipFX) - Zoidium custom effect
// Source: AZ Bender (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-bender.glsl

(this.defaultName = "AZ Bender"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Bends the upper region with a selectable curve style.",
  }),
  (this.shaderfile = "preset/az-bender"),
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
    Bend: { dynamic: !0, name: "Bend", type: PZ.property.type.NUMBER, value: -43.33, step: 0.1 },
    Style: { dynamic: !0, name: "Style", type: PZ.property.type.OPTION, value: 3, items: "Bend;Marilyn;Sharp;Boxer" },
    AdjustToDistance: { dynamic: !0, name: "AdjustToDistance", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Top: { dynamic: !0, name: "Top", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Base: { dynamic: !0, name: "Base", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
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
        Bend: { type: "f", value: -43.33 },
        Style: { type: "i", value: 3 },
        AdjustToDistance: { type: "i", value: 0 },
        Top: { type: "v2", value: new THREE.Vector2(0, 0) },
        Base: { type: "v2", value: new THREE.Vector2(0, 0) },
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
    u.Bend.value = this.properties.Bend.get(e);
    u.Style.value = Math.round(this.properties.Style.get(e));
    u.AdjustToDistance.value = Math.round(this.properties.AdjustToDistance.get(e));
    const _Top = this.properties.Top.get(e); u.Top.value.set(_Top[0]||0, _Top[1]||0);
    const _Base = this.properties.Base.get(e); u.Base.value.set(_Base[0]||0, _Base[1]||0);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
