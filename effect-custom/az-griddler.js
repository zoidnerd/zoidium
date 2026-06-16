// AZ Griddler (AlipFX) - Zoidium custom effect
// Source: AZ Griddler (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-griddler.glsl

(this.defaultName = "AZ Griddler"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Creates a grid of scaled, rotated image tiles.",
  }),
  (this.shaderfile = "preset/az-griddler"),
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
    Horizontal_Scale: { dynamic: !0, name: "Horizontal Scale", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Vertical_Scale: { dynamic: !0, name: "Vertical Scale", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Tile_Size: { dynamic: !0, name: "Tile Size", type: PZ.property.type.NUMBER, value: 10, step: 0.1 },
    Rotation: { dynamic: !0, name: "Rotation", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Cut_Tiles: { dynamic: !0, name: "Cut Tiles", type: PZ.property.type.OPTION, value: 1, items: "off;on" },
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
        Horizontal_Scale: { type: "f", value: 100 },
        Vertical_Scale: { type: "f", value: 100 },
        Tile_Size: { type: "f", value: 10 },
        Rotation: { type: "f", value: 0 },
        Cut_Tiles: { type: "f", value: 1 },
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
    u.Horizontal_Scale.value = this.properties.Horizontal_Scale.get(e);
    u.Vertical_Scale.value = this.properties.Vertical_Scale.get(e);
    u.Tile_Size.value = this.properties.Tile_Size.get(e);
    u.Rotation.value = this.properties.Rotation.get(e);
    u.Cut_Tiles.value = this.properties.Cut_Tiles.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
