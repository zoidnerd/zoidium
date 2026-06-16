// AZ Blobbylize (AlipFX) - Zoidium custom effect
// Source: AZ Blobbylize (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-blobbylize.glsl

(this.defaultName = "AZ Blobbylize"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Renders a 3D blobby relief from a chosen image channel.",
  }),
  (this.shaderfile = "preset/az-blobbylize"),
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
    Property: { dynamic: !0, name: "Property", type: PZ.property.type.OPTION, value: 5, items: "R;G;B;A;Luma;Lightness" },
    Softness: { dynamic: !0, name: "Softness", type: PZ.property.type.NUMBER, value: 20, step: 0.1 },
    CutAway: { dynamic: !0, name: "CutAway", type: PZ.property.type.NUMBER, value: 25, step: 0.1 },
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
        Property: { type: "f", value: 5 },
        Softness: { type: "f", value: 20 },
        CutAway: { type: "f", value: 25 },
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
    u.Property.value = this.properties.Property.get(e);
    u.Softness.value = this.properties.Softness.get(e);
    u.CutAway.value = this.properties.CutAway.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
