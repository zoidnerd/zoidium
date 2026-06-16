// AZ Light Burst 2.5 (AlipFX) - Zoidium custom effect
// Source: AZ Light Burst 2.5 (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-light-burst-25.glsl

(this.defaultName = "AZ Light Burst 2.5"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Creates radial light burst rays from a center point.",
  }),
  (this.shaderfile = "preset/az-light-burst-25"),
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
    Center: { dynamic: !0, name: "Center", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Intensity: { dynamic: !0, name: "Intensity", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Ray_Length: { dynamic: !0, name: "Ray Length", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Burst: { dynamic: !0, name: "Burst", type: PZ.property.type.OPTION, value: 1, step: 1, items: "Linear;Fade;Bilateral" },
    Halo_Alpha: { dynamic: !0, name: "Halo Alpha", type: PZ.property.type.OPTION, value: 0, step: 1, items: "off;on" },
    Set_Color: { dynamic: !0, name: "Set Color", type: PZ.property.type.OPTION, value: 0, step: 1, items: "off;on" },
    Color: { dynamic: !0, name: "Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
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
        Center: { type: "v2", value: new THREE.Vector2(0, 0) },
        Intensity: { type: "f", value: 100 },
        Ray_Length: { type: "f", value: 50 },
        Burst: { type: "f", value: 1 },
        Halo_Alpha: { type: "f", value: 0 },
        Set_Color: { type: "f", value: 0 },
        Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
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
    const _Center = this.properties.Center.get(e); u.Center.value.set(_Center[0]||0, _Center[1]||0);
    u.Intensity.value = this.properties.Intensity.get(e);
    u.Ray_Length.value = this.properties.Ray_Length.get(e);
    u.Burst.value = this.properties.Burst.get(e);
    u.Halo_Alpha.value = this.properties.Halo_Alpha.get(e);
    u.Set_Color.value = this.properties.Set_Color.get(e);
    u.Color.value.set(this.properties.Color.get(e)[0]||0, this.properties.Color.get(e)[1]||0, this.properties.Color.get(e)[2]||0);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
