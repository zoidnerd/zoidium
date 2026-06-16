// Minimax (AlipFX) - Zoidium custom effect
// Source: Minimax (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/minimax.glsl

(this.defaultName = "Minimax"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Morphological min/max filter for dilation/erosion.",
  }),
  (this.shaderfile = "preset/minimax"),
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
    Operation: { dynamic: !0, name: "Operation", type: PZ.property.type.OPTION, value: 0, items: "Maximum;Minimum;Opening;Closing" },
    Radius: { dynamic: !0, name: "Radius", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Channel: { dynamic: !0, name: "Channel", type: PZ.property.type.OPTION, value: 0, items: "Color;Alpha+Color;R;G;B;Alpha" },
    Direction: { dynamic: !0, name: "Direction", type: PZ.property.type.OPTION, value: 0, items: "H&V;H only;V only" },
    Dont_Shrink_Edges: { dynamic: !0, name: "Dont Shrink Edges", type: PZ.property.type.OPTION, value: 0, items: "off;on", step: 1 },
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
        Operation: { type: "f", value: 0 },
        Radius: { type: "f", value: 0 },
        Channel: { type: "f", value: 0 },
        Direction: { type: "f", value: 0 },
        Dont_Shrink_Edges: { type: "f", value: 0 },
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
    u.Operation.value = this.properties.Operation.get(e);
    u.Radius.value = this.properties.Radius.get(e);
    u.Channel.value = this.properties.Channel.get(e);
    u.Direction.value = this.properties.Direction.get(e);
    u.Dont_Shrink_Edges.value = this.properties.Dont_Shrink_Edges.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
