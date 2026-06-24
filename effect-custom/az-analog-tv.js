// AZ Analog TV (AlipFX) - Zoidium custom effect
// Source: Analog TV (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-analog-tv.glsl

(this.defaultName = "AZ Analog TV"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "CRT television simulation with scanlines, bloom, chromatic aberration, geometry distortion, and analog artifacts.",
  }),
  (this.shaderfile = "preset/az-analog-tv"),
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
    Scanline_Intensity: { dynamic: !0, name: "Scanline Intensity", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Scanline_Width: { dynamic: !0, name: "Scanline Width", type: PZ.property.type.NUMBER, value: 1.5, step: 0.1 },
    Dot_Mask: { dynamic: !0, name: "Dot Mask", type: PZ.property.type.NUMBER, value: 30, step: 0.1 },
    CRT_Gamma: { dynamic: !0, name: "Crt Gamma", type: PZ.property.type.NUMBER, value: 2.4, step: 0.1 },
    Monitor_Gamma: { dynamic: !0, name: "Monitor Gamma", type: PZ.property.type.NUMBER, value: 2.2, step: 0.1 },
    Halation: { dynamic: !0, name: "Halation", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Halation_Threshold: { dynamic: !0, name: "Halation Threshold", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Bloom_Threshold: { dynamic: !0, name: "Bloom Threshold", type: PZ.property.type.NUMBER, value: 70, step: 0.1 },
    Bloom_Intensity: { dynamic: !0, name: "Bloom Intensity", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Bloom_Radius: { dynamic: !0, name: "Bloom Radius", type: PZ.property.type.NUMBER, value: 10, step: 0.1 },
    Red_Offset_X: { dynamic: !0, name: "Red Offset X", type: PZ.property.type.NUMBER, value: -2, step: 0.1 },
    Red_Offset_Y: { dynamic: !0, name: "Red Offset Y", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Green_Offset_X: { dynamic: !0, name: "Green Offset X", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Green_Offset_Y: { dynamic: !0, name: "Green Offset Y", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Blue_Offset_X: { dynamic: !0, name: "Blue Offset X", type: PZ.property.type.NUMBER, value: 2, step: 0.1 },
    Blue_Offset_Y: { dynamic: !0, name: "Blue Offset Y", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Color_Bleed: { dynamic: !0, name: "Color Bleed", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Noise: { dynamic: !0, name: "Noise", type: PZ.property.type.NUMBER, value: 5, step: 0.1 },
    Jitter: { dynamic: !0, name: "Jitter", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Hum_Bar_Strength: { dynamic: !0, name: "Hum Bar Strength", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Hum_Bar_Speed: { dynamic: !0, name: "Hum Bar Speed", type: PZ.property.type.NUMBER, value: 0.05, step: 0.1 },
    Hum_Bar_Count: { dynamic: !0, name: "Hum Bar Count", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Corner_Size: { dynamic: !0, name: "Corner Size", type: PZ.property.type.NUMBER, value: 0.03, step: 0.1 },
    Barrel: { dynamic: !0, name: "Barrel", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Pincushion: { dynamic: !0, name: "Pincushion", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    H_Keystone: { dynamic: !0, name: "H Keystone", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    V_Keystone: { dynamic: !0, name: "V Keystone", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Expand_Beyond_Layer: { dynamic: !0, name: "Expand Beyond Layer", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Exposure: { dynamic: !0, name: "Exposure", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Vignette: { dynamic: !0, name: "Vignette", type: PZ.property.type.NUMBER, value: 20, step: 0.1 },
    Mix: { dynamic: !0, name: "Mix", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
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
        Scanline_Intensity: { type: "f", value: 50 },
        Scanline_Width: { type: "f", value: 1.5 },
        Dot_Mask: { type: "f", value: 30 },
        CRT_Gamma: { type: "f", value: 2.4 },
        Monitor_Gamma: { type: "f", value: 2.2 },
        Halation: { type: "f", value: 0 },
        Halation_Threshold: { type: "f", value: 50 },
        Bloom_Threshold: { type: "f", value: 70 },
        Bloom_Intensity: { type: "f", value: 0 },
        Bloom_Radius: { type: "f", value: 10 },
        Red_Offset_X: { type: "f", value: -2 },
        Red_Offset_Y: { type: "f", value: 0 },
        Green_Offset_X: { type: "f", value: 0 },
        Green_Offset_Y: { type: "f", value: 0 },
        Blue_Offset_X: { type: "f", value: 2 },
        Blue_Offset_Y: { type: "f", value: 0 },
        Color_Bleed: { type: "f", value: 0 },
        Noise: { type: "f", value: 5 },
        Jitter: { type: "f", value: 0 },
        Hum_Bar_Strength: { type: "f", value: 0 },
        Hum_Bar_Speed: { type: "f", value: 0.05 },
        Hum_Bar_Count: { type: "f", value: 1 },
        Corner_Size: { type: "f", value: 0.03 },
        Barrel: { type: "f", value: 0 },
        Pincushion: { type: "f", value: 0 },
        H_Keystone: { type: "f", value: 0 },
        V_Keystone: { type: "f", value: 0 },
        Expand_Beyond_Layer: { type: "f", value: 0 },
        Exposure: { type: "f", value: 0 },
        Vignette: { type: "f", value: 20 },
        Mix: { type: "f", value: 100 },
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
        u.Scanline_Intensity.value = this.properties.Scanline_Intensity.get(e);
        u.Scanline_Width.value = this.properties.Scanline_Width.get(e);
        u.Dot_Mask.value = this.properties.Dot_Mask.get(e);
        u.CRT_Gamma.value = this.properties.CRT_Gamma.get(e);
        u.Monitor_Gamma.value = this.properties.Monitor_Gamma.get(e);
        u.Halation.value = this.properties.Halation.get(e);
        u.Halation_Threshold.value = this.properties.Halation_Threshold.get(e);
        u.Bloom_Threshold.value = this.properties.Bloom_Threshold.get(e);
        u.Bloom_Intensity.value = this.properties.Bloom_Intensity.get(e);
        u.Bloom_Radius.value = this.properties.Bloom_Radius.get(e);
        u.Red_Offset_X.value = this.properties.Red_Offset_X.get(e);
        u.Red_Offset_Y.value = this.properties.Red_Offset_Y.get(e);
        u.Green_Offset_X.value = this.properties.Green_Offset_X.get(e);
        u.Green_Offset_Y.value = this.properties.Green_Offset_Y.get(e);
        u.Blue_Offset_X.value = this.properties.Blue_Offset_X.get(e);
        u.Blue_Offset_Y.value = this.properties.Blue_Offset_Y.get(e);
        u.Color_Bleed.value = this.properties.Color_Bleed.get(e);
        u.Noise.value = this.properties.Noise.get(e);
        u.Jitter.value = this.properties.Jitter.get(e);
        u.Hum_Bar_Strength.value = this.properties.Hum_Bar_Strength.get(e);
        u.Hum_Bar_Speed.value = this.properties.Hum_Bar_Speed.get(e);
        u.Hum_Bar_Count.value = this.properties.Hum_Bar_Count.get(e);
        u.Corner_Size.value = this.properties.Corner_Size.get(e);
        u.Barrel.value = this.properties.Barrel.get(e);
        u.Pincushion.value = this.properties.Pincushion.get(e);
        u.H_Keystone.value = this.properties.H_Keystone.get(e);
        u.V_Keystone.value = this.properties.V_Keystone.get(e);
        u.Expand_Beyond_Layer.value = this.properties.Expand_Beyond_Layer.get(e);
        u.Exposure.value = this.properties.Exposure.get(e);
        u.Vignette.value = this.properties.Vignette.get(e);
        u.Mix.value = this.properties.Mix.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
