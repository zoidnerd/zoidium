// ColorVSN (AlipFX) - Zoidium custom effect
// Source: ColorVSN (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/colorvsn.glsl

(this.defaultName = "ColorVSN"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Colorizes luminance through 22 perceptual colormaps.",
  }),
  (this.shaderfile = "preset/colorvsn"),
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
    Colormaps: { dynamic: !0, name: "Colormaps", type: PZ.property.type.OPTION, value: 21, items: "Autumn;Bone;Jet;Winter;Rainbow;Ocean;Summer;Spring;Cool;HSV;Pink;Hot;Parula;Magma;Inferno;Plasma;Viridis;Cividis;Twilight;Twilight Shifted;Turbo;Deep Green" },
    Colormap_Strength: { dynamic: !0, name: "Colormap Strength", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Contrast: { dynamic: !0, name: "Contrast", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Brightness: { dynamic: !0, name: "Brightness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Blend_Mode: { dynamic: !0, name: "Blend Mode", type: PZ.property.type.OPTION, value: 0, items: "Normal;Add;Multiply;Screen;Overlay" },
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
        Colormaps: { type: "f", value: 21 },
        Colormap_Strength: { type: "f", value: 100 },
        Contrast: { type: "f", value: 100 },
        Brightness: { type: "f", value: 0 },
        Blend_Mode: { type: "f", value: 0 },
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
    u.Colormaps.value = this.properties.Colormaps.get(e);
    u.Colormap_Strength.value = this.properties.Colormap_Strength.get(e);
    u.Contrast.value = this.properties.Contrast.get(e);
    u.Brightness.value = this.properties.Brightness.get(e);
    u.Blend_Mode.value = this.properties.Blend_Mode.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
