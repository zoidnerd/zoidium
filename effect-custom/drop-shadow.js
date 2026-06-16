// Drop Shadow (AlipFX) - Zoidium custom effect
// Source: Drop Shadow (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/drop-shadow.glsl

(this.defaultName = "Drop Shadow"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Adds a directional soft drop shadow behind the image.",
  }),
  (this.shaderfile = "preset/drop-shadow"),
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
    Shadow_Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Opacity: { dynamic: !0, name: "Opacity", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Direction: { dynamic: !0, name: "Direction", type: PZ.property.type.NUMBER, value: 135, step: 0.1 },
    Distance: { dynamic: !0, name: "Distance", type: PZ.property.type.NUMBER, value: 5, step: 0.1 },
    Softness: { dynamic: !0, name: "Softness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Shadow_Only: { dynamic: !0, name: "Shadow Only", type: PZ.property.type.OPTION, value: 0, step: 1, items: "off;on" },
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
        Shadow_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Opacity: { type: "f", value: 50 },
        Direction: { type: "f", value: 135 },
        Distance: { type: "f", value: 5 },
        Softness: { type: "f", value: 0 },
        Shadow_Only: { type: "f", value: 0 },
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
    u.Shadow_Color.value.set(this.properties.Shadow_Color.get(e)[0]||0, this.properties.Shadow_Color.get(e)[1]||0, this.properties.Shadow_Color.get(e)[2]||0);
    u.Opacity.value = this.properties.Opacity.get(e);
    u.Direction.value = this.properties.Direction.get(e);
    u.Distance.value = this.properties.Distance.get(e);
    u.Softness.value = this.properties.Softness.get(e);
    u.Shadow_Only.value = this.properties.Shadow_Only.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
