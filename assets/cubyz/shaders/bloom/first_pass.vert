#version 460

layout(location = 0) in vec2 inTexCoords;

layout(location = 0) out vec2 texCoords;

void main() {
    texCoords = inTexCoords;
    gl_Position = vec4(inTexCoords * 2.0 - 1.0, 0.0, 1.0);
}
