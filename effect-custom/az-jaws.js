// AZ Jaws (AlipFX) - Zoidium custom effect
// Source: AZ Jaws (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-jaws.glsl

(this.defaultName = "AZ Jaws"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Jaws wipe with triangle, square, or sine shape.",
  }),
  (this.shaderfile = "preset/az-jaws"),
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
    Completion: { dynamic: !0, name: "Completion", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Center: { dynamic: !0, name: "Center", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Direction: { dynamic: !0, name: "Direction", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Height: { dynamic: !0, name: "Height", type: PZ.property.type.NUMBER, value: 10, step: 0.1 },
    Width: { dynamic: !0, name: "Width", type: PZ.property.type.NUMBER, value: 10, step: 0.1 },
    Shape: { dynamic: !0, name: "Shape", type: PZ.property.type.OPTION, value: 0, items: "Triangle;Flat;Square;Sine" },
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
        Completion: { type: "f", value: 0 },
        Center: { type: "v2", value: new THREE.Vector2(0, 0) },
        Direction: { type: "f", value: 0 },
        Height: { type: "f", value: 10 },
        Width: { type: "f", value: 10 },
        Shape: { type: "f", value: 0 },
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
    u.Direction.value = this.properties.Direction.get(e);
    u.Height.value = this.properties.Height.get(e);
    u.Width.value = this.properties.Width.get(e);
    u.Shape.value = this.properties.Shape.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
