// Mt's PixelSorter (AlipFX) - Zoidium custom effect
// Source: Mt's PixelSorter (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/mts-pixelsorter.glsl

(this.defaultName = "Mt's PixelSorter"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Sorts pixels along axis by brightness or hue.",
  }),
  (this.shaderfile = "preset/mts-pixelsorter"),
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
    Mode: { dynamic: !0, name: "Mode", type: PZ.property.type.OPTION, value: 0, items: "Brightness;Saturation;Hue;RGB" },
    Direction: { dynamic: !0, name: "Direction", type: PZ.property.type.OPTION, value: 0, items: "Left->Right;Right->Left;Top->Bottom;Bottom->Top" },
    Threshold: { dynamic: !0, name: "Threshold", type: PZ.property.type.NUMBER, value: 255, step: 0.1 },
    Conditional_Sort: { dynamic: !0, name: "Conditional Sort", type: PZ.property.type.OPTION, value: 1, items: "Disabled (Displacement);Enabled (True Sort)" },
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
        Mode: { type: "f", value: 0 },
        Direction: { type: "f", value: 0 },
        Threshold: { type: "f", value: 255 },
        Conditional_Sort: { type: "f", value: 1 },
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
    u.Mode.value = this.properties.Mode.get(e);
    u.Direction.value = this.properties.Direction.get(e);
    u.Threshold.value = this.properties.Threshold.get(e);
    u.Conditional_Sort.value = this.properties.Conditional_Sort.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
