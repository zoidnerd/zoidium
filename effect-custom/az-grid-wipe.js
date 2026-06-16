// AZ Grid Wipe (AlipFX) - Zoidium custom effect
// Source: AZ Grid Wipe (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-grid-wipe.glsl

(this.defaultName = "AZ Grid Wipe"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Tile-grid wipe transition with shape options.",
  }),
  (this.shaderfile = "preset/az-grid-wipe"),
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
    Center: { dynamic: !0, name: "Center", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Rotation: { dynamic: !0, name: "Rotation", type: PZ.property.type.NUMBER, value: 90, step: 0.1 },
    Borders: { dynamic: !0, name: "Borders", type: PZ.property.type.NUMBER, value: 80, step: 0.1 },
    Tiles: { dynamic: !0, name: "Tiles", type: PZ.property.type.NUMBER, value: 10, step: 0.1 },
    Shape: { dynamic: !0, name: "Shape", type: PZ.property.type.OPTION, value: 1, items: "Doors;Radial;Rect" },
    Reverse_Transition: { dynamic: !0, name: "Reverse Transition", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
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
        Center: { type: "v2", value: new THREE.Vector2(0, 0) },
        Rotation: { type: "f", value: 90 },
        Borders: { type: "f", value: 80 },
        Tiles: { type: "f", value: 10 },
        Shape: { type: "f", value: 1 },
        Reverse_Transition: { type: "f", value: 0 },
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
    const _Center = this.properties.Center.get(e); u.Center.value.set(_Center[0]||0, _Center[1]||0);
    u.Rotation.value = this.properties.Rotation.get(e);
    u.Borders.value = this.properties.Borders.get(e);
    u.Tiles.value = this.properties.Tiles.get(e);
    u.Shape.value = this.properties.Shape.get(e);
    u.Reverse_Transition.value = this.properties.Reverse_Transition.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
