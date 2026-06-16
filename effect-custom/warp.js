// Warp (AlipFX) - Zoidium custom effect
// Source: Warp (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/warp.glsl

(this.defaultName = "Warp"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Image bending and bulging with many warp styles.",
  }),
  (this.shaderfile = "preset/warp"),
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
    Warp_Style: { dynamic: !0, name: "Warp Style", type: PZ.property.type.OPTION, value: 10, step: 1, items: "Arc Bulge;Bottom Arc;Top Arc;Curve Bend;Radial Scale;Bottom Taper;Top Taper;Single Wave;Double Wave;Belly Pinch;Ramp;Radial Power;Inverse Radial;Twist;Stretch" },
    Warp_Axis: { dynamic: !0, name: "Warp Axis", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Horizontal;Vertical" },
    Bend: { dynamic: !0, name: "Bend", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Horizontal_Distortion: { dynamic: !0, name: "Horizontal Distortion", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Vertical_Distortion: { dynamic: !0, name: "Vertical Distortion", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
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
        Warp_Style: { type: "f", value: 10 },
        Warp_Axis: { type: "f", value: 0 },
        Bend: { type: "f", value: 0 },
        Horizontal_Distortion: { type: "f", value: 0 },
        Vertical_Distortion: { type: "f", value: 0 },
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
    u.Warp_Style.value = this.properties.Warp_Style.get(e);
    u.Warp_Axis.value = this.properties.Warp_Axis.get(e);
    u.Bend.value = this.properties.Bend.get(e);
    u.Horizontal_Distortion.value = this.properties.Horizontal_Distortion.get(e);
    u.Vertical_Distortion.value = this.properties.Vertical_Distortion.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
