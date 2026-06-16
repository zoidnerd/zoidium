// Motion Tile (AlipFX) - Zoidium custom effect
// Source: Motion Tile (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/motion-tile.glsl

(this.defaultName = "Motion Tile"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Tile the image in a grid with phase and mirror.",
  }),
  (this.shaderfile = "preset/motion-tile"),
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
    Tile_Center: { dynamic: !0, name: "Tile Center", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Tile_Width: { dynamic: !0, name: "Tile Width", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Tile_Height: { dynamic: !0, name: "Tile Height", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Output_Width: { dynamic: !0, name: "Output Width", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Output_Height: { dynamic: !0, name: "Output Height", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Mirror_Edges: { dynamic: !0, name: "Mirror Edges", type: PZ.property.type.OPTION, value: 1, step: 1, items: "Off;On" },
    Phase: { dynamic: !0, name: "Phase", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Horizontal_Phase_Shift: { dynamic: !0, name: "Phase Shift", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Vertical;Horizontal" },
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
        Tile_Center: { type: "v2", value: new THREE.Vector2(0, 0) },
        Tile_Width: { type: "f", value: 100 },
        Tile_Height: { type: "f", value: 100 },
        Output_Width: { type: "f", value: 100 },
        Output_Height: { type: "f", value: 100 },
        Mirror_Edges: { type: "f", value: 1 },
        Phase: { type: "f", value: 0 },
        Horizontal_Phase_Shift: { type: "f", value: 0 },
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
    const _Tile_Center = this.properties.Tile_Center.get(e); u.Tile_Center.value.set(_Tile_Center[0]||0, _Tile_Center[1]||0);
    u.Tile_Width.value = this.properties.Tile_Width.get(e);
    u.Tile_Height.value = this.properties.Tile_Height.get(e);
    u.Output_Width.value = this.properties.Output_Width.get(e);
    u.Output_Height.value = this.properties.Output_Height.get(e);
    u.Mirror_Edges.value = this.properties.Mirror_Edges.get(e);
    u.Phase.value = this.properties.Phase.get(e);
    u.Horizontal_Phase_Shift.value = this.properties.Horizontal_Phase_Shift.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
