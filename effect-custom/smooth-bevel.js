// Smooth Bevel - Zoidium custom effect
// Smooth directional bevel lighting using the alpha gradient as a stand-in for
// a surface normal. Applies Lambertian shading from a user-controlled light
// direction. Light "from upper-right" = angle = -45 (0 = right, 90 = bottom).

(this.defaultName = "Smooth Bevel"),
  (this._zoidiumMeta = {
    category: "ENHANCE",
    desc: "Smooth directional bevel lighting on opaque areas. Adjust light color, angle, radius, and intensity.",
  }),
  (this.shaderfile = "preset/smooth-bevel"),
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
    enabled: {
      dynamic: !0,
      name: "Enabled",
      type: PZ.property.type.OPTION,
      value: 1,
      items: "off;on",
    },
    lightColor: {
      dynamic: !0,
      name: "Light Color",
      type: PZ.property.type.COLOR,
      value: [1, 1, 1],
    },
    shadowColor: {
      dynamic: !0,
      name: "Shadow Color",
      type: PZ.property.type.COLOR,
      value: [0, 0, 0],
    },
    lightAngle: {
      dynamic: !0,
      name: "Light Angle",
      type: PZ.property.type.NUMBER,
      value: -45,
      step: 0.1,
    },
    bevelRadius: {
      dynamic: !0,
      name: "Bevel Radius",
      type: PZ.property.type.NUMBER,
      value: 5,
      step: 0.1,
    },
    intensity: {
      dynamic: !0,
      name: "Intensity",
      type: PZ.property.type.NUMBER,
      value: 1,
      step: 0.1,
    },
    shadowAmount: {
      dynamic: !0,
      name: "Shadow Amount",
      type: PZ.property.type.NUMBER,
      value: 1,
      step: 0.1,
    },
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
        lightColor: { type: "v3", value: new THREE.Vector3(1, 1, 1) },
        shadowColor: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
        lightAngle: { type: "f", value: -45 },
        bevelRadius: { type: "f", value: 5 },
        intensity: { type: "f", value: 1 },
        shadowAmount: { type: "f", value: 1 },
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
    if (!this.pass) return;
    this.pass.enabled = 1 === this.properties.enabled.get(e);
    const u = this.pass.uniforms;
    const lc = this.properties.lightColor.get(e);
    u.lightColor.value.set(lc[0] || 0, lc[1] || 0, lc[2] || 0);
    const sc = this.properties.shadowColor.get(e);
    u.shadowColor.value.set(sc[0] || 0, sc[1] || 0, sc[2] || 0);
    u.lightAngle.value = this.properties.lightAngle.get(e);
    u.bevelRadius.value = this.properties.bevelRadius.get(e);
    u.intensity.value = this.properties.intensity.get(e);
    u.shadowAmount.value = this.properties.shadowAmount.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });