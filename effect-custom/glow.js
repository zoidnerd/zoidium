// Glow (AlipFX) - Zoidium custom effect
// Source: Glow (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/glow.glsl

(this.defaultName = "Glow"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Bloom/glow halo with blend modes and color loop.",
  }),
  (this.shaderfile = "preset/glow"),
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
    Glow_Based_On: { dynamic: !0, name: "Glow Based On", type: PZ.property.type.OPTION, value: 1, items: "Alpha;Luma" },
    Glow_Threshold: { dynamic: !0, name: "Glow Threshold", type: PZ.property.type.NUMBER, value: 60, step: 0.1 },
    Glow_Radius: { dynamic: !0, name: "Glow Radius", type: PZ.property.type.NUMBER, value: 10, step: 0.1 },
    Glow_Intensity: { dynamic: !0, name: "Glow Intensity", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Composite_Original: { dynamic: !0, name: "Composite Original", type: PZ.property.type.OPTION, value: 1, items: "Over;Operation;Glow Only" },
    Glow_Operation: { dynamic: !0, name: "Glow Operation", type: PZ.property.type.OPTION, value: 2, items: "Replace;Normal;Add;Multiply;Stipple;Screen;Overlay;Soft Light;Hard Light;Darken;Lighten;Difference;Hue;Saturation;Color;Luminosity;Color Dodge;Color Burn;Exclusion;Alpha A;Luminance;Cut A;Cut L;Premul;Under" },
    Glow_Colors: { dynamic: !0, name: "Glow Colors", type: PZ.property.type.OPTION, value: 0, items: "Source;A/B Gradient" },
    Color_Looping: { dynamic: !0, name: "Color Looping", type: PZ.property.type.OPTION, value: 2, items: "AB Saw;BA Saw;ABA Tri;BAB Tri" },
    Color_Loops: { dynamic: !0, name: "Color Loops", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Color_Phase: { dynamic: !0, name: "Color Phase", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    A_B_Midpoint: { dynamic: !0, name: "A B Midpoint", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Color_A: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Color_B: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Glow_Dimensions: { dynamic: !0, name: "Glow Dimensions", type: PZ.property.type.OPTION, value: 0, items: "Radial;Horizontal;Vertical" },
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
        Glow_Based_On: { type: "f", value: 1 },
        Glow_Threshold: { type: "f", value: 60 },
        Glow_Radius: { type: "f", value: 10 },
        Glow_Intensity: { type: "f", value: 1 },
        Composite_Original: { type: "f", value: 1 },
        Glow_Operation: { type: "f", value: 2 },
        Glow_Colors: { type: "f", value: 0 },
        Color_Looping: { type: "f", value: 2 },
        Color_Loops: { type: "f", value: 0 },
        Color_Phase: { type: "f", value: 0 },
        A_B_Midpoint: { type: "f", value: 50 },
        Color_A: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Color_B: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Glow_Dimensions: { type: "f", value: 0 },
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
    u.Glow_Based_On.value = this.properties.Glow_Based_On.get(e);
    u.Glow_Threshold.value = this.properties.Glow_Threshold.get(e);
    u.Glow_Radius.value = this.properties.Glow_Radius.get(e);
    u.Glow_Intensity.value = this.properties.Glow_Intensity.get(e);
    u.Composite_Original.value = this.properties.Composite_Original.get(e);
    u.Glow_Operation.value = this.properties.Glow_Operation.get(e);
    u.Glow_Colors.value = this.properties.Glow_Colors.get(e);
    u.Color_Looping.value = this.properties.Color_Looping.get(e);
    u.Color_Loops.value = this.properties.Color_Loops.get(e);
    u.Color_Phase.value = this.properties.Color_Phase.get(e);
    u.A_B_Midpoint.value = this.properties.A_B_Midpoint.get(e);
    u.Color_A.value.set(this.properties.Color_A.get(e)[0]||0, this.properties.Color_A.get(e)[1]||0, this.properties.Color_A.get(e)[2]||0);
    u.Color_B.value.set(this.properties.Color_B.get(e)[0]||0, this.properties.Color_B.get(e)[1]||0, this.properties.Color_B.get(e)[2]||0);
    u.Glow_Dimensions.value = this.properties.Glow_Dimensions.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
