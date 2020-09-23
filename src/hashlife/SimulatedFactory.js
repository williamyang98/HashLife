import { Node, BasicFactory } from "./BasicFactory";

export class SimulatedNode extends Node {
    constructor(nw, ne, sw, se) {
        super(nw, ne, sw, se);
        this.result = null;
    }
}

export class SimulatedFactory extends BasicFactory {
    constructor(time_compression) {
        super();
        this.time_compression = time_compression;
    }

    create(nw, ne, sw, se) {
        return SimulatedNode(nw, ne, sw, se);
    }

    create_horizontal(west, east) {
        //  1 1 1 1 2 2 2 2
        //  1 1 1 1 2 2 2 2
        //  1 1 1 1 2 2 2 2
        //  1 1 1 1 2 2 2 2
        return this.create(west.ne, east.nw, west.se, east.sw);
    }

    create_vertical(north, south) {
        // 1 1 1 1
        // 1 1 1 1
        // 1 1 1 1
        // 1 1 1 1
        // 2 2 2 2
        // 2 2 2 2
        // 2 2 2 2
        // 2 2 2 2
        return this.create(north.sw, north.se, south.nw, south.ne);
    }

    create_center(node) {
        return this.create(
            node.nw.se, node.ne.sw, 
            node.sw.ne, node.se.nw);
    }

    // current node can only determine centered subnode 1 level down
    get_next_generation(node) {
        // if result cached, just send
        if (node.result !== null) {
            return node.result;
        }
        // empty then ignore
        if (node.population === 0) {
            node.result = node.nw;
            return node.result;
        }
        // if at level 2 (4x4), we can perform a the slow simulation
        if (node.level === 2) {
            node.result = this.slow_simulation(node);
            return node.result;
        }
        // consider a level 3 node
        // this would be 8x8
        // we want to return a level 2 node centred
        // this would be 4x4
        //    0 1 2 3 | 4 5 6 7
        //
        // 0  o o o o | o o o o
        // 1  o 1 1 2 | 2 3 3 o
        // 2  o 1 1 2 | 2 3 3 o
        // 3  o 4 4 5 | 5 6 6 o
        //    --------|--------
        // 4  o 4 4 5 | 5 6 6 o
        // 5  o 7 7 8 | 8 9 9 o
        // 6  o 7 7 8 | 8 9 9 o
        // 7  o o o o | o o o o
        // 
        // we get the 9 (2x2) matrixes and iterate one generation
        // we get the results from these matrixes, and cluster then into 4 4x2 matrixes
        // we get iterate on generation forward
        //    0 1 2 3 | 4 5 6 7
        //
        // 0  o o o o | o o o o
        // 1  o o o o | o o o o
        // 2  o o 1 1 | 2 2 o o
        // 3  o o 1 1 | 2 2 o o
        //    --------|--------
        // 4  o o 3 3 | 4 4 o o
        // 5  o o 3 3 | 4 4 o o
        // 6  o o o o | o o o o
        // 7  o o o o | o o o o
        // we combine these matrixes and get one generation ahead once more
        // this gives us an output matrix that is 3 generations ahead
        // label these matrixes as
        //   0 1 2
        // 0 x x x
        // 1 x x x
        // 2 x x x
        let n00 = node.nw; 
        let n01 = this.create_horizontal(node.nw, node.ne);
        let n02 = node.ne; 

        let n10 = this.create_vertical(node.nw, node.sw); 
        let n11 = this.create_center(node);
        let n12 = this.create_vertical(node.ne, node.se); 

        let n20 = node.sw; 
        let n21 = this.create_horizontal(node.sw, node.se);
        let n22 = node.se; 

        // temporal compression
        if (this.time_compression) {
            n00 = this.get_next_generation(n00);
            n01 = this.get_next_generation(n01);
            n02 = this.get_next_generation(n02);
            n10 = this.get_next_generation(n10);
            n11 = this.get_next_generation(n11);
            n12 = this.get_next_generation(n12);
            n20 = this.get_next_generation(n20);
            n21 = this.get_next_generation(n21);
            n22 = this.get_next_generation(n22);
        } else {
            n00 = this.create_center(n00);
            n01 = this.create_center(n01);
            n02 = this.create_center(n02);
            n10 = this.create_center(n10);
            n11 = this.create_center(n11);
            n12 = this.create_center(n12);
            n20 = this.create_center(n20);
            n21 = this.create_center(n21);
            n22 = this.create_center(n22);
        }

        // quads from these
        let nw = this.create(n00, n01, n10, n11);
        let ne = this.create(n01, n02, n11, n12);
        let sw = this.create(n10, n11, n20, n21);
        let se = this.create(n11, n12, n21, n22);

        nw = this.get_next_generation(nw);
        ne = this.get_next_generation(ne);
        sw = this.get_next_generation(sw);
        se = this.get_next_generation(se);

        // stitch results into a central quad
        node.result = this.create(nw, ne, sw, se);
        return node.result;
    }

    // take in a 4x4 node
    // return the centered 2x2 node one generation ahead
    // get next state of 5th cell
    // this would be (x, y) = (2, 2)
    //      0  1  2  3
    //   | -----------
    // 0 |  0  1  2  3  
    // 1 |  4  5  6  7
    // 2 |  8  9 10 11
    // 3 | 12 13 14 15
    // we only consider centre (2x2)
    // this would be bits 10, 9, 6, 5
    slow_simulation(node) {
        let bits = 0;
        // store the 4x4 data inside a 16bit value
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                // bits = (bits << 1) + this.get(x, y);
                bits |= this.get(node, x, y) << (x + y*4);
            }
        }
        // debug_out(bits);
        let nw = this.create(this.one_generation(bits >> 0)); // bit 10
        let ne = this.create(this.one_generation(bits >> 1)); // bit 9
        let sw = this.create(this.one_generation(bits >> 4)); // bit 6
        let se = this.create(this.one_generation(bits >> 5)); // bit 5
        let res = this.create(nw, ne, sw, se);
        // debug_2x2(res);
        return res;
    }

    // we make the assumption that the cell we calculate is bit 5
    // we ignore the following bits
    // 0000 0111 0101 0111
    // 0x0757
    one_generation(bits) {
        if (bits === 0) 
            return 0;

        let self = (bits >> 5) & 1;
        bits &= 0x757;
        let neighbours = 0;
        while (bits !== 0) {
            neighbours++;
            // max of 8 neighbours
            // b-1            => b & (b-1) 
            //                   0111 0101 0111
            // 0111 0101 0110 => 0111 0101 0110
            // 0111 0101 0101 => 0111 0101 0100
            // 0111 0101 0011 => 0111 0101 0000
            // 0111 0100 1111 => 0111 0100 0000
            // etc
            bits &= bits-1; // remove last bit
        }
        if (neighbours === 3 || (neighbours === 2 && self !== 0)) {
            return 1;
        } else {
            return 0;
        }
    }
}