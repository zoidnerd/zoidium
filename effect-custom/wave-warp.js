// Wave Warp (AlipFX) - Zoidium custom effect
// Source: Wave Warp (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/wave-warp.glsl

(this.defaultName = "Wave Warp"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Sinusoidal and shaped wave displacement with edge pinning.",
  }),
  (this.shaderfile = "preset/wave-warp"),
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
    Wave_Type: { dynamic: !0, name: "Wave Type", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Sine;Square;Triangle;Saw;Half-Circle;Full-Circle;Inverted Half;Step Noise;Smooth Noise" },
    Wave_Height: { dynamic: !0, name: "Wave Height", type: PZ.property.type.NUMBER, value: 10, step: 0.1 },
    Wave_Width: { dynamic: !0, name: "Wave Width", type: PZ.property.type.NUMBER, value: 118.4, step: 0.1 },
    Direction: { dynamic: !0, name: "Direction", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Wave_Speed: { dynamic: !0, name: "Wave Speed", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Pinning: { dynamic: !0, name: "Pinning", type: PZ.property.type.OPTION, value: 0, step: 1, items: "None;All Edges;Left;Top;Right;Bottom;Top/Bottom;Left/Right;Projection" },
    Phase: { dynamic: !0, name: "Phase", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Antialiasing: { dynamic: !0, name: "Antialiasing", type: PZ.property.type.OPTION, value: 0, step: 1, items: "None;2x2;3x3" },
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
        Wave_Type: { type: "f", value: 0 },
        Wave_Height: { type: "f", value: 10 },
        Wave_Width: { type: "f", value: 118.4 },
        Direction: { type: "f", value: 0 },
        Wave_Speed: { type: "f", value: 1 },
        Pinning: { type: "f", value: 0 },
        Phase: { type: "f", value: 0 },
        Antialiasing: { type: "f", value: 0 },
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
    u.Wave_Type.value = this.properties.Wave_Type.get(e);
    u.Wave_Height.value = this.properties.Wave_Height.get(e);
    u.Wave_Width.value = this.properties.Wave_Width.get(e);
    u.Direction.value = this.properties.Direction.get(e);
    u.Wave_Speed.value = this.properties.Wave_Speed.get(e);
    u.Pinning.value = this.properties.Pinning.get(e);
    u.Phase.value = this.properties.Phase.get(e);
    u.Antialiasing.value = this.properties.Antialiasing.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
