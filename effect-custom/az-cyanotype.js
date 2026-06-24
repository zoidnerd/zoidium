// AZ Cyanotype (AlipFX) - Zoidium custom effect
// Source: Cyanotype (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-cyanotype.glsl

(this.defaultName = "AZ Cyanotype"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Cyanotype blue-toned print effect with adjustable chemistry and exposure.",
  }),
  (this.shaderfile = "preset/az-cyanotype"),
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
    Chemistry: { dynamic: !0, name: "Chemistry", type: PZ.property.type.OPTION, value: 0, items: "Classic Prussian;Vibrant Wash;Deep Sea;Antique Botanical" },
    Effect_Strength: { dynamic: !0, name: "Effect Strength", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Exposure: { dynamic: !0, name: "Exposure", type: PZ.property.type.NUMBER, value: 0.58, step: 0.1 },
    Chemical_Contrast: { dynamic: !0, name: "Chemical Contrast", type: PZ.property.type.NUMBER, value: 0.5, step: 0.1 },
    Dye_Density: { dynamic: !0, name: "Dye Density", type: PZ.property.type.NUMBER, value: 0.62, step: 0.1 },
    Water_Stains_Fibers: { dynamic: !0, name: "Water Stains Fibers", type: PZ.property.type.NUMBER, value: 0.32, step: 0.1 },
    Pulp_Clumping: { dynamic: !0, name: "Pulp Clumping", type: PZ.property.type.NUMBER, value: 0.18, step: 0.1 },
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
        Chemistry: { type: "i", value: 0 },
        Effect_Strength: { type: "f", value: 1 },
        Exposure: { type: "f", value: 0.58 },
        Chemical_Contrast: { type: "f", value: 0.5 },
        Dye_Density: { type: "f", value: 0.62 },
        Water_Stains_Fibers: { type: "f", value: 0.32 },
        Pulp_Clumping: { type: "f", value: 0.18 },
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
        u.Chemistry.value = Math.round(this.properties.Chemistry.get(e));
        u.Effect_Strength.value = this.properties.Effect_Strength.get(e);
        u.Exposure.value = this.properties.Exposure.get(e);
        u.Chemical_Contrast.value = this.properties.Chemical_Contrast.get(e);
        u.Dye_Density.value = this.properties.Dye_Density.get(e);
        u.Water_Stains_Fibers.value = this.properties.Water_Stains_Fibers.get(e);
        u.Pulp_Clumping.value = this.properties.Pulp_Clumping.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
