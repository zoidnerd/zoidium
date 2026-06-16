// AZ Drizzle (AlipFX) - Zoidium custom effect
// Source: AZ Drizzle (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-drizzle.glsl

(this.defaultName = "AZ Drizzle"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Animated water-drip ripples spreading across the image.",
  }),
  (this.shaderfile = "preset/az-drizzle"),
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
    time: { dynamic: !0, name: "time", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Drip_Rate: { dynamic: !0, name: "Drip Rate", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Longevity: { dynamic: !0, name: "Longevity", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Rippling: { dynamic: !0, name: "Rippling", type: PZ.property.type.NUMBER, value: 360, step: 0.1 },
    Displacement: { dynamic: !0, name: "Displacement", type: PZ.property.type.NUMBER, value: 155.2, step: 0.1 },
    Ripple_Height: { dynamic: !0, name: "Ripple Height", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Spreading: { dynamic: !0, name: "Spreading", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
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
        time: { type: "f", value: 0 },
        Drip_Rate: { type: "f", value: 1 },
        Longevity: { type: "f", value: 1 },
        Rippling: { type: "f", value: 360 },
        Displacement: { type: "f", value: 155.2 },
        Ripple_Height: { type: "f", value: 100 },
        Spreading: { type: "f", value: 100 },
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
    u.time.value = this.properties.time.get(e);
    u.Drip_Rate.value = this.properties.Drip_Rate.get(e);
    u.Longevity.value = this.properties.Longevity.get(e);
    u.Rippling.value = this.properties.Rippling.get(e);
    u.Displacement.value = this.properties.Displacement.get(e);
    u.Ripple_Height.value = this.properties.Ripple_Height.get(e);
    u.Spreading.value = this.properties.Spreading.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
