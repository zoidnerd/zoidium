// Curves (AlipFX) - Zoidium custom effect
// Source: Curves (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/curves.glsl

(this.defaultName = "Curves"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Adjusts shadow, midtone, and highlight tone curves.",
  }),
  (this.shaderfile = "preset/curves"),
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
    Channel: { dynamic: !0, name: "Channel", type: PZ.property.type.OPTION, value: 0, items: "RGB;R;G;B;A" },
    Highlights: { dynamic: !0, name: "Highlights", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Midtones: { dynamic: !0, name: "Midtones", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Shadows: { dynamic: !0, name: "Shadows", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
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
        Channel: { type: "f", value: 0 },
        Highlights: { type: "f", value: 0 },
        Midtones: { type: "f", value: 0 },
        Shadows: { type: "f", value: 0 },
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
    u.Channel.value = this.properties.Channel.get(e);
    u.Highlights.value = this.properties.Highlights.get(e);
    u.Midtones.value = this.properties.Midtones.get(e);
    u.Shadows.value = this.properties.Shadows.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
