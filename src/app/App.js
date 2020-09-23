import { Shader } from '../gl/Shader';
import { VertexBufferObject, VertexArrayObject, VertexBufferLayout } from '../gl/VertexBuffer';
import { Uniform } from '../gl/Uniform';
import { IndexBuffer } from '../gl/IndexBuffer';

import basic_shader from '../shaders/basic';
import { Renderer } from '../gl/Renderer';
import { GridRender } from './GridRender';
import { Simulation } from '../hashlife/Simulation';

const quad = {
    vertex_data: new Float32Array([
        -1, -1, 
        -1,  1,
            1, -1,
            1,  1
    ]),
    index_data: new Uint32Array([
        0, 3, 1,
        0, 2, 3,
    ])
};

export class App {
    constructor(gl) {
        this.gl = gl;

        this.renderer = new Renderer(gl);
        this.shader = new Shader(gl, basic_shader.vertex, basic_shader.frag);
        this.shader.add_uniform('uDataTexture', new Uniform(loc => gl.uniform1i(loc, 0)));

        this.vbo = new VertexBufferObject(gl, quad.vertex_data, gl.STATIC_DRAW);
        this.ibo = new IndexBuffer(gl, quad.index_data);
        
        let layout = new VertexBufferLayout(gl);
        layout.push_attribute(0, 2, gl.FLOAT, false);

        this.vao = new VertexArrayObject(gl);
        this.vao.add_vertex_buffer(this.vbo, layout);

        // this.sim = new Simulation(10, true);
        this.sim = new Simulation(10, false);
        // this.sim.randomise(0, 1 << 10, 0, 1 << 10);

        this.grid = new GridRender(gl, this.sim.buffer, this.sim.shape);

        this.steps = 0;

        this.listeners = new Set();
    }

    listen(listener) {
        this.listeners.add(listener);
    }

    notify() {
        for (let listener of this.listeners) {
            listener({steps: this.steps, nodes: this.sim.factory.count});
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
        if (this.running) {
            this.step();
        }
    }

    step() {
        this.sim.step();
        this.steps += 1;
        this.grid.refresh();
        this.notify();
    }

    clear(xstart, xend, ystart, yend) {
        this.sim.clear(xstart, xend, ystart, yend);
        this.steps = 0;
        this.grid.refresh();
        this.notify();
    }

    randomise(xstart, xend, ystart, yend) {
        this.sim.randomise(xstart, xend, ystart, yend);
        this.grid.refresh();
        this.notify();
    }

    on_render() {
        let gl = this.gl;

        this.shader.bind();
        this.vao.bind();
        this.ibo.bind();
        this.grid.bind();

        this.renderer.clear();
        this.renderer.draw(this.vao, this.ibo, this.shader);
        // gl.drawElements(gl.TRIANGLES, this.ibo.count, gl.UNSIGNED_INT, 0);
    }
}

