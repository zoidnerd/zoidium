// AZ Cylinder (AlipFX) - Zoidium custom effect
// Source: AZ Cylinder (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-cylinder.glsl

(this.defaultName = "AZ Cylinder"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Wraps the image onto a 3D cylinder surface.",
  }),
  (this.shaderfile = "preset/az-cylinder"),
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
    Radius_percent: { dynamic: !0, name: "Radius percent", type: PZ.property.type.NUMBER, value: 60, step: 0.1 },
    Position_X: { dynamic: !0, name: "Position X", type: PZ.property.type.NUMBER, value: 960, step: 0.1 },
    Position_Y: { dynamic: !0, name: "Position Y", type: PZ.property.type.NUMBER, value: 540, step: 0.1 },
    Position_Z: { dynamic: !0, name: "Position Z", type: PZ.property.type.NUMBER, value: -100, step: 0.1 },
    Rotation_Order_f: { dynamic: !0, name: "Rotation Order f", type: PZ.property.type.OPTION, value: 0, items: "ZYX;YZX;ZXY;XZY;YXZ;XYZ" },
    Render_Mode_f: { dynamic: !0, name: "Render Mode f", type: PZ.property.type.OPTION, value: 0, items: "Full;Outside;Inside" },
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
        Radius_percent: { type: "f", value: 60 },
        Position_X: { type: "f", value: 960 },
        Position_Y: { type: "f", value: 540 },
        Position_Z: { type: "f", value: -100 },
        Rotation_Order_f: { type: "f", value: 0 },
        Render_Mode_f: { type: "f", value: 0 },
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
    u.Radius_percent.value = this.properties.Radius_percent.get(e);
    u.Position_X.value = this.properties.Position_X.get(e);
    u.Position_Y.value = this.properties.Position_Y.get(e);
    u.Position_Z.value = this.properties.Position_Z.get(e);
    u.Rotation_Order_f.value = this.properties.Rotation_Order_f.get(e);
    u.Render_Mode_f.value = this.properties.Render_Mode_f.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
