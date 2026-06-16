// After Effects Mirror (AlipFX) - Zoidium custom effect
// Source: AE Mirror (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/after-effects-mirror.glsl

(this.defaultName = "After Effects Mirror"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Mirrors the image across a reflected line by center and angle.",
  }),
  (this.shaderfile = "preset/after-effects-mirror"),
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
    reflectionCenter: { dynamic: !0, name: "reflectionCenter", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    reflectionAngle: { dynamic: !0, name: "reflectionAngle", type: PZ.property.type.NUMBER, value: 180, step: 0.1 },
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
        reflectionCenter: { type: "v2", value: new THREE.Vector2(0, 0) },
        reflectionAngle: { type: "f", value: 180 },
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
    const _reflectionCenter = this.properties.reflectionCenter.get(e); u.reflectionCenter.value.set(_reflectionCenter[0]||0, _reflectionCenter[1]||0);
    u.reflectionAngle.value = this.properties.reflectionAngle.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
