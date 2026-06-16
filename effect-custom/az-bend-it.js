// AZ Bend It (AlipFX) - Zoidium custom effect
// Source: AZ Bend It (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-bend-it.glsl

(this.defaultName = "AZ Bend It"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Bends the image along a custom axis with adjustable angle.",
  }),
  (this.shaderfile = "preset/az-bend-it"),
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
    Bend: { dynamic: !0, name: "Bend", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Start: { dynamic: !0, name: "Start", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    End: { dynamic: !0, name: "End", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Render_Prestart: { dynamic: !0, name: "Render Prestart", type: PZ.property.type.OPTION, value: 2, step: 1, items: "Transparent;Original;Continue;Mirror" },
    Distort: { dynamic: !0, name: "Distort", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Empty;Stretch" },
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
        Bend: { type: "f", value: 0 },
        Start: { type: "v2", value: new THREE.Vector2(0, 0) },
        End: { type: "v2", value: new THREE.Vector2(0, 0) },
        Render_Prestart: { type: "f", value: 2 },
        Distort: { type: "f", value: 0 },
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
    const _Start = this.properties.Start.get(e); u.Start.value.set(_Start[0]||0, _Start[1]||0);
    const _End = this.properties.End.get(e); u.End.value.set(_End[0]||0, _End[1]||0);
    u.Render_Prestart.value = this.properties.Render_Prestart.get(e);
    u.Distort.value = this.properties.Distort.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
