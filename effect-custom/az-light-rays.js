// AZ Light Rays (AlipFX) - Zoidium custom effect
// Source: AZ Light Rays (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-light-rays.glsl

(this.defaultName = "AZ Light Rays"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Light rays radiating from a center point.",
  }),
  (this.shaderfile = "preset/az-light-rays"),
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
    Intensity: { dynamic: !0, name: "Intensity", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Center: { dynamic: !0, name: "Center", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Radius: { dynamic: !0, name: "Radius", type: PZ.property.type.NUMBER, value: 40, step: 0.1 },
    Warp_Softness: { dynamic: !0, name: "Warp Softness", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Shape: { dynamic: !0, name: "Shape", type: PZ.property.type.OPTION, value: 0, items: "Circle;Rectangle" },
    Direction: { dynamic: !0, name: "Direction", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Color_from_Source: { dynamic: !0, name: "Color from Source", type: PZ.property.type.OPTION, value: 1, items: "off;on" },
    Allow_Brightening: { dynamic: !0, name: "Allow Brightening", type: PZ.property.type.OPTION, value: 1, items: "off;on" },
    Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Transfer_Mode: { dynamic: !0, name: "Transfer Mode", type: PZ.property.type.OPTION, value: 1, items: "Replace;Add;Max;Screen" },
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
        Intensity: { type: "f", value: 100 },
        Center: { type: "v2", value: new THREE.Vector2(0, 0) },
        Radius: { type: "f", value: 40 },
        Warp_Softness: { type: "f", value: 50 },
        Shape: { type: "i", value: 0 },
        Direction: { type: "f", value: 0 },
        Color_from_Source: { type: "i", value: 1 },
        Allow_Brightening: { type: "i", value: 1 },
        Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Transfer_Mode: { type: "i", value: 1 },
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
    u.Intensity.value = this.properties.Intensity.get(e);
    const _Center = this.properties.Center.get(e); u.Center.value.set(_Center[0]||0, _Center[1]||0);
    u.Radius.value = this.properties.Radius.get(e);
    u.Warp_Softness.value = this.properties.Warp_Softness.get(e);
    u.Shape.value = Math.round(this.properties.Shape.get(e));
    u.Direction.value = this.properties.Direction.get(e);
    u.Color_from_Source.value = Math.round(this.properties.Color_from_Source.get(e));
    u.Allow_Brightening.value = Math.round(this.properties.Allow_Brightening.get(e));
    u.Color.value.set(this.properties.Color.get(e)[0]||0, this.properties.Color.get(e)[1]||0, this.properties.Color.get(e)[2]||0);
    u.Transfer_Mode.value = Math.round(this.properties.Transfer_Mode.get(e));
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
