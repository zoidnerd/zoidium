// AZ Clay (AlipFX) - Zoidium custom effect
// Source: Clay (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-clay.glsl

(this.defaultName = "AZ Clay"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Clay-like shading effect with sculpted highlight and shadow.",
  }),
  (this.shaderfile = "preset/az-clay"),
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
    Color_Steps: { dynamic: !0, name: "Color Steps", type: PZ.property.type.NUMBER, value: 30, step: 0.1 },
    Clay_Depth: { dynamic: !0, name: "Clay Depth", type: PZ.property.type.NUMBER, value: 3, step: 0.1 },
    Texture_Scale: { dynamic: !0, name: "Texture Scale", type: PZ.property.type.NUMBER, value: 30, step: 0.1 },
    Texture_Strength: { dynamic: !0, name: "Texture Strength", type: PZ.property.type.NUMBER, value: 0.1, step: 0.1 },
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
        Color_Steps: { type: "f", value: 30 },
        Clay_Depth: { type: "f", value: 3 },
        Texture_Scale: { type: "f", value: 30 },
        Texture_Strength: { type: "f", value: 0.1 },
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
        u.Color_Steps.value = this.properties.Color_Steps.get(e);
        u.Clay_Depth.value = this.properties.Clay_Depth.get(e);
        u.Texture_Scale.value = this.properties.Texture_Scale.get(e);
        u.Texture_Strength.value = this.properties.Texture_Strength.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
