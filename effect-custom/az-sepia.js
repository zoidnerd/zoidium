// AZ Sepia (AlipFX) - Zoidium custom effect
// Source: Sepia (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-sepia.glsl

(this.defaultName = "AZ Sepia"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Tonal sepia print with ink tone, tint density, and print definition.",
  }),
  (this.shaderfile = "preset/az-sepia"),
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
    Sepia_Strength: { dynamic: !0, name: "Sepia Strength", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Ink_Tone: { dynamic: !0, name: "Ink Tone", type: PZ.property.type.OPTION, value: 0, items: "Standard;Gold;Copper" },
    Tint_Density: { dynamic: !0, name: "Tint Density", type: PZ.property.type.NUMBER, value: 1.7, step: 0.1 },
    Print_Definition: { dynamic: !0, name: "Print Definition", type: PZ.property.type.NUMBER, value: 0.7, step: 0.1 },
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
        Sepia_Strength: { type: "f", value: 1 },
        Ink_Tone: { type: "i", value: 0 },
        Tint_Density: { type: "f", value: 1.7 },
        Print_Definition: { type: "f", value: 0.7 },
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
        u.Sepia_Strength.value = this.properties.Sepia_Strength.get(e);
        u.Ink_Tone.value = Math.round(this.properties.Ink_Tone.get(e));
        u.Tint_Density.value = this.properties.Tint_Density.get(e);
        u.Print_Definition.value = this.properties.Print_Definition.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
