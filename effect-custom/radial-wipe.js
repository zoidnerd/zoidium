// Radial Wipe (AlipFX) - Zoidium custom effect
// Source: Radial Wipe (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/radial-wipe.glsl

(this.defaultName = "Radial Wipe"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Angular wipe with sweep direction and feather.",
  }),
  (this.shaderfile = "preset/radial-wipe"),
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
    Transition_Completion: { dynamic: !0, name: "Transition Completion", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Start_Angle: { dynamic: !0, name: "Start Angle", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Wipe_Center: { dynamic: !0, name: "Wipe Center", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Wipe: { dynamic: !0, name: "Wipe", type: PZ.property.type.OPTION, value: 0, items: "CW;CCW;Both" },
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
        Transition_Completion: { type: "f", value: 0 },
        Start_Angle: { type: "f", value: 0 },
        Wipe_Center: { type: "v2", value: new THREE.Vector2(0, 0) },
        Wipe: { type: "i", value: 0 },
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
    u.Start_Angle.value = this.properties.Start_Angle.get(e);
    const _Wipe_Center = this.properties.Wipe_Center.get(e); u.Wipe_Center.value.set(_Wipe_Center[0]||0, _Wipe_Center[1]||0);
    u.Wipe.value = Math.round(this.properties.Wipe.get(e));
    u.Feather.value = this.properties.Feather.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
