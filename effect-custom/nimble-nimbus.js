// Nimble Nimbus (AlipFX) - Zoidium custom effect
// Source: Nimble Nimbus (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/nimble-nimbus.glsl

(this.defaultName = "Nimble Nimbus"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Cloud-like noise distortion with animated flow and tint.",
  }),
  (this.shaderfile = "preset/nimble-nimbus"),
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
    Cloud_Length: { dynamic: !0, name: "Cloud Length", type: PZ.property.type.NUMBER, value: 80, step: 0.1 },
    Cloud_Scale: { dynamic: !0, name: "Cloud Scale", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Slant: { dynamic: !0, name: "Slant", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Vertical_Alignment: { dynamic: !0, name: "Vertical Alignment", type: PZ.property.type.NUMBER, value: -20, step: 0.1 },
    End_Roundy: { dynamic: !0, name: "End Roundy", type: PZ.property.type.NUMBER, value: 2, step: 0.1 },
    Spacing: { dynamic: !0, name: "Spacing", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Random_Seed: { dynamic: !0, name: "Random Seed", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Top_Contrast: { dynamic: !0, name: "Top Contrast", type: PZ.property.type.NUMBER, value: 0.9, step: 0.1 },
    Top_Variation: { dynamic: !0, name: "Top Variation", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Top_Correlation: { dynamic: !0, name: "Top Correlation", type: PZ.property.type.NUMBER, value: 8, step: 0.1 },
    Taper_Left_Top: { dynamic: !0, name: "Taper Left Top", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Taper_Right_Top: { dynamic: !0, name: "Taper Right Top", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Bottom_Scale: { dynamic: !0, name: "Bottom Scale", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Bottom_Contrast: { dynamic: !0, name: "Bottom Contrast", type: PZ.property.type.NUMBER, value: 0.9, step: 0.1 },
    Bottom_Variation: { dynamic: !0, name: "Bottom Variation", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Bottom_Correlation: { dynamic: !0, name: "Bottom Correlation", type: PZ.property.type.NUMBER, value: 8, step: 0.1 },
    Taper_Left_Bottom: { dynamic: !0, name: "Taper Left Bottom", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Taper_Right_Bottom: { dynamic: !0, name: "Taper Right Bottom", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Evolution: { dynamic: !0, name: "Evolution", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Top_Evolution_Scale: { dynamic: !0, name: "Top Evolution Scale", type: PZ.property.type.NUMBER, value: 3, step: 0.1 },
    Reverse_Top_Direction: { dynamic: !0, name: "Reverse Top Direction", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Bottom_Evolution_Scale: { dynamic: !0, name: "Bottom Evolution Scale", type: PZ.property.type.NUMBER, value: 3, step: 0.1 },
    Reverse_Bottom_Direction: { dynamic: !0, name: "Reverse Bottom Direction", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Secondary_Animation_Amount: { dynamic: !0, name: "Secondary Animation Amount", type: PZ.property.type.NUMBER, value: 180, step: 1.0 },
    Secondary_Evolution: { dynamic: !0, name: "Secondary Evolution", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Secondary_Evolution_Scale: { dynamic: !0, name: "Secondary Evolution Scale", type: PZ.property.type.NUMBER, value: 3, step: 0.1 },
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
        Cloud_Length: { type: "f", value: 80 },
        Cloud_Scale: { type: "f", value: 100 },
        Slant: { type: "f", value: 0 },
        Vertical_Alignment: { type: "f", value: -20 },
        End_Roundy: { type: "f", value: 2 },
        Spacing: { type: "f", value: 0 },
        Random_Seed: { type: "f", value: 0 },
        Top_Contrast: { type: "f", value: 0.9 },
        Top_Variation: { type: "f", value: 100 },
        Top_Correlation: { type: "f", value: 8 },
        Taper_Left_Top: { type: "f", value: 100 },
        Taper_Right_Top: { type: "f", value: 100 },
        Bottom_Scale: { type: "f", value: 0 },
        Bottom_Contrast: { type: "f", value: 0.9 },
        Bottom_Variation: { type: "f", value: 100 },
        Bottom_Correlation: { type: "f", value: 8 },
        Taper_Left_Bottom: { type: "f", value: 100 },
        Taper_Right_Bottom: { type: "f", value: 100 },
        Evolution: { type: "f", value: 0 },
        Top_Evolution_Scale: { type: "f", value: 3 },
        Reverse_Top_Direction: { type: "f", value: 0 },
        Bottom_Evolution_Scale: { type: "f", value: 3 },
        Reverse_Bottom_Direction: { type: "f", value: 0 },
        Secondary_Animation_Amount: { type: "f", value: 180 },
        Secondary_Evolution: { type: "f", value: 0 },
        Secondary_Evolution_Scale: { type: "f", value: 3 },
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
        u.Cloud_Length.value = this.properties.Cloud_Length.get(e);
        u.Cloud_Scale.value = this.properties.Cloud_Scale.get(e);
        u.Slant.value = this.properties.Slant.get(e);
        u.Vertical_Alignment.value = this.properties.Vertical_Alignment.get(e);
        u.End_Roundy.value = this.properties.End_Roundy.get(e);
        u.Spacing.value = this.properties.Spacing.get(e);
        u.Random_Seed.value = this.properties.Random_Seed.get(e);
        u.Top_Contrast.value = this.properties.Top_Contrast.get(e);
        u.Top_Variation.value = this.properties.Top_Variation.get(e);
        u.Top_Correlation.value = this.properties.Top_Correlation.get(e);
        u.Taper_Left_Top.value = this.properties.Taper_Left_Top.get(e);
        u.Taper_Right_Top.value = this.properties.Taper_Right_Top.get(e);
        u.Bottom_Scale.value = this.properties.Bottom_Scale.get(e);
        u.Bottom_Contrast.value = this.properties.Bottom_Contrast.get(e);
        u.Bottom_Variation.value = this.properties.Bottom_Variation.get(e);
        u.Bottom_Correlation.value = this.properties.Bottom_Correlation.get(e);
        u.Taper_Left_Bottom.value = this.properties.Taper_Left_Bottom.get(e);
        u.Taper_Right_Bottom.value = this.properties.Taper_Right_Bottom.get(e);
        u.Evolution.value = this.properties.Evolution.get(e);
        u.Top_Evolution_Scale.value = this.properties.Top_Evolution_Scale.get(e);
        u.Reverse_Top_Direction.value = this.properties.Reverse_Top_Direction.get(e);
        u.Bottom_Evolution_Scale.value = this.properties.Bottom_Evolution_Scale.get(e);
        u.Reverse_Bottom_Direction.value = this.properties.Reverse_Bottom_Direction.get(e);
        u.Secondary_Animation_Amount.value = this.properties.Secondary_Animation_Amount.get(e);
        u.Secondary_Evolution.value = this.properties.Secondary_Evolution.get(e);
        u.Secondary_Evolution_Scale.value = this.properties.Secondary_Evolution_Scale.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
