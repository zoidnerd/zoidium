// AZ Line Sweep (AlipFX) - Zoidium custom effect
// Source: AZ Line Sweep (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-line-sweep.glsl

(this.defaultName = "AZ Line Sweep"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Slanted line sweep wipe transition.",
  }),
  (this.shaderfile = "preset/az-line-sweep"),
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
    Completion: { dynamic: !0, name: "Completion", type: PZ.property.type.NUMBER, value: -2.7, step: 0.1 },
    Direction: { dynamic: !0, name: "Direction", type: PZ.property.type.NUMBER, value: 90, step: 0.1 },
    Thickness: { dynamic: !0, name: "Thickness", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Slant: { dynamic: !0, name: "Slant", type: PZ.property.type.NUMBER, value: 200, step: 0.1 },
    Flip_Direction: { dynamic: !0, name: "Flip Direction", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
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
        Completion: { type: "f", value: -2.7 },
        Direction: { type: "f", value: 90 },
        Thickness: { type: "f", value: 50 },
        Slant: { type: "f", value: 200 },
        Flip_Direction: { type: "f", value: 0 },
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
    u.Direction.value = this.properties.Direction.get(e);
    u.Thickness.value = this.properties.Thickness.get(e);
    u.Slant.value = this.properties.Slant.get(e);
    u.Flip_Direction.value = this.properties.Flip_Direction.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
