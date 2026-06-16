// AZ Snowfall (AlipFX) - Zoidium custom effect
// Source: AZ Snowfall (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-snowfall.glsl

(this.defaultName = "AZ Snowfall"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Falling snow flakes with wind, speed, and wiggle.",
  }),
  (this.shaderfile = "preset/az-snowfall"),
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
    Time: { dynamic: !0, name: "Time", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Flakes: { dynamic: !0, name: "Flakes", type: PZ.property.type.NUMBER, value: 1000, step: 0.1 },
    Size: { dynamic: !0, name: "Size", type: PZ.property.type.NUMBER, value: 30, step: 0.1 },
    Size_Variation: { dynamic: !0, name: "Size Variation", type: PZ.property.type.NUMBER, value: 25, step: 0.1 },
    Scene_Depth: { dynamic: !0, name: "Scene Depth", type: PZ.property.type.NUMBER, value: 5000, step: 0.1 },
    Speed: { dynamic: !0, name: "Speed", type: PZ.property.type.NUMBER, value: 250, step: 0.1 },
    Speed_Variation: { dynamic: !0, name: "Speed Variation", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Wind: { dynamic: !0, name: "Wind", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Wind_Variation: { dynamic: !0, name: "Wind Variation", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Spread: { dynamic: !0, name: "Spread", type: PZ.property.type.NUMBER, value: 15, step: 0.1 },
    Wiggle_Amount: { dynamic: !0, name: "Wiggle Amount", type: PZ.property.type.NUMBER, value: 20, step: 0.1 },
    Wiggle_Variation: { dynamic: !0, name: "Wiggle Variation", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Wiggle_Frequency: { dynamic: !0, name: "Wiggle Frequency", type: PZ.property.type.NUMBER, value: 10, step: 0.1 },
    Frequency_Variation: { dynamic: !0, name: "Frequency Variation", type: PZ.property.type.NUMBER, value: 75, step: 0.1 },
    Stochastic_Wiggle: { dynamic: !0, name: "Stochastic Wiggle", type: PZ.property.type.OPTION, value: 1, items: "off;on" },
    Flake_Flatness: { dynamic: !0, name: "Flake Flatness", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Opacity: { dynamic: !0, name: "Opacity", type: PZ.property.type.NUMBER, value: 0.5, step: 0.1 },
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
        Time: { type: "f", value: 0 },
        Flakes: { type: "f", value: 1000 },
        Size: { type: "f", value: 30 },
        Size_Variation: { type: "f", value: 25 },
        Scene_Depth: { type: "f", value: 5000 },
        Speed: { type: "f", value: 250 },
        Speed_Variation: { type: "f", value: 50 },
        Wind: { type: "f", value: 0 },
        Wind_Variation: { type: "f", value: 0 },
        Spread: { type: "f", value: 15 },
        Wiggle_Amount: { type: "f", value: 20 },
        Wiggle_Variation: { type: "f", value: 0 },
        Wiggle_Frequency: { type: "f", value: 10 },
        Frequency_Variation: { type: "f", value: 75 },
        Stochastic_Wiggle: { type: "f", value: 1 },
        Flake_Flatness: { type: "f", value: 50 },
        Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Opacity: { type: "f", value: 0.5 },
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
    u.Time.value = this.properties.Time.get(e);
    u.Flakes.value = this.properties.Flakes.get(e);
    u.Size.value = this.properties.Size.get(e);
    u.Size_Variation.value = this.properties.Size_Variation.get(e);
    u.Scene_Depth.value = this.properties.Scene_Depth.get(e);
    u.Speed.value = this.properties.Speed.get(e);
    u.Speed_Variation.value = this.properties.Speed_Variation.get(e);
    u.Wind.value = this.properties.Wind.get(e);
    u.Wind_Variation.value = this.properties.Wind_Variation.get(e);
    u.Spread.value = this.properties.Spread.get(e);
    u.Wiggle_Amount.value = this.properties.Wiggle_Amount.get(e);
    u.Wiggle_Variation.value = this.properties.Wiggle_Variation.get(e);
    u.Wiggle_Frequency.value = this.properties.Wiggle_Frequency.get(e);
    u.Frequency_Variation.value = this.properties.Frequency_Variation.get(e);
    u.Stochastic_Wiggle.value = this.properties.Stochastic_Wiggle.get(e);
    u.Flake_Flatness.value = this.properties.Flake_Flatness.get(e);
    u.Color.value.set(this.properties.Color.get(e)[0]||0, this.properties.Color.get(e)[1]||0, this.properties.Color.get(e)[2]||0);
    u.Opacity.value = this.properties.Opacity.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
