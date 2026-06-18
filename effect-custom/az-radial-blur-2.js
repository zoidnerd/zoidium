// Radial Blur (AlipFX) - Zoidium custom effect
// Source: Radial Blur (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/radial-blur.glsl

(this.defaultName = "AZ Radial Blur 2"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Radial zoom or spin blur from a center point.",
  }),
  (this.shaderfile = "preset/az-radial-blur-2"),
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
    Amount: { dynamic: !0, name: "Amount", type: PZ.property.type.NUMBER, value: 20, step: 0.1 },
    Center: { dynamic: !0, name: "Center", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Type: { dynamic: !0, name: "Type", type: PZ.property.type.OPTION, value: 1, items: "Spin;Zoom" },
    Antialiasing: { dynamic: !0, name: "Antialiasing", type: PZ.property.type.OPTION, value: 1, items: "Low (16);High (64)" },
    Random_Seed: { dynamic: !0, name: "Random Seed", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
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
        Amount: { type: "f", value: 20 },
        Center: { type: "v2", value: new THREE.Vector2(0, 0) },
        Type: { type: "f", value: 1 },
        Antialiasing: { type: "f", value: 1 },
        Random_Seed: { type: "f", value: 0 },
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
    u.Amount.value = this.properties.Amount.get(e);
    const _Center = this.properties.Center.get(e); u.Center.value.set(_Center[0]||0, _Center[1]||0);
    u.Type.value = this.properties.Type.get(e);
    u.Antialiasing.value = this.properties.Antialiasing.get(e);
    u.Random_Seed.value = this.properties.Random_Seed.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
