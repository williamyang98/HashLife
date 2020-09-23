// import { HashLifeNode } from "./HashLife";
import { HashedFactory } from "./HashedFactory";

export class Simulation {
    constructor(initial_level=3, time_compression=false) {
        this.factory = new HashedFactory(time_compression);
        this.root = this.factory.create_tree(0, initial_level);
        this.construct_buffer(initial_level);
    }

    construct_buffer(level) {
        let dim = (1 << level);
        this.shape = [dim, dim];
        this.count = dim*dim;
        this.buffer = new Uint8Array(this.count);
    }

    randomise(xstart, xend, ystart, yend) {
        if (xstart === undefined) {
            xstart = 0;
            ystart = 0;
            xend = 1 << this.root.level;
            yend = 1 << this.root.level;
        }
        let root = this.randomise_recursive(this.root, xstart, xend, ystart, yend);
        if (root !== this.root) {
            this.update_buffer(root);
        }
        this.root = root;
    }

    clear(xstart, xend, ystart, yend) {
        if (xstart === undefined) {
            xstart = 0;
            ystart = 0;
            xend = 1 << this.root.level;
            yend = 1 << this.root.level;
        }
        let root = this.fill_recursive(this.root, 0, xstart, xend, ystart, yend);
        if (root !== this.root) {
            this.update_buffer(root);
        }
        this.root = root;
    }

    fill_recursive(node, state, xstart, xend, ystart, yend, xoff=0, yoff=0) {
        let offset = 1 << (node.level-1);
        let dim = 1 << node.level;
        // ignore
        if (xstart >= dim || ystart >= dim || xend < 0 || yend < 0) {
            return node;
        }
        // single level
        if (node.level === 0) {
            return this.factory.create(state);
        }
        // randomise
        let nw = this.fill_recursive(node.nw, state, xstart               , min(xend, offset-1), ystart               , min(yend, offset-1), xoff       , yoff);
        let ne = this.fill_recursive(node.ne, state, max(0, xstart-offset), xend-offset        , ystart               , min(yend, offset-1), xoff+offset, yoff);
        let sw = this.fill_recursive(node.sw, state, xstart               , min(xend, offset-1), max(0, ystart-offset), yend-offset        , xoff       , yoff+offset);
        let se = this.fill_recursive(node.se, state, max(0, xstart-offset), xend-offset        , max(0, ystart-offset), yend-offset        , xoff+offset, yoff+offset);
        let other = this.factory.create(nw, ne, sw, se);
        return other;
    }

    randomise_recursive(node, xstart, xend, ystart, yend, xoff=0, yoff=0) {
        let offset = 1 << (node.level-1);
        let dim = 1 << node.level;
        // ignore
        if (xstart >= dim || ystart >= dim || xend < 0 || yend < 0) {
            return node;
        }
        // single level
        if (node.level === 0) {
            let state = (Math.random() > 0.5) ? 1 : 0;
            return this.factory.create(state);
        }
        // randomise
        let nw = this.randomise_recursive(node.nw, xstart               , min(xend, offset-1), ystart               , min(yend, offset-1), xoff       , yoff);
        let ne = this.randomise_recursive(node.ne, max(0, xstart-offset), xend-offset        , ystart               , min(yend, offset-1), xoff+offset, yoff);
        let sw = this.randomise_recursive(node.sw, xstart               , min(xend, offset-1), max(0, ystart-offset), yend-offset        , xoff       , yoff+offset);
        let se = this.randomise_recursive(node.se, max(0, xstart-offset), xend-offset        , max(0, ystart-offset), yend-offset        , xoff+offset, yoff+offset);
        let other = this.factory.create(nw, ne, sw, se);
        return other;
    }

    step() {
        let root = undefined;
        if (this.root.level >= 8) {
            root = this.wrapped_step(this.root);
        } else {
            root = this.expanding_step(this.root); 
        }

        // this.expanding_step(); 
        if (this.root !== root) {
            this.update_buffer(root);
        }
        this.root = root;
    }

    expanding_step(root) {
        while (true) {
            let [nw, ne, sw, se] = [root.nw, root.ne, root.sw, root.se];
            if (root.level < 3 ||
                nw.population !== nw.se.se.population ||
                ne.population !== ne.sw.sw.population ||
                sw.population !== sw.ne.ne.population ||
                se.population !== se.nw.nw.population)
            {
                root = this.factory.expand(root);
            } else {
                break;
            }
        }
        return this.factory.get_next_generation(root);
    }

    wrapped_step(root) {
        let center = this.factory.get_next_generation(root);
        let horizontal = this.factory.create(root.ne, root.nw, root.se, root.sw);
        let vertical = this.factory.create(root.sw, root.se, root.nw, root.ne);
        let corner = this.factory.create(root.se, root.sw, root.ne, root.nw);

        horizontal = this.factory.get_next_generation(horizontal);
        vertical = this.factory.get_next_generation(vertical);
        corner = this.factory.get_next_generation(corner);

        let nw = this.factory.create(corner.se, vertical.sw, horizontal.ne, center.nw);
        let ne = this.factory.create(vertical.se, corner.sw, center.ne, horizontal.nw);
        let sw = this.factory.create(horizontal.se, center.sw, corner.ne, vertical.nw);
        let se = this.factory.create(center.se, horizontal.sw, vertical.ne, corner.nw);

        return this.factory.create(nw, ne, sw, se);
    }

    update_buffer(root) {
        // this.construct_buffer();
        this.draw_recursive(root, this.buffer, this.shape, 0, this.shape[0], 0, this.shape[1]);
    }

    draw_recursive(node, buffer, shape, xstart, xend, ystart, yend, xoff=0, yoff=0) {
        // determine which rects to draw to
        let offset = 1 << (node.level-1);
        let dim = 1 << node.level;
        // console.log(`level=${node.level}, xoff=${xoff}, yoff=${yoff}, x=${xstart}...${xend}, y=${ystart}...${yend}`);
        // ignore
        if (xstart >= dim || ystart >= dim || xend < 0 || yend < 0) {
            return;
        }
        // at base case we expect (x, y) of where to draw the pixel
        // xtart, ystart, xend, yend determine where we write to the buffer
        if (node.level === 0) {
            let state = node.population > 0 ? 255 : 0;
            buffer[(xoff+xstart) + (yoff+ystart)*shape[0]] = state;
            return;
        }

        this.draw_recursive(node.nw, buffer, shape, xstart               , min(xend, offset-1), ystart               , min(yend, offset-1), xoff       , yoff);
        this.draw_recursive(node.ne, buffer, shape, max(0, xstart-offset), xend-offset        , ystart               , min(yend, offset-1), xoff+offset, yoff);
        this.draw_recursive(node.sw, buffer, shape, xstart               , min(xend, offset-1), max(0, ystart-offset), yend-offset        , xoff       , yoff+offset);
        this.draw_recursive(node.se, buffer, shape, max(0, xstart-offset), xend-offset        , max(0, ystart-offset), yend-offset        , xoff+offset, yoff+offset);
    }
}

function min(x, y) {
    if (x >= y) return y;
    return x;
}

function max(x, y) {
    if (x >= y) return x;
    return y;
}