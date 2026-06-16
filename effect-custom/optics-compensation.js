// Optics Compensation (AlipFX) - Zoidium custom effect
// Source: Optics Compensation (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/optics-compensation.glsl

(this.defaultName = "Optics Compensation"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Lens distortion correction with FOV-based unwarping.",
  }),
  (this.shaderfile = "preset/optics-compensation"),
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
    Field_Of_View: { dynamic: !0, name: "Field Of View", type: PZ.property.type.NUMBER, value: 38, step: 0.1 },
    Reverse_Lens_Distortion: { dynamic: !0, name: "Reverse Lens Distortion", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Apply;Reverse" },
    FOV_Orientation: { dynamic: !0, name: "FOV Orientation", type: PZ.property.type.OPTION, value: 1, items: "Horizontal;Vertical;Diagonal" },
    View_Center: { dynamic: !0, name: "View Center", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Optimal_Pixels: { dynamic: !0, name: "Optimal Pixels", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Off;On" },
    Resize: { dynamic: !0, name: "Resize", type: PZ.property.type.OPTION, value: 0, items: "Off;Max2X;Max4X;Unlimited" },
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
        Field_Of_View: { type: "f", value: 38 },
        Reverse_Lens_Distortion: { type: "f", value: 0 },
        FOV_Orientation: { type: "f", value: 1 },
        View_Center: { type: "v2", value: new THREE.Vector2(0, 0) },
        Optimal_Pixels: { type: "f", value: 0 },
        Resize: { type: "f", value: 0 },
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
    u.Field_Of_View.value = this.properties.Field_Of_View.get(e);
    u.Reverse_Lens_Distortion.value = this.properties.Reverse_Lens_Distortion.get(e);
    u.FOV_Orientation.value = this.properties.FOV_Orientation.get(e);
    const _View_Center = this.properties.View_Center.get(e); u.View_Center.value.set(_View_Center[0]||0, _View_Center[1]||0);
    u.Optimal_Pixels.value = this.properties.Optimal_Pixels.get(e);
    u.Resize.value = this.properties.Resize.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
