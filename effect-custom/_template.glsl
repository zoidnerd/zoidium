// Custom shader template for Zoidium
// Drop this file at assets/shaders/fragment/fx_<your_effect>.glsl
// then reference it from your effect's this.shaderfile = "fx_<your_effect>"

precision highp float;
precision highp int;

uniform sampler2D tDiffuse;
uniform vec2 uvScale;
uniform vec2 resolution;

varying vec2 vUv;

void main()
{
    vec4 texel = texture2D(tDiffuse, vUv * uvScale);
    // TODO: apply your effect
    gl_FragColor = texel;
}
