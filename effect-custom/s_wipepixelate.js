// S_WipePixelate (AlipFX) - Zoidium custom effect
// Source: S_WipePixelate (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/s_wipepixelate.glsl

(this.defaultName = "S WipePixelate"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Pixelated chunky wipe with scatter along a directional axis.",
  }),
  (this.shaderfile = "preset/s_wipepixelate"),
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
    Transition_Dir: { dynamic: !0, name: "Transition Dir", type: PZ.property.type.OPTION, value: 0, items: "Wipe Off to Bg;Wipe On from Bg" },
    Auto_Trans: { dynamic: !0, name: "Auto Trans", type: PZ.property.type.OPTION, value: 0, items: "use Wipe Percent;use time" },
    Wipe_Percent: { dynamic: !0, name: "Wipe Percent", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Edge_Width: { dynamic: !0, name: "Edge Width", type: PZ.property.type.NUMBER, value: 960, step: 0.1 },
    Angle: { dynamic: !0, name: "Angle", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Pixel_Frequency: { dynamic: !0, name: "Pixel Frequency", type: PZ.property.type.NUMBER, value: 20, step: 0.1 },
    Pixel_Rel_Width: { dynamic: !0, name: "Pixel Rel Width", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Chunky: { dynamic: !0, name: "Chunky", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Seed: { dynamic: !0, name: "Seed", type: PZ.property.type.NUMBER, value: 0.23, step: 0.1 },
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
        Transition_Dir: { type: "f", value: 0 },
        Auto_Trans: { type: "f", value: 0 },
        Wipe_Percent: { type: "f", value: 0 },
        Edge_Width: { type: "f", value: 960 },
        Angle: { type: "f", value: 0 },
        Pixel_Frequency: { type: "f", value: 20 },
        Pixel_Rel_Width: { type: "f", value: 1 },
        Chunky: { type: "f", value: 0 },
        Seed: { type: "f", value: 0.23 },
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
    u.Transition_Dir.value = this.properties.Transition_Dir.get(e);
    u.Auto_Trans.value = this.properties.Auto_Trans.get(e);
    u.Wipe_Percent.value = this.properties.Wipe_Percent.get(e);
    u.Edge_Width.value = this.properties.Edge_Width.get(e);
    u.Angle.value = this.properties.Angle.get(e);
    u.Pixel_Frequency.value = this.properties.Pixel_Frequency.get(e);
    u.Pixel_Rel_Width.value = this.properties.Pixel_Rel_Width.get(e);
    u.Chunky.value = this.properties.Chunky.get(e);
    u.Seed.value = this.properties.Seed.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
