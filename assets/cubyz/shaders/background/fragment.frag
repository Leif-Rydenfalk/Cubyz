#version 460

layout(location = 0) out vec4 fragColor;

layout(location = 0) in vec2 outTexCoords;

layout(binding = 0) uniform sampler2D image;

// ACES tone mapping curve fit to go from HDR to LDR
// https://knarkowicz.wordpress.com/2016/01/06/aces-filmic-tone-mapping-curve/
vec3 ACESFilm(vec3 x)
{
    float a = 2.51f;
    float b = 0.03f;
    float c = 2.43f;
    float d = 0.59f;
    float e = 0.14f;
    return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0f, 1.0f);
}

void main() {
    fragColor = texture(image, outTexCoords);
    fragColor.rgb = pow(fragColor.rgb * 1.6, vec3(2.0));
    fragColor.rgb = ACESFilm(fragColor.rgb * 1.0);
}
