// Turbulent Displace (AlipFX) - Zoidium custom effect
// Source: Turbulent Displace (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/turbulent-displace.glsl

(this.defaultName = "Turbulent Displace"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Fractal-noise UV displacement with gradient and curl modes.",
  }),
  (this.shaderfile = "preset/turbulent-displace"),
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
    Displacement: { dynamic: !0, name: "Displacement", type: PZ.property.type.OPTION, value: 0, step: 1, items: "2D Noise;Gradient;Curl;2D Noise (S);Gradient (S);Curl (S);Vertical;Horizontal" },
    Amount: { dynamic: !0, name: "Amount", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Size: { dynamic: !0, name: "Size", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Offset: { dynamic: !0, name: "Offset", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Complexity: { dynamic: !0, name: "Complexity", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Evolution: { dynamic: !0, name: "Evolution", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Cycle_Evolution: { dynamic: !0, name: "Cycle Evolution", type: PZ.property.type.OPTION, value: 0, step: 1, items: "off;on" },
    Cycle_in_Revolutions: { dynamic: !0, name: "Cycle in Revolutions", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Random_Seed: { dynamic: !0, name: "Random Seed", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Pinning: { dynamic: !0, name: "Pinning", type: PZ.property.type.OPTION, value: 1, step: 1, items: "None;All Edges;Left/Right;Top/Bottom;Left;Right;Top;Bottom;All (Soft);L/R (Soft);T/B (Soft);L (Soft);R (Soft);T (Soft);B (Soft)" },
    Resize_Layer: { dynamic: !0, name: "Resize Layer", type: PZ.property.type.OPTION, value: 0, step: 1, items: "off;on" },
    Antialiasing_for_Best_Quality: { dynamic: !0, name: "Antialiasing for Best Quality", type: PZ.property.type.OPTION, value: 0, step: 1, items: "off;on" },
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
        Displacement: { type: "i", value: 0 },
        Amount: { type: "f", value: 50 },
        Size: { type: "f", value: 100 },
        Offset: { type: "v2", value: new THREE.Vector2(0, 0) },
        Complexity: { type: "f", value: 1 },
        Evolution: { type: "f", value: 0 },
        Cycle_Evolution: { type: "i", value: 0 },
        Cycle_in_Revolutions: { type: "f", value: 0 },
        Random_Seed: { type: "f", value: 0 },
        Pinning: { type: "i", value: 1 },
        Resize_Layer: { type: "i", value: 0 },
        Antialiasing_for_Best_Quality: { type: "i", value: 0 },
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
    u.Displacement.value = Math.round(this.properties.Displacement.get(e));
    u.Amount.value = this.properties.Amount.get(e);
    u.Size.value = this.properties.Size.get(e);
    const _Offset = this.properties.Offset.get(e); u.Offset.value.set(_Offset[0]||0, _Offset[1]||0);
    u.Complexity.value = this.properties.Complexity.get(e);
    u.Evolution.value = this.properties.Evolution.get(e);
    u.Cycle_Evolution.value = Math.round(this.properties.Cycle_Evolution.get(e));
    u.Cycle_in_Revolutions.value = this.properties.Cycle_in_Revolutions.get(e);
    u.Random_Seed.value = this.properties.Random_Seed.get(e);
    u.Pinning.value = Math.round(this.properties.Pinning.get(e));
    u.Resize_Layer.value = Math.round(this.properties.Resize_Layer.get(e));
    u.Antialiasing_for_Best_Quality.value = Math.round(this.properties.Antialiasing_for_Best_Quality.get(e));
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
