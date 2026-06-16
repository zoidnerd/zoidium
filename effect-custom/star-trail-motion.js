// Star Trail Motion (AlipFX) - Zoidium custom effect
// Source: Star Trail Motion (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/star-trail-motion.glsl

(this.defaultName = "Star Trail Motion"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Radial star-trail arcs rotating around the image center.",
  }),
  (this.shaderfile = "preset/star-trail-motion"),
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
    Min_Length: { dynamic: !0, name: "Min Length", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Length: { dynamic: !0, name: "Length", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Min_Width: { dynamic: !0, name: "Min Width", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Max_Width: { dynamic: !0, name: "Max Width", type: PZ.property.type.NUMBER, value: 3, step: 0.1 },
    Min_Range: { dynamic: !0, name: "Min Range", type: PZ.property.type.NUMBER, value: 250, step: 0.1 },
    Max_Range: { dynamic: !0, name: "Max Range", type: PZ.property.type.NUMBER, value: 1500, step: 0.1 },
    A: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    B: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Rotation_Speed: { dynamic: !0, name: "Rotation Speed", type: PZ.property.type.NUMBER, value: 10, step: 0.1 },
    Speed_Random: { dynamic: !0, name: "Speed Random", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Opacity: { dynamic: !0, name: "Opacity", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Opacity_Random: { dynamic: !0, name: "Opacity Random", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Start_Length: { dynamic: !0, name: "Start Length", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    End_Length: { dynamic: !0, name: "End Length", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Start_Width: { dynamic: !0, name: "Start Width", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    End_Width: { dynamic: !0, name: "End Width", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Dash: { dynamic: !0, name: "Dash", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Offset: { dynamic: !0, name: "Offset", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Seed: { dynamic: !0, name: "Seed", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
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
        Min_Length: { type: "f", value: 0 },
        Length: { type: "f", value: 50 },
        Min_Width: { type: "f", value: 1 },
        Max_Width: { type: "f", value: 3 },
        Min_Range: { type: "f", value: 250 },
        Max_Range: { type: "f", value: 1500 },
        A: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        B: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Rotation_Speed: { type: "f", value: 10 },
        Speed_Random: { type: "f", value: 0 },
        Opacity: { type: "f", value: 100 },
        Opacity_Random: { type: "f", value: 0 },
        Start_Length: { type: "f", value: 0 },
        End_Length: { type: "f", value: 0 },
        Start_Width: { type: "f", value: 0 },
        End_Width: { type: "f", value: 0 },
        Dash: { type: "f", value: 0 },
        Offset: { type: "f", value: 0 },
        Seed: { type: "f", value: 0 },
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
    u.Min_Length.value = this.properties.Min_Length.get(e);
    u.Length.value = this.properties.Length.get(e);
    u.Min_Width.value = this.properties.Min_Width.get(e);
    u.Max_Width.value = this.properties.Max_Width.get(e);
    u.Min_Range.value = this.properties.Min_Range.get(e);
    u.Max_Range.value = this.properties.Max_Range.get(e);
    u.A.value.set(this.properties.A.get(e)[0]||0, this.properties.A.get(e)[1]||0, this.properties.A.get(e)[2]||0);
    u.B.value.set(this.properties.B.get(e)[0]||0, this.properties.B.get(e)[1]||0, this.properties.B.get(e)[2]||0);
    u.Rotation_Speed.value = this.properties.Rotation_Speed.get(e);
    u.Speed_Random.value = this.properties.Speed_Random.get(e);
    u.Opacity.value = this.properties.Opacity.get(e);
    u.Opacity_Random.value = this.properties.Opacity_Random.get(e);
    u.Start_Length.value = this.properties.Start_Length.get(e);
    u.End_Length.value = this.properties.End_Length.get(e);
    u.Start_Width.value = this.properties.Start_Width.get(e);
    u.End_Width.value = this.properties.End_Width.get(e);
    u.Dash.value = this.properties.Dash.get(e);
    u.Offset.value = this.properties.Offset.get(e);
    u.Seed.value = this.properties.Seed.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
