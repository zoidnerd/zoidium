// Curl Noise (AlipFX) - Zoidium custom effect
// Source: Curl Noise (AlipFX).txt
// Reference shader: assets/shaders/fragment/preset/curl-noise.glsl

(this.defaultName = "Curl Noise"),
  (this._zoidiumMeta = {
    category: "AlipFX",
    desc: "Curl-noise driven distortion with adjustable scale, speed, and view mode.",
  }),
  (this.shaderfile = "preset/curl-noise"),
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
    Source: { dynamic: !0, name: "Source", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Mirror_at_Edge: { dynamic: !0, name: "Mirror At Edge", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Speed: { dynamic: !0, name: "Speed", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Direction: { dynamic: !0, name: "Direction", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Softness: { dynamic: !0, name: "Softness", type: PZ.property.type.NUMBER, value: 20, step: 0.1 },
    Uniform_Scaling: { dynamic: !0, name: "Uniform Scaling", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Scale: { dynamic: !0, name: "Scale", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Scale_Width: { dynamic: !0, name: "Scale Width", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Scale_Height: { dynamic: !0, name: "Scale Height", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Offset: { dynamic: !0, name: "Offset", type: PZ.property.type.VECTOR2, value: [0, 0], linkRatio: false },
    Rotation: { dynamic: !0, name: "Rotation", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Evolution: { dynamic: !0, name: "Evolution", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Turbulence_Speed: { dynamic: !0, name: "Turbulence Speed", type: PZ.property.type.NUMBER, value: 1, step: 0.1 },
    Swirl: { dynamic: !0, name: "Swirl", type: PZ.property.type.NUMBER, value: 180, step: 1.0 },
    Density: { dynamic: !0, name: "Density", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Smoothness: { dynamic: !0, name: "Smoothness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Vertical_Bias: { dynamic: !0, name: "Vertical Bias", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Sample_Count: { dynamic: !0, name: "Sample Count", type: PZ.property.type.NUMBER, value: 3, step: 0.1 },
    Sample_Radius: { dynamic: !0, name: "Sample Radius", type: PZ.property.type.NUMBER, value: 80, step: 0.1 },
    Flow_Softness: { dynamic: !0, name: "Flow Softness", type: PZ.property.type.NUMBER, value: 25, step: 0.1 },
    Edge_Definition: { dynamic: !0, name: "Edge Definition", type: PZ.property.type.NUMBER, value: 50, step: 0.1 },
    Flow_Falloff: { dynamic: !0, name: "Flow Falloff", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    View: { dynamic: !0, name: "View", type: PZ.property.type.OPTION, value: 2, items: "Input Noise;Curl Generation;Color Curl" },
    Contrast: { dynamic: !0, name: "Contrast", type: PZ.property.type.NUMBER, value: 100, step: 0.1 },
    Brightness: { dynamic: !0, name: "Brightness", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Clip_HDR_Results: { dynamic: !0, name: "Clip Hdr Results", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
    Channel: { dynamic: !0, name: "Channel", type: PZ.property.type.NUMBER, value: 0, step: 0.1 },
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
        Source: { type: "f", value: 0 },
        Mirror_at_Edge: { type: "f", value: 1 },
        Speed: { type: "f", value: 0 },
        Direction: { type: "f", value: 0 },
        Softness: { type: "f", value: 20 },
        Uniform_Scaling: { type: "f", value: 1 },
        Scale: { type: "f", value: 100 },
        Scale_Width: { type: "f", value: 100 },
        Scale_Height: { type: "f", value: 100 },
        Offset: { type: "v2", value: new THREE.Vector2(0, 0) },
        Rotation: { type: "f", value: 0 },
        Evolution: { type: "f", value: 0 },
        Turbulence_Speed: { type: "f", value: 1 },
        Swirl: { type: "f", value: 180 },
        Density: { type: "f", value: 0 },
        Smoothness: { type: "f", value: 0 },
        Vertical_Bias: { type: "f", value: 0 },
        Sample_Count: { type: "f", value: 3 },
        Sample_Radius: { type: "f", value: 80 },
        Flow_Softness: { type: "f", value: 25 },
        Edge_Definition: { type: "f", value: 50 },
        Flow_Falloff: { type: "f", value: 0 },
        View: { type: "i", value: 2 },
        Contrast: { type: "f", value: 100 },
        Brightness: { type: "f", value: 0 },
        Clip_HDR_Results: { type: "f", value: 0 },
        Channel: { type: "f", value: 0 },
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
        u.Source.value = this.properties.Source.get(e);
        u.Mirror_at_Edge.value = this.properties.Mirror_at_Edge.get(e);
        u.Speed.value = this.properties.Speed.get(e);
        u.Direction.value = this.properties.Direction.get(e);
        u.Softness.value = this.properties.Softness.get(e);
        u.Uniform_Scaling.value = this.properties.Uniform_Scaling.get(e);
        u.Scale.value = this.properties.Scale.get(e);
        u.Scale_Width.value = this.properties.Scale_Width.get(e);
        u.Scale_Height.value = this.properties.Scale_Height.get(e);
        const _Offset = this.properties.Offset.get(e); u.Offset.value.set(_Offset[0]||0, _Offset[1]||0);
        u.Rotation.value = this.properties.Rotation.get(e);
        u.Evolution.value = this.properties.Evolution.get(e);
        u.Turbulence_Speed.value = this.properties.Turbulence_Speed.get(e);
        u.Swirl.value = this.properties.Swirl.get(e);
        u.Density.value = this.properties.Density.get(e);
        u.Smoothness.value = this.properties.Smoothness.get(e);
        u.Vertical_Bias.value = this.properties.Vertical_Bias.get(e);
        u.Sample_Count.value = this.properties.Sample_Count.get(e);
        u.Sample_Radius.value = this.properties.Sample_Radius.get(e);
        u.Flow_Softness.value = this.properties.Flow_Softness.get(e);
        u.Edge_Definition.value = this.properties.Edge_Definition.get(e);
        u.Flow_Falloff.value = this.properties.Flow_Falloff.get(e);
        u.View.value = Math.round(this.properties.View.get(e));
        u.Contrast.value = this.properties.Contrast.get(e);
        u.Brightness.value = this.properties.Brightness.get(e);
        u.Clip_HDR_Results.value = this.properties.Clip_HDR_Results.get(e);
        u.Channel.value = this.properties.Channel.get(e);
  }),
  (this.resize = function () {
    const r = this.parentLayer.properties.resolution.get();
    this.pass.uniforms.resolution.value.set(r[0], r[1]);
  });
