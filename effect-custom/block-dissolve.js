// Block Dissolve (AlipFX) - Zoidium custom effect
// Source: Block Dissolve (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/block-dissolve.glsl

(this.defaultName = "Block Dissolve"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Dissolves the image in random rectangular blocks.",
  }),
  (this.shaderfile = "preset/block-dissolve"),
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
    Block_Width: { dynamic: !0, name: "Block Width", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Block_Height: { dynamic: !0, name: "Block Height", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Feather: { dynamic: !0, name: "Feather", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Soft_Edges: { dynamic: !0, name: "Soft Edges", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
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
        Block_Width: { type: "f", value: 0 },
        Block_Height: { type: "f", value: 0 },
        Feather: { type: "f", value: 0 },
        Soft_Edges: { type: "f", value: 0 },
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
    u.Block_Width.value = this.properties.Block_Width.get(e);
    u.Block_Height.value = this.properties.Block_Height.get(e);
    u.Feather.value = this.properties.Feather.get(e);
    u.Soft_Edges.value = this.properties.Soft_Edges.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
