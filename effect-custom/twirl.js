// Twirl (AlipFX) - Zoidium custom effect
// Source: Twirl (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/twirl.glsl

(this.defaultName = "Twirl"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Twirls pixels around a center point within a radius.",
  }),
  (this.shaderfile = "preset/twirl"),
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
    angle: { dynamic: !0, name: "angle", type: PZ.property.type.NUMBER, value: 281.4, step: 0.1 },
    twirlRadius: { dynamic: !0, name: "twirlRadius", type: PZ.property.type.NUMBER, value: 400, step: 0.1 },
    twirlCenter: { dynamic: !0, name: "twirlCenter", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
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
        angle: { type: "f", value: 281.4 },
        twirlRadius: { type: "f", value: 400 },
        twirlCenter: { type: "v2", value: new THREE.Vector2(0, 0) },
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
    u.angle.value = this.properties.angle.get(e);
    u.twirlRadius.value = this.properties.twirlRadius.get(e);
    const _twirlCenter = this.properties.twirlCenter.get(e); u.twirlCenter.value.set(_twirlCenter[0]||0, _twirlCenter[1]||0);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
