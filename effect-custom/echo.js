// Echo (AlipFX) - Zoidium custom effect
// Source: Echo By AlipFX (Static).txt
// Reference shader: assets/shaders/fragment/preset/echo.glsl

(this.defaultName = "Echo"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Stacks offset image echoes with blend mode and decay.",
  }),
  (this.shaderfile = "preset/echo"),
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
    echoTime: { dynamic: !0, name: "echoTime", type: PZ.property.type.NUMBER, value: -0.33, step: 0.1 },
    numEchoes: { dynamic: !0, name: "numEchoes", type: PZ.property.type.NUMBER, value: 2, step: 1 },
    startIntensity: { dynamic: !0, name: "startIntensity", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    decay: { dynamic: !0, name: "decay", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    echoOperator: { dynamic: !0, name: "echoOperator", type: PZ.property.type.OPTION, value: 1, step: 1, items: "Add;Max;Min;Screen;Replace;Original;Mix" },
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
        echoTime: { type: "f", value: -0.33 },
        numEchoes: { type: "i", value: 2 },
        startIntensity: { type: "f", value: 1 },
        decay: { type: "f", value: 1 },
        echoOperator: { type: "i", value: 1 },
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
    u.echoTime.value = this.properties.echoTime.get(e);
    u.numEchoes.value = Math.round(this.properties.numEchoes.get(e));
    u.startIntensity.value = this.properties.startIntensity.get(e);
    u.decay.value = this.properties.decay.get(e);
    u.echoOperator.value = Math.round(this.properties.echoOperator.get(e));
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
