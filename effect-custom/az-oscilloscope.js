// AZ Oscilloscope (AlipFX) - Zoidium custom effect
// Source: Oscilloscope (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-oscilloscope.glsl

(this.defaultName = "AZ Oscilloscope"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Oscilloscope waveform overlay with sweep and phosphor.",
  }),
  (this.shaderfile = "preset/az-oscilloscope"),
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
    Test_signal: { dynamic: !0, name: "Test Signal", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Picture_gain: { dynamic: !0, name: "Picture Gain", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Picture_threshold: { dynamic: !0, name: "Picture Threshold", type: PZ.property.type.NUMBER, value: 0.05, step: 0.1 },
    Audio_gain: { dynamic: !0, name: "Audio Gain", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Signal_resolution: { dynamic: !0, name: "Signal Resolution", type: PZ.property.type.NUMBER, value: 2000, step: 1.0 },
    Steps_per_loop: { dynamic: !0, name: "Steps Per Loop", type: PZ.property.type.NUMBER, value: 5000, step: 1.0 },
    Beam_point_density: { dynamic: !0, name: "Beam Point Density", type: PZ.property.type.NUMBER, value: 20, step: 0.1 },
    Trace_frequency: { dynamic: !0, name: "Trace Frequency", type: PZ.property.type.NUMBER, value: 10, step: 0.1 },
    Phosphor_fade_time: { dynamic: !0, name: "Phosphor Fade Time", type: PZ.property.type.NUMBER, value: 40, step: 0.1 },
    Beam_width: { dynamic: !0, name: "Beam Width", type: PZ.property.type.NUMBER, value: 0.3, step: 0.1 },
    Brightness: { dynamic: !0, name: "Brightness", type: PZ.property.type.NUMBER, value: 25.6, step: 0.1 },
    Intensity_flicker: { dynamic: !0, name: "Intensity Flicker", type: PZ.property.type.NUMBER, value: 3, step: 0.1 },
    Curvature_gain: { dynamic: !0, name: "Curvature Gain", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Transparent: { dynamic: !0, name: "Transparent", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
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
        Test_signal: { type: "f", value: 0 },
        Picture_gain: { type: "f", value: 1 },
        Picture_threshold: { type: "f", value: 0.05 },
        Audio_gain: { type: "f", value: 1 },
        Signal_resolution: { type: "f", value: 2000 },
        Steps_per_loop: { type: "f", value: 5000 },
        Beam_point_density: { type: "f", value: 20 },
        Trace_frequency: { type: "f", value: 10 },
        Phosphor_fade_time: { type: "f", value: 40 },
        Beam_width: { type: "f", value: 0.3 },
        Brightness: { type: "f", value: 25.6 },
        Intensity_flicker: { type: "f", value: 3 },
        Curvature_gain: { type: "f", value: 0 },
        Transparent: { type: "f", value: 0 },
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
        u.Test_signal.value = this.properties.Test_signal.get(e);
        u.Picture_gain.value = this.properties.Picture_gain.get(e);
        u.Picture_threshold.value = this.properties.Picture_threshold.get(e);
        u.Audio_gain.value = this.properties.Audio_gain.get(e);
        u.Signal_resolution.value = this.properties.Signal_resolution.get(e);
        u.Steps_per_loop.value = this.properties.Steps_per_loop.get(e);
        u.Beam_point_density.value = this.properties.Beam_point_density.get(e);
        u.Trace_frequency.value = this.properties.Trace_frequency.get(e);
        u.Phosphor_fade_time.value = this.properties.Phosphor_fade_time.get(e);
        u.Beam_width.value = this.properties.Beam_width.get(e);
        u.Brightness.value = this.properties.Brightness.get(e);
        u.Intensity_flicker.value = this.properties.Intensity_flicker.get(e);
        u.Curvature_gain.value = this.properties.Curvature_gain.get(e);
        u.Transparent.value = this.properties.Transparent.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
