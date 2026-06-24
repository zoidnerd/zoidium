// CRTX Lite (AlipFX) - Zoidium custom effect
// Source: CRTX Lite (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/crtx-lite.glsl

(this.defaultName = "CRTX Lite"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Lightweight CRT effect with scanlines, vignette, and chromatic aberration.",
  }),
  (this.shaderfile = "preset/crtx-lite"),
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
    Preset: { dynamic: !0, name: "Preset", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Look_Strength: { dynamic: !0, name: "Look Strength", type: PZ.property.type.NUMBER, value: 0.5, step: 0.1 },
    Brightness: { dynamic: !0, name: "Brightness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Contrast: { dynamic: !0, name: "Contrast", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Color_Temperature: { dynamic: !0, name: "Color Temperature", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Tint: { dynamic: !0, name: "Tint", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Curvature: { dynamic: !0, name: "Curvature", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Screen_Type: { dynamic: !0, name: "Screen Type", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Screen_Texture: { dynamic: !0, name: "Screen Texture", type: PZ.property.type.NUMBER, value: 3, step: 0.1 },
    Scanlines: { dynamic: !0, name: "Scanlines", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Glow: { dynamic: !0, name: "Glow", type: PZ.property.type.NUMBER, value: 0.2, step: 0.1 },
    Edge_Brightness: { dynamic: !0, name: "Edge Brightness", type: PZ.property.type.NUMBER, value: 0.93, step: 0.1 },
    Phosphor_Trail: { dynamic: !0, name: "Phosphor Trail", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Vignette: { dynamic: !0, name: "Vignette", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Color_Bleed: { dynamic: !0, name: "Color Bleed", type: PZ.property.type.NUMBER, value: 0.5, step: 0.1 },
    Analog_Noise: { dynamic: !0, name: "Analog Noise", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Signal_Damage: { dynamic: !0, name: "Signal Damage", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Warp: { dynamic: !0, name: "Warp", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Sync_Drift: { dynamic: !0, name: "Sync Drift", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Blanking: { dynamic: !0, name: "Blanking", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Shutter_Strength: { dynamic: !0, name: "Shutter Strength", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Shutter_Readout: { dynamic: !0, name: "Shutter Readout", type: PZ.property.type.NUMBER, value: 14, step: 0.1 },
    Render_Quality: { dynamic: !0, name: "Render Quality", type: PZ.property.type.NUMBER, value: 3, step: 0.1 },
    GPU_Rendering: { dynamic: !0, name: "Gpu Rendering", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
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
        Preset: { type: "f", value: 0 },
        Look_Strength: { type: "f", value: 0.5 },
        Brightness: { type: "f", value: 0 },
        Contrast: { type: "f", value: 0 },
        Color_Temperature: { type: "f", value: 1 },
        Tint: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Curvature: { type: "f", value: 0 },
        Screen_Type: { type: "f", value: 0 },
        Screen_Texture: { type: "f", value: 3 },
        Scanlines: { type: "f", value: 0 },
        Glow: { type: "f", value: 0.2 },
        Edge_Brightness: { type: "f", value: 0.93 },
        Phosphor_Trail: { type: "f", value: 0 },
        Vignette: { type: "f", value: 0 },
        Color_Bleed: { type: "f", value: 0.5 },
        Analog_Noise: { type: "f", value: 1 },
        Signal_Damage: { type: "f", value: 0 },
        Warp: { type: "f", value: 0 },
        Sync_Drift: { type: "f", value: 0 },
        Blanking: { type: "f", value: 0 },
        Shutter_Strength: { type: "f", value: 0 },
        Shutter_Readout: { type: "f", value: 14 },
        Render_Quality: { type: "f", value: 3 },
        GPU_Rendering: { type: "f", value: 1 },
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
        u.Preset.value = this.properties.Preset.get(e);
        u.Look_Strength.value = this.properties.Look_Strength.get(e);
        u.Brightness.value = this.properties.Brightness.get(e);
        u.Contrast.value = this.properties.Contrast.get(e);
        u.Color_Temperature.value = this.properties.Color_Temperature.get(e);
        u.Tint.value.set(this.properties.Tint.get(e)[0]||0, this.properties.Tint.get(e)[1]||0, this.properties.Tint.get(e)[2]||0);
        u.Curvature.value = this.properties.Curvature.get(e);
        u.Screen_Type.value = this.properties.Screen_Type.get(e);
        u.Screen_Texture.value = this.properties.Screen_Texture.get(e);
        u.Scanlines.value = this.properties.Scanlines.get(e);
        u.Glow.value = this.properties.Glow.get(e);
        u.Edge_Brightness.value = this.properties.Edge_Brightness.get(e);
        u.Phosphor_Trail.value = this.properties.Phosphor_Trail.get(e);
        u.Vignette.value = this.properties.Vignette.get(e);
        u.Color_Bleed.value = this.properties.Color_Bleed.get(e);
        u.Analog_Noise.value = this.properties.Analog_Noise.get(e);
        u.Signal_Damage.value = this.properties.Signal_Damage.get(e);
        u.Warp.value = this.properties.Warp.get(e);
        u.Sync_Drift.value = this.properties.Sync_Drift.get(e);
        u.Blanking.value = this.properties.Blanking.get(e);
        u.Shutter_Strength.value = this.properties.Shutter_Strength.get(e);
        u.Shutter_Readout.value = this.properties.Shutter_Readout.get(e);
        u.Render_Quality.value = this.properties.Render_Quality.get(e);
        u.GPU_Rendering.value = this.properties.GPU_Rendering.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
