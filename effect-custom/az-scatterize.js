// AZ Scatterize (AlipFX) - Zoidium custom effect
// Source: AZ Scatterize (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-scatterize.glsl

(this.defaultName = "AZ Scatterize"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Twist and scatter pixels with transfer blend mode.",
  }),
  (this.shaderfile = "preset/az-scatterize"),
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
    Scatter: { dynamic: !0, name: "Scatter", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Right_Twist: { dynamic: !0, name: "Right Twist", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Left_Twist: { dynamic: !0, name: "Left Twist", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Transfer_Mode: { dynamic: !0, name: "Transfer Mode", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Replace;Screen;Add;Add + Alpha" },
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
        Scatter: { type: "f", value: 0 },
        Right_Twist: { type: "f", value: 0 },
        Left_Twist: { type: "f", value: 0 },
        Transfer_Mode: { type: "f", value: 0 },
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
    u.Scatter.value = this.properties.Scatter.get(e);
    u.Right_Twist.value = this.properties.Right_Twist.get(e);
    u.Left_Twist.value = this.properties.Left_Twist.get(e);
    u.Transfer_Mode.value = this.properties.Transfer_Mode.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
