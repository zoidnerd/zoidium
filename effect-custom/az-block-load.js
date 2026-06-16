// AZ Block Load (AlipFX) - Zoidium custom effect
// Source: AZ Block Load (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-block-load.glsl

(this.defaultName = "AZ Block Load"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Top-down loading wipe with halving-resolution blocks.",
  }),
  (this.shaderfile = "preset/az-block-load"),
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
    Completion: { dynamic: !0, name: "Completion", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Scans: { dynamic: !0, name: "Scans", type: PZ.property.type.NUMBER, value: 4, step: 0.1 },
    Start_Cleared: { dynamic: !0, name: "Start Cleared", type: PZ.property.type.OPTION, value: 1, step: 1, items: "Off;On" },
    Bilinear: { dynamic: !0, name: "Bilinear", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Off;On" },
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
        Completion: { type: "f", value: 0 },
        Scans: { type: "f", value: 4 },
        Start_Cleared: { type: "f", value: 1 },
        Bilinear: { type: "f", value: 0 },
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
    u.Completion.value = this.properties.Completion.get(e);
    u.Scans.value = this.properties.Scans.get(e);
    u.Start_Cleared.value = this.properties.Start_Cleared.get(e);
    u.Bilinear.value = this.properties.Bilinear.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
