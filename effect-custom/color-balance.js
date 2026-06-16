// Color Balance (AlipFX) - Zoidium custom effect
// Source: Color Balance (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/color-balance.glsl

(this.defaultName = "Color Balance"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Shifts color balance for shadows, midtones, and highlights.",
  }),
  (this.shaderfile = "preset/color-balance"),
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
    Shadow_Red_Balance: { dynamic: !0, name: "Shadow Red Balance", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Shadow_Green_Balance: { dynamic: !0, name: "Shadow Green Balance", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Shadow_Blue_Balance: { dynamic: !0, name: "Shadow Blue Balance", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Midtone_Red_Balance: { dynamic: !0, name: "Midtone Red Balance", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Midtone_Green_Balance: { dynamic: !0, name: "Midtone Green Balance", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Midtone_Blue_Balance: { dynamic: !0, name: "Midtone Blue Balance", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Highlight_Red_Balance: { dynamic: !0, name: "Highlight Red Balance", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Highlight_Green_Balance: { dynamic: !0, name: "Highlight Green Balance", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Highlight_Blue_Balance: { dynamic: !0, name: "Highlight Blue Balance", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Preserve_Luminosity: { dynamic: !0, name: "Preserve Luminosity", type: PZ.property.type.OPTION, value: 0, items: "off;on" },
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
        Shadow_Red_Balance: { type: "f", value: 0 },
        Shadow_Green_Balance: { type: "f", value: 0 },
        Shadow_Blue_Balance: { type: "f", value: 0 },
        Midtone_Red_Balance: { type: "f", value: 0 },
        Midtone_Green_Balance: { type: "f", value: 0 },
        Midtone_Blue_Balance: { type: "f", value: 0 },
        Highlight_Red_Balance: { type: "f", value: 0 },
        Highlight_Green_Balance: { type: "f", value: 0 },
        Highlight_Blue_Balance: { type: "f", value: 0 },
        Preserve_Luminosity: { type: "f", value: 0 },
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
    u.Shadow_Red_Balance.value = this.properties.Shadow_Red_Balance.get(e);
    u.Shadow_Green_Balance.value = this.properties.Shadow_Green_Balance.get(e);
    u.Shadow_Blue_Balance.value = this.properties.Shadow_Blue_Balance.get(e);
    u.Midtone_Red_Balance.value = this.properties.Midtone_Red_Balance.get(e);
    u.Midtone_Green_Balance.value = this.properties.Midtone_Green_Balance.get(e);
    u.Midtone_Blue_Balance.value = this.properties.Midtone_Blue_Balance.get(e);
    u.Highlight_Red_Balance.value = this.properties.Highlight_Red_Balance.get(e);
    u.Highlight_Green_Balance.value = this.properties.Highlight_Green_Balance.get(e);
    u.Highlight_Blue_Balance.value = this.properties.Highlight_Blue_Balance.get(e);
    u.Preserve_Luminosity.value = this.properties.Preserve_Luminosity.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
