// AZ Bubbles (AlipFX) - Zoidium custom effect
// Source: AZ Bubbles (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-bubbles.glsl

(this.defaultName = "AZ Bubbles"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Animated soap-bubble overlay with wobble and reflections.",
  }),
  (this.shaderfile = "preset/az-bubbles"),
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
    time: { dynamic: !0, name: "time", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Bubble_Amount: { dynamic: !0, name: "Bubble Amount", type: PZ.property.type.NUMBER, value: 150, step: 0.1 },
    Bubble_Speed: { dynamic: !0, name: "Bubble Speed", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Wobble_Amplitude: { dynamic: !0, name: "Wobble Amplitude", type: PZ.property.type.NUMBER, value: 10, step: 0.1 },
    Wobble_Frequency: { dynamic: !0, name: "Wobble Frequency", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Bubble_Size: { dynamic: !0, name: "Bubble Size", type: PZ.property.type.NUMBER, value: 40, step: 0.1 },
    Reflection_Type: { dynamic: !0, name: "Reflection Type", type: PZ.property.type.OPTION, value: 0, items: "Liquid;Metal" },
    Shading_Type: { dynamic: !0, name: "Shading Type", type: PZ.property.type.OPTION, value: 3, items: "None;Lighten;Darken;Fade Inwards;Fade Outwards" },
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
        time: { type: "f", value: 0 },
        Bubble_Amount: { type: "f", value: 150 },
        Bubble_Speed: { type: "f", value: 1 },
        Wobble_Amplitude: { type: "f", value: 10 },
        Wobble_Frequency: { type: "f", value: 1 },
        Bubble_Size: { type: "f", value: 40 },
        Reflection_Type: { type: "f", value: 0 },
        Shading_Type: { type: "f", value: 3 },
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
    u.time.value = this.properties.time.get(e);
    u.Bubble_Amount.value = this.properties.Bubble_Amount.get(e);
    u.Bubble_Speed.value = this.properties.Bubble_Speed.get(e);
    u.Wobble_Amplitude.value = this.properties.Wobble_Amplitude.get(e);
    u.Wobble_Frequency.value = this.properties.Wobble_Frequency.get(e);
    u.Bubble_Size.value = this.properties.Bubble_Size.get(e);
    u.Reflection_Type.value = this.properties.Reflection_Type.get(e);
    u.Shading_Type.value = this.properties.Shading_Type.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
