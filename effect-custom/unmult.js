// Unmult (AlipFX) - Zoidium custom effect
// Source: Unmult (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/unmult.glsl

(this.defaultName = "Unmult"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Removes premultiplied color matting and recovers straight alpha.",
  }),
  (this.shaderfile = "preset/unmult"),
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
    Background_Color: { dynamic: !0, name: "Background Color", type: PZ.property.type.OPTION, value: 0, items: "Black;White" },
    Black_Level: { dynamic: !0, name: "Black Level", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Softness: { dynamic: !0, name: "Softness", type: PZ.property.type.NUMBER, value: 255, step: 0.1 },
    Remove_Color_Matting: { dynamic: !0, name: "Remove Color Matting", type: PZ.property.type.OPTION, value: 1, step: 1, items: "off;on" },
    Clip_HDR_Results: { dynamic: !0, name: "Clip HDR Results", type: PZ.property.type.OPTION, value: 1, step: 1, items: "off;on" },
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
        Background_Color: { type: "f", value: 0 },
        Black_Level: { type: "f", value: 0 },
        Softness: { type: "f", value: 255 },
        Remove_Color_Matting: { type: "f", value: 1 },
        Clip_HDR_Results: { type: "f", value: 1 },
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
    u.Background_Color.value = this.properties.Background_Color.get(e);
    u.Black_Level.value = this.properties.Black_Level.get(e);
    u.Softness.value = this.properties.Softness.get(e);
    u.Remove_Color_Matting.value = this.properties.Remove_Color_Matting.get(e);
    u.Clip_HDR_Results.value = this.properties.Clip_HDR_Results.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
