// Hydrochrome (AlipFX) - Zoidium custom effect
// Source: Hydrochrome By AlipFX.txt
// Reference shader: assets/shaders/fragment/preset/hydrochrome.glsl

(this.defaultName = "Hydrochrome"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Iridescent liquid chrome flow with displacement.",
  }),
  (this.shaderfile = "preset/hydrochrome"),
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
    Iterations: { dynamic: !0, name: "Iterations", type: PZ.property.type.NUMBER, value: 8, step: 0.1 },
    Seed: { dynamic: !0, name: "Seed", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Follow_Comp_Time: { dynamic: !0, name: "Follow Comp Time", type: PZ.property.type.OPTION, value: 1, items: "off;on" },
    Time_Offset: { dynamic: !0, name: "Time Offset", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    UniformDisplace: { dynamic: !0, name: "UniformDisplace", type: PZ.property.type.OPTION, value: 1, items: "off;on" },
    X_Displace: { dynamic: !0, name: "X Displace", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Y_Displace: { dynamic: !0, name: "Y Displace", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Displace_Angle: { dynamic: !0, name: "Displace Angle", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Hue_Shift: { dynamic: !0, name: "Hue Shift", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Chromatic: { dynamic: !0, name: "Chromatic", type: PZ.property.type.NUMBER, value: 5, step: 0.1 },
    Adding: { dynamic: !0, name: "Adding", type: PZ.property.type.NUMBER, value: 5, step: 0.1 },
    Power: { dynamic: !0, name: "Power", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Multiplier: { dynamic: !0, name: "Multiplier", type: PZ.property.type.NUMBER, value: 30, step: 0.1 },
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
        Iterations: { type: "f", value: 8 },
        Seed: { type: "f", value: 0 },
        Follow_Comp_Time: { type: "f", value: 1 },
        Time_Offset: { type: "f", value: 0 },
        UniformDisplace: { type: "f", value: 1 },
        X_Displace: { type: "f", value: 100 },
        Y_Displace: { type: "f", value: 0 },
        Displace_Angle: { type: "f", value: 0 },
        Hue_Shift: { type: "f", value: 0 },
        Chromatic: { type: "f", value: 5 },
        Adding: { type: "f", value: 5 },
        Power: { type: "f", value: 50 },
        Multiplier: { type: "f", value: 30 },
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
    u.Iterations.value = this.properties.Iterations.get(e);
    u.Seed.value = this.properties.Seed.get(e);
    u.Follow_Comp_Time.value = this.properties.Follow_Comp_Time.get(e);
    u.Time_Offset.value = this.properties.Time_Offset.get(e);
    u.UniformDisplace.value = this.properties.UniformDisplace.get(e);
    u.X_Displace.value = this.properties.X_Displace.get(e);
    u.Y_Displace.value = this.properties.Y_Displace.get(e);
    u.Displace_Angle.value = this.properties.Displace_Angle.get(e);
    u.Hue_Shift.value = this.properties.Hue_Shift.get(e);
    u.Chromatic.value = this.properties.Chromatic.get(e);
    u.Adding.value = this.properties.Adding.get(e);
    u.Power.value = this.properties.Power.get(e);
    u.Multiplier.value = this.properties.Multiplier.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
