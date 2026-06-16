// AZ Threads (AlipFX) - Zoidium custom effect
// Source: AZ Threads (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-threads.glsl

(this.defaultName = "AZ Threads"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Woven thread/basket-weave pattern with texture.",
  }),
  (this.shaderfile = "preset/az-threads"),
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
    Width: { dynamic: !0, name: "Width", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Height: { dynamic: !0, name: "Height", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Overlaps: { dynamic: !0, name: "Overlaps", type: PZ.property.type.NUMBER, value: 3, step: 0.1 },
    Direction: { dynamic: !0, name: "Direction", type: PZ.property.type.NUMBER, value: 45, step: 0.1 },
    Center: { dynamic: !0, name: "Center", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Coverage: { dynamic: !0, name: "Coverage", type: PZ.property.type.NUMBER, value: 70, step: 0.1 },
    Shadowing: { dynamic: !0, name: "Shadowing", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Texture: { dynamic: !0, name: "Texture", type: PZ.property.type.NUMBER, value: 15, step: 0.1 },
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
        Width: { type: "f", value: 50 },
        Height: { type: "f", value: 50 },
        Overlaps: { type: "f", value: 3 },
        Direction: { type: "f", value: 45 },
        Center: { type: "v2", value: new THREE.Vector2(0, 0) },
        Coverage: { type: "f", value: 70 },
        Shadowing: { type: "f", value: 50 },
        Texture: { type: "f", value: 15 },
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
    u.Width.value = this.properties.Width.get(e);
    u.Height.value = this.properties.Height.get(e);
    u.Overlaps.value = this.properties.Overlaps.get(e);
    u.Direction.value = this.properties.Direction.get(e);
    const _Center = this.properties.Center.get(e); u.Center.value.set(_Center[0]||0, _Center[1]||0);
    u.Coverage.value = this.properties.Coverage.get(e);
    u.Shadowing.value = this.properties.Shadowing.get(e);
    u.Texture.value = this.properties.Texture.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
