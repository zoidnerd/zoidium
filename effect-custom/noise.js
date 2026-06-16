// Noise (AlipFX) - Zoidium custom effect
// Source: Noise (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/noise.glsl

(this.defaultName = "Noise"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Adds film grain noise with optional color.",
  }),
  (this.shaderfile = "preset/noise"),
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
    Amount_Of_Noise: { dynamic: !0, name: "Amount Of Noise", type: PZ.property.type.NUMBER, value: 20, step: 0.1 },
    Noise_Type: { dynamic: !0, name: "Noise Type", type: PZ.property.type.OPTION, value: 1, items: "Mono;Color", step: 1 },
    Clipping: { dynamic: !0, name: "Clipping", type: PZ.property.type.OPTION, value: 1, items: "off;on", step: 1 },
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
        Amount_Of_Noise: { type: "f", value: 20 },
        Noise_Type: { type: "f", value: 1 },
        Clipping: { type: "f", value: 1 },
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
    u.Amount_Of_Noise.value = this.properties.Amount_Of_Noise.get(e);
    u.Noise_Type.value = this.properties.Noise_Type.get(e);
    u.Clipping.value = this.properties.Clipping.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
