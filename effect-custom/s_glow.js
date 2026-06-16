// S_Glow (AlipFX) - Zoidium custom effect
// Source: S_Glow (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/s_glow.glsl

(this.defaultName = "S Glow"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Soft glowing halo around bright areas with tinted color.",
  }),
  (this.shaderfile = "preset/s_glow"),
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
    Brightness: { dynamic: !0, name: "Brightness", type: PZ.property.type.NUMBER, value: 2, step: 0.1 },
    Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Threshold: { dynamic: !0, name: "Threshold", type: PZ.property.type.NUMBER, value: 0.5, step: 0.1 },
    Threshold_Add_Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Glow_Width: { dynamic: !0, name: "Glow Width", type: PZ.property.type.NUMBER, value: 96, step: 0.1 },
    Width_X: { dynamic: !0, name: "Width X", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Width_Y: { dynamic: !0, name: "Width Y", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Width_Red: { dynamic: !0, name: "Width Red", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Width_Green: { dynamic: !0, name: "Width Green", type: PZ.property.type.NUMBER, value: 1.2, step: 0.1 },
    Width_Blue: { dynamic: !0, name: "Width Blue", type: PZ.property.type.NUMBER, value: 1.4, step: 0.1 },
    Show: { dynamic: !0, name: "Show", type: PZ.property.type.OPTION, value: 0, items: "Result;Threshold" },
    Combine: { dynamic: !0, name: "Combine", type: PZ.property.type.OPTION, value: 2, items: "Mult;Add;Screen;Difference;Overlay" },
    Edge_Mode: { dynamic: !0, name: "Edge Mode", type: PZ.property.type.OPTION, value: 1, items: "Transparent;Reflect" },
    Affect_Alpha: { dynamic: !0, name: "Affect Alpha", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Glow_From_Alpha: { dynamic: !0, name: "Glow From Alpha", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Glow_Under_Source: { dynamic: !0, name: "Glow Under Source", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Source_Opacity: { dynamic: !0, name: "Source Opacity", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    time: { dynamic: !0, name: "time", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Atmosphere_Amp: { dynamic: !0, name: "Atmosphere Amp", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Atmosphere_Freq: { dynamic: !0, name: "Atmosphere Freq", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Atmosphere_Detail: { dynamic: !0, name: "Atmosphere Detail", type: PZ.property.type.NUMBER, value: 0.6, step: 0.1 },
    Atmosphere_Seed: { dynamic: !0, name: "Atmosphere Seed", type: PZ.property.type.NUMBER, value: 0.12, step: 0.1 },
    Atmosphere_Speed: { dynamic: !0, name: "Atmosphere Speed", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
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
        Brightness: { type: "f", value: 2 },
        Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Threshold: { type: "f", value: 0.5 },
        Threshold_Add_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Glow_Width: { type: "f", value: 96 },
        Width_X: { type: "f", value: 1 },
        Width_Y: { type: "f", value: 1 },
        Width_Red: { type: "f", value: 1 },
        Width_Green: { type: "f", value: 1.2 },
        Width_Blue: { type: "f", value: 1.4 },
        Show: { type: "f", value: 0 },
        Combine: { type: "f", value: 2 },
        Edge_Mode: { type: "f", value: 1 },
        Affect_Alpha: { type: "f", value: 1 },
        Glow_From_Alpha: { type: "f", value: 0 },
        Glow_Under_Source: { type: "f", value: 0 },
        Source_Opacity: { type: "f", value: 1 },
        time: { type: "f", value: 0 },
        Atmosphere_Amp: { type: "f", value: 0 },
        Atmosphere_Freq: { type: "f", value: 1 },
        Atmosphere_Detail: { type: "f", value: 0.6 },
        Atmosphere_Seed: { type: "f", value: 0.12 },
        Atmosphere_Speed: { type: "f", value: 1 },
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
    u.Brightness.value = this.properties.Brightness.get(e);
    u.Color.value.set(this.properties.Color.get(e)[0]||0, this.properties.Color.get(e)[1]||0, this.properties.Color.get(e)[2]||0);
    u.Threshold.value = this.properties.Threshold.get(e);
    u.Threshold_Add_Color.value.set(this.properties.Threshold_Add_Color.get(e)[0]||0, this.properties.Threshold_Add_Color.get(e)[1]||0, this.properties.Threshold_Add_Color.get(e)[2]||0);
    u.Glow_Width.value = this.properties.Glow_Width.get(e);
    u.Width_X.value = this.properties.Width_X.get(e);
    u.Width_Y.value = this.properties.Width_Y.get(e);
    u.Width_Red.value = this.properties.Width_Red.get(e);
    u.Width_Green.value = this.properties.Width_Green.get(e);
    u.Width_Blue.value = this.properties.Width_Blue.get(e);
    u.Show.value = this.properties.Show.get(e);
    u.Combine.value = this.properties.Combine.get(e);
    u.Edge_Mode.value = this.properties.Edge_Mode.get(e);
    u.Affect_Alpha.value = this.properties.Affect_Alpha.get(e);
    u.Glow_From_Alpha.value = this.properties.Glow_From_Alpha.get(e);
    u.Glow_Under_Source.value = this.properties.Glow_Under_Source.get(e);
    u.Source_Opacity.value = this.properties.Source_Opacity.get(e);
    u.time.value = this.properties.time.get(e);
    u.Atmosphere_Amp.value = this.properties.Atmosphere_Amp.get(e);
    u.Atmosphere_Freq.value = this.properties.Atmosphere_Freq.get(e);
    u.Atmosphere_Detail.value = this.properties.Atmosphere_Detail.get(e);
    u.Atmosphere_Seed.value = this.properties.Atmosphere_Seed.get(e);
    u.Atmosphere_Speed.value = this.properties.Atmosphere_Speed.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
