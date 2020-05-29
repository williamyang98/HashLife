import { HashLifeNode } from "./HashLife";

export class Simulation {
    constructor(initial_level=3) {
        this.root = HashLifeNode.bootstrap(0, initial_level);
        this.construct_buffer();
    }

    construct_buffer() {
        if (this.root.level === this.current_level) {
            return;
        }
        this.current_level = this.root.level;
        let dim = (1 << this.root.level);
        this.shape = [dim, dim];
        this.count = dim*dim; 
        this.buffer = new Uint8Array(this.count);
    }

    randomise() {
        let dim = (1 << this.root.level);
        // randomise abit
        for (let x = 0; x < dim; x++) {
            for (let y = 0; y < dim; y++) {
                let state = (Math.random() > 0.5) ? 1 : 0;
                if (state) {
                    this.root = this.root.set(x, y, 1);
                }
            }
        }
    }

    step() {
        if (this.root.level >= 9) {
            this.wrapped_step();
        } else {
            this.expanding_step(); 
        }
        this.update_buffer();
    }

    expanding_step() {
        while (true) {
            let root = this.root;
            let [nw, ne, sw, se] = [root.nw, root.ne, root.sw, root.se];
            if (root.level < 3 ||
                nw.population !== nw.se.se.population ||
                ne.population !== ne.sw.sw.population ||
                sw.population !== sw.ne.ne.population ||
                se.population !== se.nw.nw.population)
            {
                this.root = this.root.expand();
            } else {
                break;
            }
        }
        this.root = this.root.get_next_generation();
    }

    wrapped_step() {
        let orig = this.root;
        let center = this.root.get_next_generation();
        let horizontal = orig.create(orig.ne, orig.nw, orig.se, orig.sw).get_next_generation();
        let vertical = orig.create(orig.sw, orig.se, orig.nw, orig.ne).get_next_generation();
        let corner = orig.create(orig.se, orig.sw, orig.ne, orig.nw).get_next_generation();

        let nw = orig.create(corner.se, vertical.sw, horizontal.ne, center.nw);
        let ne = orig.create(vertical.se, corner.sw, center.ne, horizontal.nw);
        let sw = orig.create(horizontal.se, center.sw, corner.ne, vertical.nw);
        let se = orig.create(center.se, horizontal.sw, vertical.ne, corner.nw);

        let root = orig.create(nw, ne, sw, se);
        this.root = root;
    }

    update_buffer() {
        this.construct_buffer();
        this.draw_recursive(this.root, 0, 0);
    }

    draw_recursive(node, xoff, yoff) {
        if (node.level === 0) {
            this.buffer[xoff + yoff*this.shape[0]] = node.population ? 0 : 255;
            return;
        }
        let offset = 1 << (node.level-1);
        this.draw_recursive(node.nw, xoff       , yoff);
        this.draw_recursive(node.ne, xoff+offset, yoff);
        this.draw_recursive(node.sw, xoff       , yoff+offset);
        this.draw_recursive(node.se, xoff+offset, yoff+offset);
    }
}