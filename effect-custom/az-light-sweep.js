// AZ Light Sweep (AlipFX) - Zoidium custom effect
// Source: AZ Light Sweep (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-light-sweep.glsl

(this.defaultName = "AZ Light Sweep"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Sweeps a directional light band across the image.",
  }),
  (this.shaderfile = "preset/az-light-sweep"),
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
    Direction: { dynamic: !0, name: "Direction", type: PZ.property.type.NUMBER, value: -30, step: 0.1 },
    Shapes: { dynamic: !0, name: "Shapes", type: PZ.property.type.OPTION, value: 1, step: 1, items: "Linear;Smooth;Sharp" },
    Width: { dynamic: !0, name: "Width", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Sweep_Intensity: { dynamic: !0, name: "Sweep Intensity", type: PZ.property.type.NUMBER, value: 25, step: 0.1 },
    Edge_Intensity: { dynamic: !0, name: "Edge Intensity", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Edge_Thickness: { dynamic: !0, name: "Edge Thickness", type: PZ.property.type.NUMBER, value: 4, step: 0.1 },
    Light_Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
    Light_Reception: { dynamic: !0, name: "Light Reception", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
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
        Direction: { type: "f", value: -30 },
        Shapes: { type: "f", value: 1 },
        Width: { type: "f", value: 50 },
        Sweep_Intensity: { type: "f", value: 25 },
        Edge_Intensity: { type: "f", value: 50 },
        Edge_Thickness: { type: "f", value: 4 },
        Light_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        Light_Reception: { type: "f", value: 0 },
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
    u.Direction.value = this.properties.Direction.get(e);
    u.Shapes.value = this.properties.Shapes.get(e);
    u.Width.value = this.properties.Width.get(e);
    u.Sweep_Intensity.value = this.properties.Sweep_Intensity.get(e);
    u.Edge_Intensity.value = this.properties.Edge_Intensity.get(e);
    u.Edge_Thickness.value = this.properties.Edge_Thickness.get(e);
    u.Light_Color.value.set(this.properties.Light_Color.get(e)[0]||0, this.properties.Light_Color.get(e)[1]||0, this.properties.Light_Color.get(e)[2]||0);
    u.Light_Reception.value = this.properties.Light_Reception.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
