(this.defaultName = "Drop Shadow"),
  (this._zoidiumMeta = {
    category: "ENHANCE",
    desc: "Adds a configurable colored shadow behind the layer.",
  }),
  (this.shaderfile = "fx_boxblur"),
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
    color: {
      dynamic: !0,
      name: "Shadow Color",
      type: PZ.property.type.COLOR,
      value: [0, 0, 0],
    },
    opacity: {
      dynamic: !0,
      name: "Opacity",
      type: PZ.property.type.NUMBER,
      value: 0.5,
      max: 1,
      min: 0,
      step: 0.01,
    },
    angle: {
      dynamic: !0,
      name: "Angle",
      type: PZ.property.type.NUMBER,
      value: 135,
      max: 360,
      min: 0,
      step: 1,
    },
    distance: {
      dynamic: !0,
      name: "Distance",
      type: PZ.property.type.NUMBER,
      value: 10,
      max: 200,
      min: 0,
      step: 1,
    },
    blur: {
      dynamic: !0,
      name: "Blur",
      type: PZ.property.type.NUMBER,
      value: 10,
      max: 50,
      min: 0,
      step: 0.5,
    },
  }),
  this.properties.addAll(this.propertyDefinitions, this),
  (this.load = async function (e) {
    // Load blur shader
    this.vertShader = new PZ.asset.shader(
      this.parentProject.assets.load(this.vertShader)
    );
    this.fragShader = new PZ.asset.shader(
      this.parentProject.assets.load(this.fragShader)
    );

    // Create blur material
    var blurMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { type: "t", value: null },
        resolution: { type: "v2", value: new THREE.Vector2(1, 1) },
        uvScale: { type: "v2", value: new THREE.Vector2(1, 1) },
        delta: { type: "f", value: 1 },
      },
      vertexShader: await this.vertShader.getShader(),
      fragmentShader: await this.fragShader.getShader(),
      transparent: true,
      premultipliedAlpha: true,
    });

    // Shadow colorize shader
    var shadowShader = {
      uniforms: {
        tDiffuse: { value: null },
        shadowColor: { value: new THREE.Vector3(0, 0, 0) },
        shadowOpacity: { value: 0.5 },
        offset: { value: new THREE.Vector2(0, 0) },
        uvScale: { value: new THREE.Vector2(1, 1) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform sampler2D tDiffuse;
        uniform vec3 shadowColor;
        uniform float shadowOpacity;
        uniform vec2 offset;
        uniform vec2 uvScale;
        varying vec2 vUv;
        
        void main() {
          vec2 uv = vUv * uvScale - offset;
          
          // Check if UV is in valid range
          if (uv.x < 0.0 || uv.x > uvScale.x || uv.y < 0.0 || uv.y > uvScale.y) {
            gl_FragColor = vec4(0.0);
            return;
          }
          
          vec4 texel = texture2D(tDiffuse, uv);
          float alpha = texel.a * shadowOpacity;
          // Output premultiplied alpha: rgb * alpha
          gl_FragColor = vec4(shadowColor * alpha, alpha);
        }
      `,
    };

    this.shadowMaterial = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(shadowShader.uniforms),
      vertexShader: shadowShader.vertexShader,
      fragmentShader: shadowShader.fragmentShader,
      transparent: true,
      premultipliedAlpha: true,
      depthTest: false,
      depthWrite: false,
    });
    this.shadowPass = new THREE.ShaderPass(this.shadowMaterial);

    // Composite shader - blend shadow under original
    var compositeShader = {
      uniforms: {
        tOriginal: { value: null },
        tShadow: { value: null },
        uvScale: { value: new THREE.Vector2(1, 1) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform sampler2D tOriginal;
        uniform sampler2D tShadow;
        uniform vec2 uvScale;
        varying vec2 vUv;
        
        void main() {
          vec2 uv = vUv * uvScale;
          vec4 original = texture2D(tOriginal, uv);
          vec4 shadow = texture2D(tShadow, uv);
          
          // Both textures are premultiplied alpha
          // Blend shadow under original: result = original + shadow * (1 - original.a)
          gl_FragColor = original + shadow * (1.0 - original.a);
        }
      `,
    };

    this.compositeMaterial = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(compositeShader.uniforms),
      vertexShader: compositeShader.vertexShader,
      fragmentShader: compositeShader.fragmentShader,
      transparent: true,
      premultipliedAlpha: true,
      blending: THREE.NoBlending,
      depthTest: false,
      depthWrite: false,
    });
    this.compositePass = new THREE.ShaderPass(this.compositeMaterial);

    // Blur materials for horizontal/vertical
    this.blurMaterial_h = blurMaterial;
    this.blurMaterial_v = blurMaterial.clone();
    this.blurMaterial_h.defines = { BLUR_DIR: 0 };
    this.blurMaterial_v.defines = { BLUR_DIR: 1 };
    this.blurMaterial_h.needsUpdate = true;
    this.blurMaterial_v.needsUpdate = true;

    // Work buffers
    this.shadowBuffer = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    });
    this.blurBuffer = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    });

    // Simple scene for rendering
    this.blurCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.blurScene = new THREE.Scene();
    this.blurQuad = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2, 2),
      this.blurMaterial_h
    );
    this.blurScene.add(this.blurQuad);

    // Custom pass
    this.pass = {
      enabled: true,
      uniforms: {
        uvScale: { value: new THREE.Vector2(1, 1) },
      },
      needsSwap: true,
      clear: false,
      renderToScreen: false,

      render: (renderer, writeBuffer, readBuffer, maskActive) => {
        const w = readBuffer.width;
        const h = readBuffer.height;

        // Resize work buffers
        if (this.shadowBuffer.width !== w || this.shadowBuffer.height !== h) {
          this.shadowBuffer.setSize(w, h);
          this.blurBuffer.setSize(w, h);
        }

        // Get parameters
        const color = this.cachedColor || [0, 0, 0];
        const opacity = this.cachedOpacity || 0.5;
        const angle = this.cachedAngle || 135;
        const distance = this.cachedDistance || 10;
        const blur = this.cachedBlur || 10;
        const resolution = this.cachedResolution || [w, h];

        // Calculate offset from angle and distance
        const rad = (angle * Math.PI) / 180;
        const offsetX = (Math.cos(rad) * distance) / resolution[0];
        const offsetY = (Math.sin(rad) * distance) / resolution[1];

        // Step 1: Create shadow (colorize + offset)
        // Clear shadow buffer first to prevent ghosting
        renderer.setClearColor(0x000000, 0);
        renderer.clearTarget(this.shadowBuffer, true, true, true);
        renderer.clearTarget(this.blurBuffer, true, true, true);

        this.shadowPass.uniforms.tDiffuse.value = readBuffer.texture;
        this.shadowPass.uniforms.shadowColor.value.set(
          color[0],
          color[1],
          color[2]
        );
        this.shadowPass.uniforms.shadowOpacity.value = opacity;
        this.shadowPass.uniforms.offset.value.set(offsetX, -offsetY);
        this.shadowPass.uniforms.uvScale.value.copy(
          this.pass.uniforms.uvScale.value
        );
        this.shadowPass.render(renderer, this.shadowBuffer, readBuffer, true);

        // Step 2: Blur shadow (multi-pass Gaussian)
        if (blur > 0) {
          const blurDelta = blur / 10;
          this.blurMaterial_h.uniforms.delta.value = blurDelta;
          this.blurMaterial_v.uniforms.delta.value = blurDelta;
          this.blurMaterial_h.uniforms.resolution.value.set(
            resolution[0],
            resolution[1]
          );
          this.blurMaterial_v.uniforms.resolution.value.set(
            resolution[0],
            resolution[1]
          );
          this.blurMaterial_h.uniforms.uvScale.value.copy(
            this.pass.uniforms.uvScale.value
          );
          this.blurMaterial_v.uniforms.uvScale.value.copy(
            this.pass.uniforms.uvScale.value
          );

          // 3 iterations of H+V blur
          for (let i = 0; i < 3; i++) {
            // Horizontal blur
            this.blurQuad.material = this.blurMaterial_h;
            this.blurMaterial_h.uniforms.tDiffuse.value =
              this.shadowBuffer.texture;
            renderer.render(
              this.blurScene,
              this.blurCamera,
              this.blurBuffer,
              true
            );

            // Vertical blur
            this.blurQuad.material = this.blurMaterial_v;
            this.blurMaterial_v.uniforms.tDiffuse.value =
              this.blurBuffer.texture;
            renderer.render(
              this.blurScene,
              this.blurCamera,
              this.shadowBuffer,
              true
            );
          }
        }

        // Step 3: Composite shadow under original
        // Clear writeBuffer first to prevent black background
        renderer.setClearColor(0x000000, 0);
        renderer.clearTarget(writeBuffer, true, true, true);

        this.compositePass.uniforms.tOriginal.value = readBuffer.texture;
        this.compositePass.uniforms.tShadow.value = this.shadowBuffer.texture;
        this.compositePass.uniforms.uvScale.value.copy(
          this.pass.uniforms.uvScale.value
        );
        this.compositePass.render(renderer, writeBuffer, null, false);
      },
    };

    this.properties.load(e && e.properties);
  }),
  (this.toJSON = function () {
    return { type: this.type, properties: this.properties };
  }),
  (this.unload = function () {
    this.parentProject.assets.unload(this.vertShader);
    this.parentProject.assets.unload(this.fragShader);
    if (this.shadowBuffer) this.shadowBuffer.dispose();
    if (this.blurBuffer) this.blurBuffer.dispose();
  }),
  (this.update = function (e) {
    if (!this.pass) return;

    this.cachedColor = this.properties.color.get(e);
    this.cachedOpacity = this.properties.opacity.get(e);
    this.cachedAngle = this.properties.angle.get(e);
    this.cachedDistance = this.properties.distance.get(e);
    this.cachedBlur = this.properties.blur.get(e);

    this.pass.enabled = this.properties.enabled.get(e) === 1;
  }),
  (this.resize = function () {
    if (this.parentLayer && this.parentLayer.properties) {
      this.cachedResolution = this.parentLayer.properties.resolution.get();
    }
  });
