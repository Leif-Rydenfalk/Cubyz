#version 460

layout(location = 0) out vec4 fragColor;
layout(location = 0) in vec2 texCoords;

// The smaller, blurrier texture from the previous upsample step
layout(binding = 0) uniform sampler2D lowerResTexture;
// The texture from the downsample chain at this same resolution
layout(binding = 1) uniform sampler2D higherResTexture;

void main() {
    vec3 lowerResColor = texture(lowerResTexture, texCoords).rgb;
    vec3 higherResColor = texture(higherResTexture, texCoords).rgb;

    // Additive blending: combine the upsampled result with the next mip in the chain
    fragColor = vec4(lowerResColor + higherResColor, 1.0);
}
