import { Shader } from '../gl/Shader';
import { VertexBufferObject, VertexArrayObject, VertexBufferLayout } from '../gl/VertexBuffer';
import { Uniform } from '../gl/Uniform';
import { IndexBuffer } from '../gl/IndexBuffer';

import basic_shader from '../shaders/basic';
import { Renderer } from '../gl/Renderer';
import { Texture2D } from '../gl/Texture2D';
import { FrameBuffer } from '../gl/FrameBuffer';

export class App {
    constructor(gl) {
        this.gl = gl;

        // gl.enable(gl.DEPTH_TEST);
        // gl.enable(gl.BLEND);

        this.renderer = new Renderer(gl);
        this.shader = new Shader(gl, basic_shader.vertex, basic_shader.frag);
        this.shader.add_uniform('uDataTexture', new Uniform(loc => gl.uniform1i(loc, 0)));

        let rect_data = new Float32Array([
            -1, -1, 
            -1,  1,
             1, -1,
             1,  1
        ]);

        let index_data = new Uint32Array([
            0, 3, 1,
            0, 2, 3,
        ]);

        this.vbo = new VertexBufferObject(gl, rect_data, gl.STATIC_DRAW);
        this.ibo = new IndexBuffer(gl, index_data);
        
        let layout = new VertexBufferLayout(gl);
        layout.push_attribute(0, 2, gl.FLOAT, false);

        this.vao = new VertexArrayObject(gl);
        this.vao.add_vertex_buffer(this.vbo, layout);

        this.create_data();
    }

    create_data() {
        let gl = this.gl;

        this.shape = [100, 100];
        this.data = new Uint8Array(this.shape[0]*this.shape[1]);
        this.randomise_data();


        this.data_texture = new Texture2D(gl, this.data, this.shape);
        this.frame_buffer = new FrameBuffer(gl);
        this.frame_buffer.attach_texture2D(this.data_texture);
    }

    randomise_data() {
        for (let i = 0; i < this.data.length; i++) {
            this.data[i] = (Math.random() > 0.5) ? 255 : 0;
        }
    }

    run() {
        requestAnimationFrame(this.loop.bind(this));
    }

    loop() {
        this.on_update();
        this.on_render();
        requestAnimationFrame(this.loop.bind(this));
    }

    on_update() {
        this.randomise_data();
    }

    on_render() {
        let gl = this.gl;
        // this.frame_buffer.bind();
        // this.data_texture.bind();
        // // gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        // // gl.viewport(0, 0, 800, 800);
        // gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
        // // // gl.drawPixels(this.shape[0], this.shape[1], gl.UNSIGNED_BYTE, this.data);
        // this.frame_buffer.unbind();

        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.shape[0], this.shape[1], gl.RED, gl.UNSIGNED_BYTE, this.data);


        this.shader.bind();
        this.vao.bind();
        this.ibo.bind();
        this.data_texture.active(0);

        this.renderer.clear();
        this.renderer.draw(this.vao, this.ibo, this.shader);
        // gl.drawElements(gl.TRIANGLES, this.ibo.count, gl.UNSIGNED_INT, 0);
    }
}