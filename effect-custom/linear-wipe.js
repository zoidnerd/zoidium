// Linear Wipe (AlipFX) - Zoidium custom effect
// Source: Linear Wipe (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/linear-wipe.glsl

(this.defaultName = "Linear Wipe"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Linear wipe transition with angle and feather.",
  }),
  (this.shaderfile = "preset/linear-wipe"),
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
    Transition_Completion: { dynamic: !0, name: "Transition Completion", type: PZ.property.type.NUMBER, value: 100.56, step: 0.1 },
    Wipe_Angle: { dynamic: !0, name: "Wipe Angle", type: PZ.property.type.NUMBER, value: 360, step: 0.1 },
    Feather: { dynamic: !0, name: "Feather", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
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
        Transition_Completion: { type: "f", value: 100.56 },
        Wipe_Angle: { type: "f", value: 360 },
        Feather: { type: "f", value: 0 },
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
    u.Transition_Completion.value = this.properties.Transition_Completion.get(e);
    u.Wipe_Angle.value = this.properties.Wipe_Angle.get(e);
    u.Feather.value = this.properties.Feather.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
