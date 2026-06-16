// AZ Split (AlipFX) - Zoidium custom effect
// Source: AZ Split (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-split.glsl

(this.defaultName = "AZ Split"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Slit split between two points with curved gap.",
  }),
  (this.shaderfile = "preset/az-split"),
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
    Point_A: { dynamic: !0, name: "Point A", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Point_B: { dynamic: !0, name: "Point B", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Split: { dynamic: !0, name: "Split", type: PZ.property.type.NUMBER, value: 257.6, step: 0.1 },
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
        Point_A: { type: "v2", value: new THREE.Vector2(0, 0) },
        Point_B: { type: "v2", value: new THREE.Vector2(0, 0) },
        Split: { type: "f", value: 257.6 },
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
    const _Point_A = this.properties.Point_A.get(e); u.Point_A.value.set(_Point_A[0]||0, _Point_A[1]||0);
    const _Point_B = this.properties.Point_B.get(e); u.Point_B.value.set(_Point_B[0]||0, _Point_B[1]||0);
    u.Split.value = this.properties.Split.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
