// AZ ASCII (AlipFX) - Zoidium custom effect
// Source: ASCII (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-ascii.glsl

(this.defaultName = "AZ ASCII"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Converts the image to ASCII art using a chosen character set.",
  }),
  (this.shaderfile = "preset/az-ascii"),
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
    Charset: { dynamic: !0, name: "Charset", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Detail_columns: { dynamic: !0, name: "Detail Columns", type: PZ.property.type.NUMBER, value: 120, step: 1.0 },
    Font_Size: { dynamic: !0, name: "Font Size", type: PZ.property.type.NUMBER, value: 0.8, step: 0.1 },
    Line_Height: { dynamic: !0, name: "Line Height", type: PZ.property.type.NUMBER, value: 1.15, step: 0.1 },
    Character_Aspect: { dynamic: !0, name: "Character Aspect", type: PZ.property.type.NUMBER, value: 2, step: 0.1 },
    Contrast: { dynamic: !0, name: "Contrast", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Brightness: { dynamic: !0, name: "Brightness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Invert: { dynamic: !0, name: "Invert", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Transparent_Background: { dynamic: !0, name: "Transparent Background", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Color_From_Image: { dynamic: !0, name: "Color From Image", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Text_Color: { dynamic: !0, name: "Text Color", type: PZ.property.type.COLOR, value: [0, 0, 0] },
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
        Charset: { type: "f", value: 0 },
        Detail_columns: { type: "f", value: 120 },
        Font_Size: { type: "f", value: 0.8 },
        Line_Height: { type: "f", value: 1.15 },
        Character_Aspect: { type: "f", value: 2 },
        Contrast: { type: "f", value: 1 },
        Brightness: { type: "f", value: 0 },
        Invert: { type: "f", value: 0 },
        Transparent_Background: { type: "f", value: 1 },
        Color_From_Image: { type: "f", value: 1 },
        Text_Color: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
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
        u.Charset.value = this.properties.Charset.get(e);
        u.Detail_columns.value = this.properties.Detail_columns.get(e);
        u.Font_Size.value = this.properties.Font_Size.get(e);
        u.Line_Height.value = this.properties.Line_Height.get(e);
        u.Character_Aspect.value = this.properties.Character_Aspect.get(e);
        u.Contrast.value = this.properties.Contrast.get(e);
        u.Brightness.value = this.properties.Brightness.get(e);
        u.Invert.value = this.properties.Invert.get(e);
        u.Transparent_Background.value = this.properties.Transparent_Background.get(e);
        u.Color_From_Image.value = this.properties.Color_From_Image.get(e);
        u.Text_Color.value.set(this.properties.Text_Color.get(e)[0]||0, this.properties.Text_Color.get(e)[1]||0, this.properties.Text_Color.get(e)[2]||0);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
