// Lens Flare (AlipFX) - Zoidium custom effect
// Source: Lens Flare (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/lens-flare.glsl

(this.defaultName = "Lens Flare"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "TODO: write a one-line description for Lens Flare.",
  }),
  (this.shaderfile = "preset/lens-flare"),
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
    Flare_Center: { dynamic: !0, name: "Flare Center", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Flare_Brightness: { dynamic: !0, name: "Flare Brightness", type: PZ.property.type.NUMBER, value: 0.05, step: 0.1 },
    Lens_Type: { dynamic: !0, name: "Lens Type", type: PZ.property.type.OPTION, value: 0, items: "Zoom;35mm;105mm" },
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
        Flare_Center: { type: "v2", value: new THREE.Vector2(0, 0) },
        Flare_Brightness: { type: "f", value: 0.05 },
        Lens_Type: { type: "i", value: 0 },
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
    const _Flare_Center = this.properties.Flare_Center.get(e); u.Flare_Center.value.set(_Flare_Center[0]||0, _Flare_Center[1]||0);
    u.Flare_Brightness.value = this.properties.Flare_Brightness.get(e);
    u.Lens_Type.value = Math.round(this.properties.Lens_Type.get(e));
    u.Blend_With_Original.value = this.properties.Blend_With_Original.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
