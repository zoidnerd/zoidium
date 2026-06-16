// Turbulent Noise (AlipFX) - Zoidium custom effect
// Source: Turbulent Noise (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/turbulent-noise.glsl

(this.defaultName = "Turbulent Noise"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Rich procedural noise overlay with many fractal types.",
  }),
  (this.shaderfile = "preset/turbulent-noise"),
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
    Fractal_Type: { dynamic: !0, name: "Fractal Type", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Basic FBM;Smooth Turbulence;Turbulence;Ridged;Domain Warp;Progressive Warp;Rotated;Maximum;Smeary;Vector Warp;Ridged 2;Billow;Ridged Base;Base+Fine;Fine Power;Striped" },
    Noise_Type: { dynamic: !0, name: "Noise Type", type: PZ.property.type.OPTION, value: 2, step: 1, items: "Step;Linear;Smooth;Smoothstep" },
    Invert: { dynamic: !0, name: "Invert", type: PZ.property.type.OPTION, value: 0, step: 1, items: "off;on" },
    Contrast: { dynamic: !0, name: "Contrast", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Brightness: { dynamic: !0, name: "Brightness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Overflow: { dynamic: !0, name: "Overflow", type: PZ.property.type.OPTION, value: 3, step: 1, items: "Clamp;Soft;Saw;None" },
    Rotation: { dynamic: !0, name: "Rotation", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Uniform_Scaling: { dynamic: !0, name: "Uniform Scaling", type: PZ.property.type.OPTION, value: 1, step: 1, items: "off;on" },
    Scale: { dynamic: !0, name: "Scale", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Scale_Width: { dynamic: !0, name: "Scale Width", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Scale_Height: { dynamic: !0, name: "Scale Height", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Offset_Turbulence: { dynamic: !0, name: "Offset Turbulence", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Perspective_Offset: { dynamic: !0, name: "Perspective Offset", type: PZ.property.type.OPTION, value: 0, step: 1, items: "off;on" },
    Complexity: { dynamic: !0, name: "Complexity", type: PZ.property.type.NUMBER, value: 6, step: 0.1 },
    Sub_Influence: { dynamic: !0, name: "Sub Influence", type: PZ.property.type.NUMBER, value: 70, step: 0.1 },
    Sub_Scaling: { dynamic: !0, name: "Sub Scaling", type: PZ.property.type.NUMBER, value: 56, step: 0.1 },
    Evolution: { dynamic: !0, name: "Evolution", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Turbulence_Factor: { dynamic: !0, name: "Turbulence Factor", type: PZ.property.type.NUMBER, value: 1.5, step: 0.1 },
    Random_Seed: { dynamic: !0, name: "Random Seed", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Opacity: { dynamic: !0, name: "Opacity", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Blending_Mode: { dynamic: !0, name: "Blending Mode", type: PZ.property.type.OPTION, value: 0, step: 1, items: "Mix;Normal;Add;Multiply;Screen;Overlay;Soft Light;Hard Light;Color Dodge;Color Burn;Darken;Lighten;Difference;Exclusion;Hue;Saturation;Color;Luminosity" },
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
        Fractal_Type: { type: "f", value: 0 },
        Noise_Type: { type: "f", value: 2 },
        Invert: { type: "f", value: 0 },
        Contrast: { type: "f", value: 100 },
        Brightness: { type: "f", value: 0 },
        Overflow: { type: "f", value: 3 },
        Rotation: { type: "f", value: 0 },
        Uniform_Scaling: { type: "f", value: 1 },
        Scale: { type: "f", value: 100 },
        Scale_Width: { type: "f", value: 100 },
        Scale_Height: { type: "f", value: 100 },
        Offset_Turbulence: { type: "v2", value: new THREE.Vector2(0, 0) },
        Perspective_Offset: { type: "f", value: 0 },
        Complexity: { type: "f", value: 6 },
        Sub_Influence: { type: "f", value: 70 },
        Sub_Scaling: { type: "f", value: 56 },
        Evolution: { type: "f", value: 0 },
        Turbulence_Factor: { type: "f", value: 1.5 },
        Random_Seed: { type: "f", value: 0 },
        Opacity: { type: "f", value: 100 },
        Blending_Mode: { type: "f", value: 0 },
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
    u.Fractal_Type.value = this.properties.Fractal_Type.get(e);
    u.Noise_Type.value = this.properties.Noise_Type.get(e);
    u.Invert.value = this.properties.Invert.get(e);
    u.Contrast.value = this.properties.Contrast.get(e);
    u.Brightness.value = this.properties.Brightness.get(e);
    u.Overflow.value = this.properties.Overflow.get(e);
    u.Rotation.value = this.properties.Rotation.get(e);
    u.Uniform_Scaling.value = this.properties.Uniform_Scaling.get(e);
    u.Scale.value = this.properties.Scale.get(e);
    u.Scale_Width.value = this.properties.Scale_Width.get(e);
    u.Scale_Height.value = this.properties.Scale_Height.get(e);
    const _Offset_Turbulence = this.properties.Offset_Turbulence.get(e); u.Offset_Turbulence.value.set(_Offset_Turbulence[0]||0, _Offset_Turbulence[1]||0);
    u.Perspective_Offset.value = this.properties.Perspective_Offset.get(e);
    u.Complexity.value = this.properties.Complexity.get(e);
    u.Sub_Influence.value = this.properties.Sub_Influence.get(e);
    u.Sub_Scaling.value = this.properties.Sub_Scaling.get(e);
    u.Evolution.value = this.properties.Evolution.get(e);
    u.Turbulence_Factor.value = this.properties.Turbulence_Factor.get(e);
    u.Random_Seed.value = this.properties.Random_Seed.get(e);
    u.Opacity.value = this.properties.Opacity.get(e);
    u.Blending_Mode.value = this.properties.Blending_Mode.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
