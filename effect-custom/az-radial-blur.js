// AZ Radial Blur (AlipFX) - Zoidium custom effect
// Source: AZ Radial Blur (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-radial-blur.glsl

(this.defaultName = "AZ Radial Blur"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Applies a zoom or spin blur radiating from a center.",
  }),
  (this.shaderfile = "preset/az-radial-blur"),
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
    Type: { dynamic: !0, name: "Type", type: PZ.property.type.OPTION, value: 5, items: "Zoom;Zoom Fade;Zoom Both;Spin;Spin Both;Spin Fade" },
    Amount: { dynamic: !0, name: "Amount", type: PZ.property.type.NUMBER, value: 155.6, step: 0.1 },
    Quality: { dynamic: !0, name: "Quality", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Center: { dynamic: !0, name: "Center", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
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
        Type: { type: "f", value: 5 },
        Amount: { type: "f", value: 155.6 },
        Quality: { type: "f", value: 50 },
        Center: { type: "v2", value: new THREE.Vector2(0, 0) },
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
    u.Type.value = this.properties.Type.get(e);
    u.Amount.value = this.properties.Amount.get(e);
    u.Quality.value = this.properties.Quality.get(e);
    const _Center = this.properties.Center.get(e); u.Center.value.set(_Center[0]||0, _Center[1]||0);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
