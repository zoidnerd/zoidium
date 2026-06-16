precision highp float;
precision highp int;

uniform sampler2D tDiffuse;
uniform vec2 uvScale;
uniform vec2 resolution;
uniform float strength;

varying vec2 vUv;

void main()
{
    vec4 texel = texture2D(tDiffuse, vUv * uvScale);
    float luma = dot(texel.rgb, vec3(0.299, 0.587, 0.114));
    vec3 sepia = vec3(
        luma * 1.07 + 0.05,
        luma * 0.88 + 0.02,
        luma * 0.66 - 0.04
    );
    gl_FragColor = vec4(mix(texel.rgb, sepia, strength), texel.a);
}
