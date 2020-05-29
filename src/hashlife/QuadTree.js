export class QuadTreeNode {
    constructor(nw, ne, sw, se) {
        if (ne === undefined) {
            if (typeof nw === 'object') {
                console.error(nw);
                throw new Error('Invalid level 0 node');
            }
            this.population = nw;
            this.level = 0;
            return;
        }

        this.nw = nw;
        this.ne = ne;
        this.sw = sw;
        this.se = se;

        if (this.nw.level !== this.ne.level ||
            this.nw.level !== this.sw.level ||
            this.nw.level !== this.se.level) 
        {
            console.error(this);
            throw new Error(`Nodes of level are not the same: ${this}`);
        }

        this.level = this.nw.level + 1;
        this.population = nw.population + ne.population + sw.population + se.population;
    }

    // factory methods
    // allows for overriding to perform intermediate hashing
    create(nw, ne, sw, se) {
        return new QuadTreeNode(nw, ne, sw, se);
    }

    static bootstrap(alive, level) {
        return new QuadTreeNode(0).create_tree(alive, level);
    }

    create_tree(alive, level) {
        if (level === 0) {
            return this.create(alive);
        }
        let n = this.create_tree(alive, level-1);
        return this.create(n, n, n, n);
    }

    set(x, y, alive) {
        if (this.level === 0) {
            return this.create(alive);
        }
        // quad tree (x, y)
        // centre of quad tree is (0, 0)
        // return a new quad tree at this level
        // consider a 4x4 node (level 2)
        // level 2               level 1             level 0
        //   0 1 2 3          0 1 0 1         - - - -
        // 0 a a b b    ==> 0 a a b b   ==> - a a b b   
        // 1 a a b b        1 a a b b       - a a b b
        // 2 c c d d        0 c c d d       - c c d d
        // 3 c c d d        1 c c d d       - c c d d    

        let offset = 1 << (this.level-1);
        let [nw, ne, sw, se] = [this.nw, this.ne, this.sw, this.se];
        if (x >= offset) {
            // nw
            if (y < offset) {
                nw = this.nw.set(x-offset, y, alive);
            // sw
            } else {
                sw = this.sw.set(x-offset, y-offset, alive);
            }
        } else {
            // ne
            if (y < offset) {
                ne = this.ne.set(x, y, alive);
            // se
            } else {
                se = this.se.set(x, y-offset, alive);
            }
        }

        return this.create(nw, ne, sw, se);
    }

    get(x, y) {
        if (this.level === 0) {
            return this.population;
        }
        let offset = 1 << (this.level-1);
        if (x >= offset) {
            // nw
            if (y < offset) {
                return this.nw.get(x-offset, y);
            // sw
            } else {
                return this.sw.get(x-offset, y-offset);
            }
        } else {
            // ne
            if (y < offset) {
                return this.ne.get(x, y);
            // se
            } else {
                return this.se.get(x, y-offset);
            }
        }
    }

    // create a node one level up, where this node is in the center
    expand() {
        // consider 2x2 case into a 4x4
        // o o o o
        // o x x o
        // o x x o
        // o o o o
        // at level 1 (2x2), we need to generate a border one level down 
        // level 0 (1x1) - pad as border
        let n = this.create_tree(0, this.level-1);
        let nw = this.create(n, n, n, this.nw);
        let ne = this.create(n, n, this.ne, n);
        let sw = this.create(n, this.sw, n, n);
        let se = this.create(this.se, n, n, n);
        let expanded = this.create(nw, ne, sw, se);
        return expanded;
    }
}