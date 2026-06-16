// Ripple (AlipFX) - Zoidium custom effect
// Source: Ripple (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/ripple.glsl

(this.defaultName = "Ripple"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Concentric wave ripples radiating from a center point.",
  }),
  (this.shaderfile = "preset/ripple"),
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
    Radius: { dynamic: !0, name: "Radius", type: PZ.property.type.NUMBER, value: 600, step: 0.1 },
    Center_of_Ripple: { dynamic: !0, name: "Center of Ripple", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Type_of_Conversion: { dynamic: !0, name: "Type of Conversion", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Asymmetric;Symmetric" },
    Wave_Speed: { dynamic: !0, name: "Wave Speed", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Wave_Width: { dynamic: !0, name: "Wave Width", type: PZ.property.type.NUMBER, value: 20, step: 0.1 },
    Wave_Height: { dynamic: !0, name: "Wave Height", type: PZ.property.type.NUMBER, value: 20, step: 0.1 },
    Ripple_Phase: { dynamic: !0, name: "Ripple Phase", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
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
        Radius: { type: "f", value: 600 },
        Center_of_Ripple: { type: "v2", value: new THREE.Vector2(0, 0) },
        Type_of_Conversion: { type: "f", value: 0 },
        Wave_Speed: { type: "f", value: 1 },
        Wave_Width: { type: "f", value: 20 },
        Wave_Height: { type: "f", value: 20 },
        Ripple_Phase: { type: "f", value: 0 },
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
    u.Radius.value = this.properties.Radius.get(e);
    const _Center_of_Ripple = this.properties.Center_of_Ripple.get(e); u.Center_of_Ripple.value.set(_Center_of_Ripple[0]||0, _Center_of_Ripple[1]||0);
    u.Type_of_Conversion.value = this.properties.Type_of_Conversion.get(e);
    u.Wave_Speed.value = this.properties.Wave_Speed.get(e);
    u.Wave_Width.value = this.properties.Wave_Width.get(e);
    u.Wave_Height.value = this.properties.Wave_Height.get(e);
    u.Ripple_Phase.value = this.properties.Ripple_Phase.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
