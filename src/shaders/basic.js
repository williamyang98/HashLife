const vertex = 
`#version 300 es
precision mediump float;

in vec2 position;

out vec2 vPosition;

void main() {
    vPosition = position;
    gl_Position = vec4(position.x, position.y, 0.0, 1.0);
}`;

const frag = 
`#version 300 es
precision mediump float;
precision highp sampler2D;

in vec2 vPosition;

out vec4 FragColour;

uniform sampler2D uDataTexture;

void main() {
    vec4 cell = texture(uDataTexture, vPosition);
    float state = cell[0];
    FragColour = vec4(state, state, state, 1.0);
    // FragColour = vec4(vPosition.x, vPosition.y, 1.0, 1.0);
}`;

export default {vertex: vertex, frag: frag};