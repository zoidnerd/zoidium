precision highp float;
precision highp int;

uniform sampler2D tDiffuse;
uniform vec2 uvScale;
uniform vec2 resolution;

uniform vec3 lightColor;
uniform vec3 shadowColor;
uniform float lightAngle;
uniform float bevelRadius;
uniform float intensity;
uniform float shadowAmount;

varying vec2 vUvScaled;

float alphaAt(vec2 uv) {
    return texture2D(tDiffuse, uv).a;
}

void main() {
    vec2 uv = vUvScaled;
    vec4 texel = texture2D(tDiffuse, uv);

    if (texel.a < 0.01) {
        gl_FragColor = texel;
        return;
    }

    vec2 px = uvScale / resolution;
    float r = max(bevelRadius, 1.0);

    float rad = radians(lightAngle);
    vec2 lightDir = vec2(cos(rad), sin(rad));

    // Average alpha along +lightDir and -lightDir over the bevel radius.
    // avgPlus : mean alpha when stepping toward the light source.
    // avgMinus: mean alpha when stepping away from the light source.
    // When the nearest edge sits in the +lightDir direction (between us and
    // the light), avgPlus drops while avgMinus stays at 1, giving a positive
    // "lit" value. The further we are from the edge, the closer both
    // averages get to 1, so the lit value smoothly approaches 0.
    const int N = 10;
    float sumPlus = 0.0;
    float sumMinus = 0.0;

    for (int i = 0; i < N; i++) {
        float t = (float(i) + 0.5) / float(N);
        vec2 offset = lightDir * t * r * px;
        sumPlus  += alphaAt(uv + offset);
        sumMinus += alphaAt(uv - offset);
    }

    float avgPlus  = sumPlus  / float(N);
    float avgMinus = sumMinus / float(N);

    float lit = avgMinus - avgPlus;

    vec3 baseColor = texel.rgb;
    vec3 finalColor;

    if (lit >= 0.0) {
        finalColor = mix(baseColor, lightColor, lit * intensity);
    } else {
        finalColor = mix(baseColor, shadowColor, -lit * intensity * shadowAmount);
    }

    gl_FragColor = vec4(finalColor, texel.a);
}