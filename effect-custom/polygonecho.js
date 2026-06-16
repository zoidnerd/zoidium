// Polygon Echo - shader-only effect for Zoidium
// Renders an echoed series of polygons (or stars) around a center with
// a striped pattern overlay, blended onto the source layer.
// Reference shader: assets/shaders/fragment/preset/polygonecho.glsl

(this.defaultName = "Polygon Echo"),
  (this._zoidiumMeta = {
    category: "ENHANCE",
    desc: "Draws a striped series of polygons/stars around a center point.",
  }),
  (this.shaderfile = "preset/polygonecho"),
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
    Color: {
      dynamic: !0,
      name: "Color",
      type: PZ.property.type.COLOR,
      value: [1, 1, 1],
    },
    Opacity: {
      dynamic: !0,
      name: "Opacity",
      type: PZ.property.type.NUMBER,
      value: 1,
      min: 0,
      max: 1,
      step: 0.1,
    },
    N: {
      dynamic: !0,
      name: "Sides",
      type: PZ.property.type.NUMBER,
      value: 4,
      min: 0,
      max: 32,
      step: 1,
    },
    StarInnerRadius: {
      dynamic: !0,
      name: "Star Inner Radius",
      type: PZ.property.type.NUMBER,
      value: 0,
      min: 0,
      max: 1,
      step: 0.1,
    },
    Size: {
      dynamic: !0,
      name: "Size",
      type: PZ.property.type.NUMBER,
      value: 20,
      min: 0,
      max: 100,
      step: 0.1,
    },
    Size2: {
      dynamic: !0,
      name: "Size Variation",
      type: PZ.property.type.NUMBER,
      value: 0,
      min: 0,
      max: 100,
      step: 0.1,
    },
    Width: {
      dynamic: !0,
      name: "Stroke Width",
      type: PZ.property.type.NUMBER,
      value: 1,
      min: 0,
      max: 50,
      step: 0.1,
    },
    Position: {
      dynamic: !0,
      name: "Position",
      type: PZ.property.type.VECTOR2,
      value: [0, 0],
    },
    Rotation: {
      dynamic: !0,
      name: "Rotation",
      type: PZ.property.type.NUMBER,
      value: 0,
      min: 0,
      max: 360,
      step: 1,
    },
    RotationStep: {
      dynamic: !0,
      name: "Rotation Step",
      type: PZ.property.type.NUMBER,
      value: 0,
      min: -180,
      max: 180,
      step: 1,
    },
    Repeat: {
      dynamic: !0,
      name: "Repeat",
      type: PZ.property.type.NUMBER,
      value: 0,
      min: 0,
      max: 100,
      step: 1,
    },
    Margin: {
      dynamic: !0,
      name: "Margin",
      type: PZ.property.type.NUMBER,
      value: -5,
      min: -50,
      max: 50,
      step: 0.1,
    },
    StripeEnabled: {
      dynamic: !0,
      name: "Stripe",
      type: PZ.property.type.OPTION,
      value: 1,
      items: "off;on",
    },
    StripeWidth: {
      dynamic: !0,
      name: "Stripe Width",
      type: PZ.property.type.NUMBER,
      value: 5.86,
      min: 0.1,
      max: 100,
      step: 0.1,
    },
    StripeMargin: {
      dynamic: !0,
      name: "Stripe Margin",
      type: PZ.property.type.NUMBER,
      value: 1,
      min: 0,
      max: 1,
      step: 0.1,
    },
    StripeOffset: {
      dynamic: !0,
      name: "Stripe Offset",
      type: PZ.property.type.NUMBER,
      value: 0,
      min: -100,
      max: 100,
      step: 0.1,
    },
    StripeRotation: {
      dynamic: !0,
      name: "Stripe Rotation",
      type: PZ.property.type.NUMBER,
      value: 0,
      min: 0,
      max: 360,
      step: 1,
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
        Color: { type: "v3", value: new THREE.Vector3(1, 1, 1) },
        Opacity: { type: "f", value: 1 },
        N: { type: "i", value: 4 },
        StarInnerRadius: { type: "f", value: 0 },
        Size: { type: "f", value: 20 },
        Size2: { type: "f", value: 0 },
        Width: { type: "f", value: 1 },
        Position: { type: "v2", value: new THREE.Vector2(0, 0) },
        Rotation: { type: "f", value: 0 },
        RotationStep: { type: "f", value: 0 },
        Repeat: { type: "f", value: 0 },
        Margin: { type: "f", value: -5 },
        StripeEnabled: { type: "f", value: 1 },
        StripeWidth: { type: "f", value: 5.86 },
        StripeMargin: { type: "f", value: 1 },
        StripeOffset: { type: "f", value: 0 },
        StripeRotation: { type: "f", value: 0 },
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
    const color = this.properties.Color.get(e);
    u.Color.value.set(color[0] || 0, color[1] || 0, color[2] || 0);
    u.Opacity.value = this.properties.Opacity.get(e);
    u.N.value = Math.round(this.properties.N.get(e));
    u.StarInnerRadius.value = this.properties.StarInnerRadius.get(e);
    u.Size.value = this.properties.Size.get(e);
    u.Size2.value = this.properties.Size2.get(e);
    u.Width.value = this.properties.Width.get(e);
    const pos = this.properties.Position.get(e);
    u.Position.value.set(pos[0] || 0, pos[1] || 0);
    u.Rotation.value = this.properties.Rotation.get(e);
    u.RotationStep.value = this.properties.RotationStep.get(e);
    u.Repeat.value = this.properties.Repeat.get(e);
    u.Margin.value = this.properties.Margin.get(e);
    u.StripeEnabled.value = this.properties.StripeEnabled.get(e) === 1 ? 1 : 0;
    u.StripeWidth.value = this.properties.StripeWidth.get(e);
    u.StripeMargin.value = this.properties.StripeMargin.get(e);
    u.StripeOffset.value = this.properties.StripeOffset.get(e);
    u.StripeRotation.value = this.properties.StripeRotation.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
