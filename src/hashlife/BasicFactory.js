export class Node {
    constructor(nw, ne, sw, se) {
        if (ne === undefined) {
            this.population = nw;
            this.level = 0;
            return;
        }

        this.nw = nw;
        this.ne = ne;
        this.sw = sw;
        this.se = se;

        this.level = this.nw.level + 1;
        this.population = nw.population + ne.population + sw.population + se.population;
    }
}

export class BasicFactory {
    // factory methods
    // allows for overriding to perform intermediate hashing
    create(nw, ne, sw, se) {
        return new Node(nw, ne, sw, se);
    }

    create_tree(alive, level) {
        if (level === 0) {
            return this.create(alive);
        }
        let n = this.create_tree(alive, level-1);
        return this.create(n, n, n, n);
    }

    set(node, x, y, alive) {
        if (node.level === 0) {
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

        let offset = 1 << (node.level-1);
        let [nw, ne, sw, se] = [
            node.nw, node.ne, 
            node.sw, node.se];

        if (x >= offset) {
            // nw
            if (y < offset) {
                nw = this.set(nw, x-offset, y, alive);
            // sw
            } else {
                sw = this.set(se, x-offset, y-offset, alive);
            }
        } else {
            // ne
            if (y < offset) {
                ne = this.set(ne, x, y, alive);
            // se
            } else {
                se = this.set(se, x, y-offset, alive);
            }
        }

        return this.create(nw, ne, sw, se);
    }

    get(node, x, y) {
        if (node.level === 0) {
            return node.population;
        }
        let offset = 1 << (node.level-1);
        if (x >= offset) {
            // nw
            if (y < offset) {
                return this.get(node.ne, x-offset, y);
            // sw
            } else {
                return this.get(node.se, x-offset, y-offset);
            }
        } else {
            // ne
            if (y < offset) {
                return this.get(node.nw, x, y);
            // se
            } else {
                return this.get(node.sw, x, y-offset);
            }
        }
    }

    // create a node one level up, where this node is in the center
    expand(node) {
        // consider 2x2 case into a 4x4
        // o o o o
        // o x x o
        // o x x o
        // o o o o
        // at level 1 (2x2), we need to generate a border one level down 
        // level 0 (1x1) - pad as border
        let n = this.create_tree(0, node.level-1);
        let nw = this.create(n, n, n, node.nw);
        let ne = this.create(n, n, node.ne, n);
        let sw = this.create(n, node.sw, n, n);
        let se = this.create(node.se, n, n, n);
        let expanded = this.create(nw, ne, sw, se);
        return expanded;
    }
}