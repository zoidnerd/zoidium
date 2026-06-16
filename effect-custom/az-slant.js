// AZ Slant (AlipFX) - Zoidium custom effect
// Source: AZ Slant (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-slant.glsl

(this.defaultName = "AZ Slant"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Sheared/skewed image with floor pivot.",
  }),
  (this.shaderfile = "preset/az-slant"),
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
    Slant: { dynamic: !0, name: "Slant", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Stretching: { dynamic: !0, name: "Stretching", type: PZ.property.type.OPTION, value: 1, items: "off;on" },
    Height: { dynamic: !0, name: "Height", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Floor: { dynamic: !0, name: "Floor", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Set_Color: { dynamic: !0, name: "Set Color", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
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
        Slant: { type: "f", value: 0 },
        Stretching: { type: "f", value: 1 },
        Height: { type: "f", value: 100 },
        Floor: { type: "v2", value: new THREE.Vector2(0, 0) },
        Set_Color: { type: "f", value: 0 },
        Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
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
    u.Slant.value = this.properties.Slant.get(e);
    u.Stretching.value = this.properties.Stretching.get(e);
    u.Height.value = this.properties.Height.get(e);
    const _Floor = this.properties.Floor.get(e); u.Floor.value.set(_Floor[0]||0, _Floor[1]||0);
    u.Set_Color.value = this.properties.Set_Color.get(e);
    u.Color.value.set(this.properties.Color.get(e)[0]||0, this.properties.Color.get(e)[1]||0, this.properties.Color.get(e)[2]||0);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
