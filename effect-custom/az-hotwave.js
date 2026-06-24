// AZ Hotwave (AlipFX) - Zoidium custom effect
// Source: Hotwave (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/az-hotwave.glsl

(this.defaultName = "AZ Hotwave"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Heat-wave distortion with displacement, scanlines, and color shift.",
  }),
  (this.shaderfile = "preset/az-hotwave"),
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
    Amount: { dynamic: !0, name: "Amount", type: PZ.property.type.NUMBER, value: 25, step: 0.1 },
    X_Bias: { dynamic: !0, name: "X Bias", type: PZ.property.type.NUMBER, value: 10, step: 0.1 },
    Y_Bias: { dynamic: !0, name: "Y Bias", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Flow_Direction: { dynamic: !0, name: "Flow Direction", type: PZ.property.type.NUMBER, value: 270, step: 1.0 },
    Type: { dynamic: !0, name: "Type", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Scale: { dynamic: !0, name: "Scale", type: PZ.property.type.NUMBER, value: 5000, step: 1.0 },
    Octaves: { dynamic: !0, name: "Octaves", type: PZ.property.type.NUMBER, value: 4, step: 0.1 },
    Persistence: { dynamic: !0, name: "Persistence", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Lacunarity: { dynamic: !0, name: "Lacunarity", type: PZ.property.type.NUMBER, value: 2000, step: 1.0 },
    Random_Seed: { dynamic: !0, name: "Random Seed", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Speed: { dynamic: !0, name: "Speed", type: PZ.property.type.NUMBER, value: 1000, step: 1.0 },
    Wind_Direction: { dynamic: !0, name: "Wind Direction", type: PZ.property.type.NUMBER, value: 90, step: 0.1 },
    Wind_Speed: { dynamic: !0, name: "Wind Speed", type: PZ.property.type.NUMBER, value: 30, step: 0.1 },
    Evolution: { dynamic: !0, name: "Evolution", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Blur_Strength: { dynamic: !0, name: "Blur Strength", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Blur_Radius: { dynamic: !0, name: "Blur Radius", type: PZ.property.type.NUMBER, value: 3, step: 0.1 },
    Enable_Mask: { dynamic: !0, name: "Enable Mask", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Top: { dynamic: !0, name: "Top", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Bottom: { dynamic: !0, name: "Bottom", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Softness: { dynamic: !0, name: "Softness", type: PZ.property.type.NUMBER, value: 30, step: 0.1 },
    Direction: { dynamic: !0, name: "Direction", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Red_Offset: { dynamic: !0, name: "Red Offset", type: PZ.property.type.NUMBER, value: 3, step: 0.1 },
    Green_Offset: { dynamic: !0, name: "Green Offset", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Blue_Offset: { dynamic: !0, name: "Blue Offset", type: PZ.property.type.NUMBER, value: -3, step: 0.1 },
    Enable_Turb: { dynamic: !0, name: "Enable Turb", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Sec_Scale: { dynamic: !0, name: "Sec Scale", type: PZ.property.type.NUMBER, value: 5000, step: 1.0 },
    Sec_Speed: { dynamic: !0, name: "Sec Speed", type: PZ.property.type.NUMBER, value: 3000, step: 1.0 },
    Enable_Steam: { dynamic: !0, name: "Enable Steam", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Steam_Dir: { dynamic: !0, name: "Steam Dir", type: PZ.property.type.NUMBER, value: 270, step: 1.0 },
    Steam_Scale: { dynamic: !0, name: "Steam Scale", type: PZ.property.type.NUMBER, value: 1200, step: 1.0 },
    Steam_Density: { dynamic: !0, name: "Steam Density", type: PZ.property.type.NUMBER, value: 30, step: 0.1 },
    Steam_Opacity: { dynamic: !0, name: "Steam Opacity", type: PZ.property.type.NUMBER, value: 30, step: 0.1 },
    Steam_Speed: { dynamic: !0, name: "Steam Speed", type: PZ.property.type.NUMBER, value: 200, step: 1.0 },
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
        Amount: { type: "f", value: 25 },
        X_Bias: { type: "f", value: 10 },
        Y_Bias: { type: "f", value: 50 },
        Flow_Direction: { type: "f", value: 270 },
        Type: { type: "f", value: 0 },
        Scale: { type: "f", value: 5000 },
        Octaves: { type: "f", value: 4 },
        Persistence: { type: "f", value: 50 },
        Lacunarity: { type: "f", value: 2000 },
        Random_Seed: { type: "f", value: 0 },
        Speed: { type: "f", value: 1000 },
        Wind_Direction: { type: "f", value: 90 },
        Wind_Speed: { type: "f", value: 30 },
        Evolution: { type: "f", value: 0 },
        Blur_Strength: { type: "f", value: 50 },
        Blur_Radius: { type: "f", value: 3 },
        Enable_Mask: { type: "f", value: 1 },
        Top: { type: "f", value: 0 },
        Bottom: { type: "f", value: 100 },
        Softness: { type: "f", value: 30 },
        Direction: { type: "f", value: 0 },
        Red_Offset: { type: "f", value: 3 },
        Green_Offset: { type: "f", value: 0 },
        Blue_Offset: { type: "f", value: -3 },
        Enable_Turb: { type: "f", value: 1 },
        Sec_Scale: { type: "f", value: 5000 },
        Sec_Speed: { type: "f", value: 3000 },
        Enable_Steam: { type: "f", value: 1 },
        Steam_Dir: { type: "f", value: 270 },
        Steam_Scale: { type: "f", value: 1200 },
        Steam_Density: { type: "f", value: 30 },
        Steam_Opacity: { type: "f", value: 30 },
        Steam_Speed: { type: "f", value: 200 },
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
        u.X_Bias.value = this.properties.X_Bias.get(e);
        u.Y_Bias.value = this.properties.Y_Bias.get(e);
        u.Flow_Direction.value = this.properties.Flow_Direction.get(e);
        u.Type.value = this.properties.Type.get(e);
        u.Scale.value = this.properties.Scale.get(e);
        u.Octaves.value = this.properties.Octaves.get(e);
        u.Persistence.value = this.properties.Persistence.get(e);
        u.Lacunarity.value = this.properties.Lacunarity.get(e);
        u.Random_Seed.value = this.properties.Random_Seed.get(e);
        u.Speed.value = this.properties.Speed.get(e);
        u.Wind_Direction.value = this.properties.Wind_Direction.get(e);
        u.Wind_Speed.value = this.properties.Wind_Speed.get(e);
        u.Evolution.value = this.properties.Evolution.get(e);
        u.Blur_Strength.value = this.properties.Blur_Strength.get(e);
        u.Blur_Radius.value = this.properties.Blur_Radius.get(e);
        u.Enable_Mask.value = this.properties.Enable_Mask.get(e);
        u.Top.value = this.properties.Top.get(e);
        u.Bottom.value = this.properties.Bottom.get(e);
        u.Softness.value = this.properties.Softness.get(e);
        u.Direction.value = this.properties.Direction.get(e);
        u.Red_Offset.value = this.properties.Red_Offset.get(e);
        u.Green_Offset.value = this.properties.Green_Offset.get(e);
        u.Blue_Offset.value = this.properties.Blue_Offset.get(e);
        u.Enable_Turb.value = this.properties.Enable_Turb.get(e);
        u.Sec_Scale.value = this.properties.Sec_Scale.get(e);
        u.Sec_Speed.value = this.properties.Sec_Speed.get(e);
        u.Enable_Steam.value = this.properties.Enable_Steam.get(e);
        u.Steam_Dir.value = this.properties.Steam_Dir.get(e);
        u.Steam_Scale.value = this.properties.Steam_Scale.get(e);
        u.Steam_Density.value = this.properties.Steam_Density.get(e);
        u.Steam_Opacity.value = this.properties.Steam_Opacity.get(e);
        u.Steam_Speed.value = this.properties.Steam_Speed.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
