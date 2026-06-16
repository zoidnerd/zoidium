// Iris Wipe (AlipFX) - Zoidium custom effect
// Source: Iris Wipe V2 (AlipFX) (sharp version).txt
// Reference shader: assets/shaders/fragment/preset/iris-wipe-2.glsl

(this.defaultName = "Iris Wipe"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Polygonal iris/star wipe with rotation and feather.",
  }),
  (this.shaderfile = "preset/iris-wipe-2"),
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
    Iris_Center: { dynamic: !0, name: "Iris Center", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Iris_Points: { dynamic: !0, name: "Iris Points", type: PZ.property.type.NUMBER, value: 9, step: 0.1 },
    Outer_Radius: { dynamic: !0, name: "Outer Radius", type: PZ.property.type.NUMBER, value: 0.37, step: 0.1 },
    Use_Inner_Radius: { dynamic: !0, name: "Use Inner Radius", type: PZ.property.type.OPTION, value: 1, step: 1, items: "Off;On" },
    Inner_Radius: { dynamic: !0, name: "Inner Radius", type: PZ.property.type.NUMBER, value: 0.5, step: 0.1 },
    Rotation: { dynamic: !0, name: "Rotation", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Feather: { dynamic: !0, name: "Feather", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
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
        Iris_Center: { type: "v2", value: new THREE.Vector2(0, 0) },
        Iris_Points: { type: "f", value: 9 },
        Outer_Radius: { type: "f", value: 0.37 },
        Use_Inner_Radius: { type: "i", value: 1 },
        Inner_Radius: { type: "f", value: 0.5 },
        Rotation: { type: "f", value: 0 },
        Feather: { type: "f", value: 0 },
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
    const _Iris_Center = this.properties.Iris_Center.get(e); u.Iris_Center.value.set(_Iris_Center[0]||0, _Iris_Center[1]||0);
    u.Iris_Points.value = this.properties.Iris_Points.get(e);
    u.Outer_Radius.value = this.properties.Outer_Radius.get(e);
    u.Use_Inner_Radius.value = Math.round(this.properties.Use_Inner_Radius.get(e));
    u.Inner_Radius.value = this.properties.Inner_Radius.get(e);
    u.Rotation.value = this.properties.Rotation.get(e);
    u.Feather.value = this.properties.Feather.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
