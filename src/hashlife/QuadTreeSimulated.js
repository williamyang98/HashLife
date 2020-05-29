import { QuadTreeNode } from "./QuadTree";

export class QuadTreeSimulated extends QuadTreeNode {
    constructor(nw, ne, sw, se) {
        super(nw, ne, sw, se);
        this.result = null;
    }

    create(nw, ne, sw, se) {
        return new QuadTreeSimulated(nw, ne, sw, se);
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

    create_center() {
        return this.create(this.nw.se, this.ne.sw, this.sw.ne, this.se.nw);
    }

    // current node can only determine centered subnode 1 level down
    get_next_generation() {
        // if result cached, just send
        if (this.result !== null) {
            return this.result;
        }
        // empty then ignore
        if (this.population === 0) {
            this.result = this.nw;
            return this.result;
        }
        // if at level 2 (4x4), we can perform a the slow simulation
        if (this.level === 2) {
            this.result = this.slow_simulation();
            return this.result;
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
        let n00 = this.nw.get_next_generation(); 
        let n01 = this.create_horizontal(this.nw, this.ne).get_next_generation();
        let n02 = this.ne.get_next_generation(); 

        let n10 = this.create_vertical(this.nw, this.sw).get_next_generation(); 
        let n11 = this.create_center().get_next_generation();
        let n12 = this.create_vertical(this.ne, this.se).get_next_generation(); 

        let n20 = this.sw.get_next_generation(); 
        let n21 = this.create_horizontal(this.sw, this.se).get_next_generation();
        let n22 = this.se.get_next_generation(); 

        // quads from these
        let nw = this.create(n00, n01, n10, n11).get_next_generation();
        let ne = this.create(n01, n02, n11, n12).get_next_generation();
        let sw = this.create(n10, n11, n20, n21).get_next_generation();
        let se = this.create(n11, n12, n21, n22).get_next_generation();

        // stitch results into a central quad
        this.result = this.create(nw, ne, sw, se);
        return this.result;
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
    slow_simulation() {
        let bits = 0;
        // store the 4x4 data inside a 16bit value
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                // bits = (bits << 1) + this.get(x, y);
                bits |= this.get(x, y) << (x + y*4);
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

function debug_out(bits) {
    // store the 4x4 data inside a 16bit value
    let c = [];
    for (let y = 0; y < 4; y++) {
        let r = [];
        for (let x = 0; x < 4; x++) {
            // bits = (bits << 1) + this.get(x, y);
            if (bits & (1 << (x + y*4))) {
                r.push(1);
            } else {
                r.push(0);
            }
        }
        c.push(r.join(','));
    }
    console.log(c.join('\n'));
}

function debug_2x2(node) {
    let c = [];
    let r = [];
    r.push(node.nw.population);
    r.push(node.ne.population);
    c.push(r.join(','));

    r = [];
    r.push(node.sw.population);
    r.push(node.se.population);
    c.push(r.join(','));
    console.log(c.join('\n'));
}


