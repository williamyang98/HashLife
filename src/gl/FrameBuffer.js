export class FrameBuffer {
    constructor(gl) {
        this.gl = gl;
        this.fb = gl.createFramebuffer();
    }

    attach_texture2D(texture2D) {
        let gl = this.gl;
        let texture = texture2D.texture;
        this.bind();
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        this.unbind();
    }

    bind() {
        let gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
    }

    unbind() {
        let gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

}