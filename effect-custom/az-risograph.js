// AZ Risograph (AlipFX) - Zoidium custom effect
// Source: Risograph (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-risograph.glsl

(this.defaultName = "AZ Risograph"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Risograph print effect with grain, ink, and misregistration.",
  }),
  (this.shaderfile = "preset/az-risograph"),
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
    Preset: { dynamic: !0, name: "Preset", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Dark_Ink: { dynamic: !0, name: "Dark Ink", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Light_Ink: { dynamic: !0, name: "Light Ink", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Paper: { dynamic: !0, name: "Paper", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Effect_Intensity: { dynamic: !0, name: "Effect Intensity", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Tone_Lift: { dynamic: !0, name: "Tone Lift", type: PZ.property.type.NUMBER, value: 0.2, step: 0.1 },
    Halftone_Size: { dynamic: !0, name: "Halftone Size", type: PZ.property.type.NUMBER, value: 0.5, step: 0.1 },
    Misregister: { dynamic: !0, name: "Misregister", type: PZ.property.type.NUMBER, value: 0.5, step: 0.1 },
    Print_Roughness: { dynamic: !0, name: "Print Roughness", type: PZ.property.type.NUMBER, value: 0.7, step: 0.1 },
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
        Preset: { type: "f", value: 1 },
        Dark_Ink: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Light_Ink: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Paper: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Effect_Intensity: { type: "f", value: 1 },
        Tone_Lift: { type: "f", value: 0.2 },
        Halftone_Size: { type: "f", value: 0.5 },
        Misregister: { type: "f", value: 0.5 },
        Print_Roughness: { type: "f", value: 0.7 },
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
        u.Preset.value = this.properties.Preset.get(e);
        u.Dark_Ink.value.set(this.properties.Dark_Ink.get(e)[0]||0, this.properties.Dark_Ink.get(e)[1]||0, this.properties.Dark_Ink.get(e)[2]||0);
        u.Light_Ink.value.set(this.properties.Light_Ink.get(e)[0]||0, this.properties.Light_Ink.get(e)[1]||0, this.properties.Light_Ink.get(e)[2]||0);
        u.Paper.value.set(this.properties.Paper.get(e)[0]||0, this.properties.Paper.get(e)[1]||0, this.properties.Paper.get(e)[2]||0);
        u.Effect_Intensity.value = this.properties.Effect_Intensity.get(e);
        u.Tone_Lift.value = this.properties.Tone_Lift.get(e);
        u.Halftone_Size.value = this.properties.Halftone_Size.get(e);
        u.Misregister.value = this.properties.Misregister.get(e);
        u.Print_Roughness.value = this.properties.Print_Roughness.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
