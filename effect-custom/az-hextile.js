// AZ HexTile (AlipFX) - Zoidium custom effect
// Source: AZ HexTile (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-hextile.glsl

(this.defaultName = "AZ HexTile"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Hex tile with aligned or seamless fold modes.",
  }),
  (this.shaderfile = "preset/az-hextile"),
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
    Render: { dynamic: !0, name: "Render", type: PZ.property.type.OPTION, value: 0, items: "Raw;Aligned;Seamless" },
    Radius: { dynamic: !0, name: "Radius", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Center: { dynamic: !0, name: "Center", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Lock_Center_Tile: { dynamic: !0, name: "Lock Center Tile", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Rotate: { dynamic: !0, name: "Rotate", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Smearing: { dynamic: !0, name: "Smearing", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
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
        Render: { type: "f", value: 0 },
        Radius: { type: "f", value: 50 },
        Center: { type: "v2", value: new THREE.Vector2(0, 0) },
        Lock_Center_Tile: { type: "f", value: 0 },
        Rotate: { type: "f", value: 0 },
        Smearing: { type: "f", value: 0 },
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
    u.Render.value = this.properties.Render.get(e);
    u.Radius.value = this.properties.Radius.get(e);
    const _Center = this.properties.Center.get(e); u.Center.value.set(_Center[0]||0, _Center[1]||0);
    u.Lock_Center_Tile.value = this.properties.Lock_Center_Tile.get(e);
    u.Rotate.value = this.properties.Rotate.get(e);
    u.Smearing.value = this.properties.Smearing.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
