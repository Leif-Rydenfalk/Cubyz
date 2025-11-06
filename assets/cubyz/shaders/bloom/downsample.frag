#version 460

layout(location = 0) out vec4 fragColor;
layout(location = 0) in vec2 texCoords;

layout(binding = 0) uniform sampler2D sourceTexture;

layout(location = 0) uniform float brightnessThreshold;
layout(location = 1) uniform int isFirstPass; // 1 for first pass, 0 for others

// A simple 4-tap tent filter for downsampling. Combined with linear hardware filtering,
// this gives a decent cheap blur.
vec3 sampleTex(vec2 uv) {
    vec3 color = texture(sourceTexture, uv).rgb;
    // On the first pass, we extract bright areas.
    if (isFirstPass == 1) {
        // A brightness threshold of 1.0 ensures we only bloom HDR values.
        float brightness = dot(color, vec3(0.2126, 0.7152, 0.0722));
        float factor = smoothstep(brightnessThreshold, brightnessThreshold + 2.0, brightness);
        return color * factor;
    }
    // On subsequent downsamples, we just blur what we already have.
    return color;
}

void main() {
    vec2 texelSize = 1.0 / textureSize(sourceTexture, 0);

    vec3 result = vec3(0.0);
    // 2x2 box blur using hardware bilinear filtering to sample 4 texels at once
    result += sampleTex(texCoords + texelSize * vec2(-0.5, -0.5));
    result += sampleTex(texCoords + texelSize * vec2(0.5, -0.5));
    result += sampleTex(texCoords + texelSize * vec2(-0.5, 0.5));
    result += sampleTex(texCoords + texelSize * vec2(0.5, 0.5));

    fragColor = vec4(result * 0.25, 1.0);
}
