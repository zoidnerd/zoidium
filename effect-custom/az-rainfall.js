// AZ Rainfall (AlipFX) - Zoidium custom effect
// Source: AZ Rainfall (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-rainfall.glsl

(this.defaultName = "AZ Rainfall"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Falling rain drops with wind, speed, and depth.",
  }),
  (this.shaderfile = "preset/az-rainfall"),
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
    Drops: { dynamic: !0, name: "Drops", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Size: { dynamic: !0, name: "Size", type: PZ.property.type.NUMBER, value: 3, step: 0.1 },
    Scene_Depth: { dynamic: !0, name: "Scene Depth", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Speed: { dynamic: !0, name: "Speed", type: PZ.property.type.NUMBER, value: 3000, step: 0.1 },
    Wind: { dynamic: !0, name: "Wind", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Wind_Variation: { dynamic: !0, name: "Wind Variation", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Spread: { dynamic: !0, name: "Spread", type: PZ.property.type.NUMBER, value: 6, step: 0.1 },
    Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Opacity: { dynamic: !0, name: "Opacity", type: PZ.property.type.NUMBER, value: 0.25, step: 0.1 },
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
        Drops: { type: "f", value: 50 },
        Size: { type: "f", value: 3 },
        Scene_Depth: { type: "f", value: 50 },
        Speed: { type: "f", value: 3000 },
        Wind: { type: "f", value: 0 },
        Wind_Variation: { type: "f", value: 0 },
        Spread: { type: "f", value: 6 },
        Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Opacity: { type: "f", value: 0.25 },
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
    u.Drops.value = this.properties.Drops.get(e);
    u.Size.value = this.properties.Size.get(e);
    u.Scene_Depth.value = this.properties.Scene_Depth.get(e);
    u.Speed.value = this.properties.Speed.get(e);
    u.Wind.value = this.properties.Wind.get(e);
    u.Wind_Variation.value = this.properties.Wind_Variation.get(e);
    u.Spread.value = this.properties.Spread.get(e);
    u.Color.value.set(this.properties.Color.get(e)[0]||0, this.properties.Color.get(e)[1]||0, this.properties.Color.get(e)[2]||0);
    u.Opacity.value = this.properties.Opacity.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
