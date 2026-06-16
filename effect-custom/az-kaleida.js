// AZ Kaleida (AlipFX) - Zoidium custom effect
// Source: AZ Kaleida (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-kaleida.glsl

(this.defaultName = "AZ Kaleida"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Mirrors and folds the image into kaleidoscopic patterns.",
  }),
  (this.shaderfile = "preset/az-kaleida"),
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
    Center: { dynamic: !0, name: "Center", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Size: { dynamic: !0, name: "Size", type: PZ.property.type.NUMBER, value: 200, step: 0.1 },
    Mirroring: { dynamic: !0, name: "Mirroring", type: PZ.property.type.OPTION, value: 5, items: "Triangle;Wheel;Fish;Fish 90;Flip Flop;Flower;Diamond;Flipper;Starlish" },
    Rotation: { dynamic: !0, name: "Rotation", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Floating_Center: { dynamic: !0, name: "Floating Center", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
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
        Center: { type: "v2", value: new THREE.Vector2(0, 0) },
        Size: { type: "f", value: 200 },
        Mirroring: { type: "f", value: 5 },
        Rotation: { type: "f", value: 0 },
        Floating_Center: { type: "f", value: 0 },
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
    const _Center = this.properties.Center.get(e); u.Center.value.set(_Center[0]||0, _Center[1]||0);
    u.Size.value = this.properties.Size.get(e);
    u.Mirroring.value = this.properties.Mirroring.get(e);
    u.Rotation.value = this.properties.Rotation.get(e);
    u.Floating_Center.value = this.properties.Floating_Center.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
