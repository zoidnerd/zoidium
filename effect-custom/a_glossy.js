// A_Glossy (AlipFX) - Zoidium custom effect
// Source: A_Glossy (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/a_glossy.glsl

(this.defaultName = "A Glossy"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Glossy edge highlight band with blend modes.",
  }),
  (this.shaderfile = "preset/a_glossy"),
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
    Global_Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Enable_4_Colors: { dynamic: !0, name: "Enable 4 Colors", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Random_Seed: { dynamic: !0, name: "Random Seed", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Fill_Color_1: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Fill_Color_2: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Fill_Color_3: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Fill_Color_4: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Angle: { dynamic: !0, name: "Angle", type: PZ.property.type.NUMBER, value: -45, step: 0.1 },
    Gap: { dynamic: !0, name: "Gap", type: PZ.property.type.NUMBER, value: 2, step: 0.1 },
    Distance: { dynamic: !0, name: "Distance", type: PZ.property.type.NUMBER, value: 10, step: 0.1 },
    Choker_1: { dynamic: !0, name: "Choker 1", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Roundness: { dynamic: !0, name: "Roundness", type: PZ.property.type.NUMBER, value: 3, step: 0.1 },
    Choker_2: { dynamic: !0, name: "Choker 2", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Softness: { dynamic: !0, name: "Softness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Opacity: { dynamic: !0, name: "Opacity", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Blend_Mode: { dynamic: !0, name: "Blend Mode", type: PZ.property.type.OPTION, value: 0, items: "Normal;Darken;Multiply;Add;Lighten;Screen;Overlay;Soft Light;Hard Light;Difference" },
    Glossy_Only: { dynamic: !0, name: "Glossy Only", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
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
        Global_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Enable_4_Colors: { type: "f", value: 0 },
        Random_Seed: { type: "f", value: 0 },
        Fill_Color_1: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Fill_Color_2: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Fill_Color_3: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Fill_Color_4: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Angle: { type: "f", value: -45 },
        Gap: { type: "f", value: 2 },
        Distance: { type: "f", value: 10 },
        Choker_1: { type: "f", value: 0 },
        Roundness: { type: "f", value: 3 },
        Choker_2: { type: "f", value: 0 },
        Softness: { type: "f", value: 0 },
        Opacity: { type: "f", value: 100 },
        Blend_Mode: { type: "f", value: 0 },
        Glossy_Only: { type: "f", value: 0 },
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
    u.Global_Color.value.set(this.properties.Global_Color.get(e)[0]||0, this.properties.Global_Color.get(e)[1]||0, this.properties.Global_Color.get(e)[2]||0);
    u.Enable_4_Colors.value = this.properties.Enable_4_Colors.get(e);
    u.Random_Seed.value = this.properties.Random_Seed.get(e);
    u.Fill_Color_1.value.set(this.properties.Fill_Color_1.get(e)[0]||0, this.properties.Fill_Color_1.get(e)[1]||0, this.properties.Fill_Color_1.get(e)[2]||0);
    u.Fill_Color_2.value.set(this.properties.Fill_Color_2.get(e)[0]||0, this.properties.Fill_Color_2.get(e)[1]||0, this.properties.Fill_Color_2.get(e)[2]||0);
    u.Fill_Color_3.value.set(this.properties.Fill_Color_3.get(e)[0]||0, this.properties.Fill_Color_3.get(e)[1]||0, this.properties.Fill_Color_3.get(e)[2]||0);
    u.Fill_Color_4.value.set(this.properties.Fill_Color_4.get(e)[0]||0, this.properties.Fill_Color_4.get(e)[1]||0, this.properties.Fill_Color_4.get(e)[2]||0);
    u.Angle.value = this.properties.Angle.get(e);
    u.Gap.value = this.properties.Gap.get(e);
    u.Distance.value = this.properties.Distance.get(e);
    u.Choker_1.value = this.properties.Choker_1.get(e);
    u.Roundness.value = this.properties.Roundness.get(e);
    u.Choker_2.value = this.properties.Choker_2.get(e);
    u.Softness.value = this.properties.Softness.get(e);
    u.Opacity.value = this.properties.Opacity.get(e);
    u.Blend_Mode.value = this.properties.Blend_Mode.get(e);
    u.Glossy_Only.value = this.properties.Glossy_Only.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
