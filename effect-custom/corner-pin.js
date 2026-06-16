// Corner Pin (AlipFX) - Zoidium custom effect
// Source: Corner Pin (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/corner-pin.glsl

(this.defaultName = "Corner Pin"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Bends and remaps the image through four corner pins.",
  }),
  (this.shaderfile = "preset/corner-pin"),
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
    Upper_Left: { dynamic: !0, name: "Upper Left", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Upper_Right: { dynamic: !0, name: "Upper Right", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Lower_Left: { dynamic: !0, name: "Lower Left", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Lower_Right: { dynamic: !0, name: "Lower Right", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
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
        Upper_Left: { type: "v2", value: new THREE.Vector2(0, 0) },
        Upper_Right: { type: "v2", value: new THREE.Vector2(0, 0) },
        Lower_Left: { type: "v2", value: new THREE.Vector2(0, 0) },
        Lower_Right: { type: "v2", value: new THREE.Vector2(0, 0) },
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
    const _Upper_Left = this.properties.Upper_Left.get(e); u.Upper_Left.value.set(_Upper_Left[0]||0, _Upper_Left[1]||0);
    const _Upper_Right = this.properties.Upper_Right.get(e); u.Upper_Right.value.set(_Upper_Right[0]||0, _Upper_Right[1]||0);
    const _Lower_Left = this.properties.Lower_Left.get(e); u.Lower_Left.value.set(_Lower_Left[0]||0, _Lower_Left[1]||0);
    const _Lower_Right = this.properties.Lower_Right.get(e); u.Lower_Right.value.set(_Lower_Right[0]||0, _Lower_Right[1]||0);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
