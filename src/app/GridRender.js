import { Texture2D } from '../gl/Texture2D';
import { FrameBuffer } from '../gl/FrameBuffer';

export class GridRender {
    constructor(gl, data, shape) {
        this.gl = gl;

        this.shape = shape;
        this.data = data;
        this.count = shape[0]*shape[1];

        this.data_texture = new Texture2D(gl, this.data, this.shape);
        this.frame_buffer = new FrameBuffer(gl);
        this.frame_buffer.attach_texture2D(this.data_texture);
    }

    refresh() {
        let gl = this.gl;
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.shape[0], this.shape[1], gl.RED, gl.UNSIGNED_BYTE, this.data);
    }

    bind() {
        // this.frame_buffer.bind();
        // this.data_texture.bind();
        // // gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        // // gl.viewport(0, 0, 800, 800);
        // gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
        // // // gl.drawPixels(this.shape[0], this.shape[1], gl.UNSIGNED_BYTE, this.data);
        // this.frame_buffer.unbind();

        this.data_texture.active(0);
    }
}