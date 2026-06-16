// AZ Toner (AlipFX) - Zoidium custom effect
// Source: AZ Toner (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-toner.glsl

(this.defaultName = "AZ Toner"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Maps luminance to multi-color tone palettes.",
  }),
  (this.shaderfile = "preset/az-toner"),
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
    Tones: { dynamic: !0, name: "Tones", type: PZ.property.type.OPTION, value: 2, items: "Duotone;Tritone;Pentone;Solid" },
    Highlights: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Brights: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Midtones: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Darktones: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Shadows: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
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
        Tones: { type: "f", value: 2 },
        Highlights: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Brights: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Midtones: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Darktones: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Shadows: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
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
    u.Tones.value = this.properties.Tones.get(e);
    u.Highlights.value.set(this.properties.Highlights.get(e)[0]||0, this.properties.Highlights.get(e)[1]||0, this.properties.Highlights.get(e)[2]||0);
    u.Brights.value.set(this.properties.Brights.get(e)[0]||0, this.properties.Brights.get(e)[1]||0, this.properties.Brights.get(e)[2]||0);
    u.Midtones.value.set(this.properties.Midtones.get(e)[0]||0, this.properties.Midtones.get(e)[1]||0, this.properties.Midtones.get(e)[2]||0);
    u.Darktones.value.set(this.properties.Darktones.get(e)[0]||0, this.properties.Darktones.get(e)[1]||0, this.properties.Darktones.get(e)[2]||0);
    u.Shadows.value.set(this.properties.Shadows.get(e)[0]||0, this.properties.Shadows.get(e)[1]||0, this.properties.Shadows.get(e)[2]||0);
    u.Blend_With_Original.value = this.properties.Blend_With_Original.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
