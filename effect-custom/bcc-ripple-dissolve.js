// BCC Ripple Dissolve (AlipFX) - Zoidium custom effect
// Source: BCC Ripple Dissolve (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/bcc-ripple-dissolve.glsl

(this.defaultName = "BCC Ripple Dissolve"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Dissolves the image with animated concentric ripple waves.",
  }),
  (this.shaderfile = "preset/bcc-ripple-dissolve"),
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
    Animation: { dynamic: !0, name: "Animation", type: PZ.property.type.OPTION, value: 0, items: "Auto;Pct. Done" },
    Percent_Done: { dynamic: !0, name: "Percent Done", type: PZ.property.type.NUMBER, value: 24.98, step: 0.1 },
    Radius_Peak: { dynamic: !0, name: "Radius Peak", type: PZ.property.type.NUMBER, value: 1200, step: 0.1 },
    Center: { dynamic: !0, name: "Center", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Height: { dynamic: !0, name: "Height", type: PZ.property.type.NUMBER, value: 30, step: 0.1 },
    Perpendicular_Height: { dynamic: !0, name: "Perpendicular Height", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Wave_Width: { dynamic: !0, name: "Wave Width", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Width_Percent_Increase: { dynamic: !0, name: "Width Percent Increase", type: PZ.property.type.NUMBER, value: 300, step: 0.1 },
    Speed: { dynamic: !0, name: "Speed", type: PZ.property.type.NUMBER, value: 20, step: 0.1 },
    Speed_Deceleration: { dynamic: !0, name: "Speed Deceleration", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Phase: { dynamic: !0, name: "Phase", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Inside_Radius: { dynamic: !0, name: "Inside Radius", type: PZ.property.type.NUMBER, value: 40, step: 0.1 },
    Fall_Off: { dynamic: !0, name: "Fall Off", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Light_Level: { dynamic: !0, name: "Light Level", type: PZ.property.type.NUMBER, value: 30, step: 0.1 },
    Light_Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Pin_Width: { dynamic: !0, name: "Pin Width", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
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
        Animation: { type: "f", value: 0 },
        Percent_Done: { type: "f", value: 24.98 },
        Radius_Peak: { type: "f", value: 1200 },
        Center: { type: "v2", value: new THREE.Vector2(0, 0) },
        Height: { type: "f", value: 30 },
        Perpendicular_Height: { type: "f", value: 0 },
        Wave_Width: { type: "f", value: 50 },
        Width_Percent_Increase: { type: "f", value: 300 },
        Speed: { type: "f", value: 20 },
        Speed_Deceleration: { type: "f", value: 100 },
        Phase: { type: "f", value: 0 },
        Inside_Radius: { type: "f", value: 40 },
        Fall_Off: { type: "f", value: 50 },
        Light_Level: { type: "f", value: 30 },
        Light_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Pin_Width: { type: "f", value: 0 },
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
    u.Animation.value = this.properties.Animation.get(e);
    u.Percent_Done.value = this.properties.Percent_Done.get(e);
    u.Radius_Peak.value = this.properties.Radius_Peak.get(e);
    const _Center = this.properties.Center.get(e); u.Center.value.set(_Center[0]||0, _Center[1]||0);
    u.Height.value = this.properties.Height.get(e);
    u.Perpendicular_Height.value = this.properties.Perpendicular_Height.get(e);
    u.Wave_Width.value = this.properties.Wave_Width.get(e);
    u.Width_Percent_Increase.value = this.properties.Width_Percent_Increase.get(e);
    u.Speed.value = this.properties.Speed.get(e);
    u.Speed_Deceleration.value = this.properties.Speed_Deceleration.get(e);
    u.Phase.value = this.properties.Phase.get(e);
    u.Inside_Radius.value = this.properties.Inside_Radius.get(e);
    u.Fall_Off.value = this.properties.Fall_Off.get(e);
    u.Light_Level.value = this.properties.Light_Level.get(e);
    u.Light_Color.value.set(this.properties.Light_Color.get(e)[0]||0, this.properties.Light_Color.get(e)[1]||0, this.properties.Light_Color.get(e)[2]||0);
    u.Pin_Width.value = this.properties.Pin_Width.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
