// AZ Light Wipe (AlipFX) - Zoidium custom effect
// Source: AZ Light Wipe (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-light-wipe.glsl

(this.defaultName = "AZ Light Wipe"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Glowing wipe transition with ray spikes.",
  }),
  (this.shaderfile = "preset/az-light-wipe"),
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
    Completion: { dynamic: !0, name: "Completion", type: PZ.property.type.NUMBER, value: 20.9, step: 0.1 },
    Center: { dynamic: !0, name: "Center", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Intensity: { dynamic: !0, name: "Intensity", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Shape: { dynamic: !0, name: "Shape", type: PZ.property.type.OPTION, value: 0, items: "Doors;Radial;Square" },
    Direction: { dynamic: !0, name: "Direction", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Color_From_Source: { dynamic: !0, name: "Color From Source", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
    Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
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
        Completion: { type: "f", value: 20.9 },
        Center: { type: "v2", value: new THREE.Vector2(0, 0) },
        Intensity: { type: "f", value: 50 },
        Shape: { type: "f", value: 0 },
        Direction: { type: "f", value: 0 },
        Color_From_Source: { type: "f", value: 0 },
        Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
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
    u.Intensity.value = this.properties.Intensity.get(e);
    u.Shape.value = this.properties.Shape.get(e);
    u.Direction.value = this.properties.Direction.get(e);
    u.Color_From_Source.value = this.properties.Color_From_Source.get(e);
    u.Color.value.set(this.properties.Color.get(e)[0]||0, this.properties.Color.get(e)[1]||0, this.properties.Color.get(e)[2]||0);
    u.Reverse_Transition.value = this.properties.Reverse_Transition.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
