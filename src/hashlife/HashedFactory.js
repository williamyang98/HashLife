import { SimulatedNode, SimulatedFactory } from './SimulatedFactory';

class HashedNode extends SimulatedNode {
    static CurrentID = 101;
    constructor(nw, ne, sw, se) {
        super(nw, ne, sw, se);
        this.address = HashedNode.generate_id();
    }

    static generate_id() {
        let id = HashedNode.CurrentID;
        HashedNode.CurrentID += 7;
        return id;
    }
    
    // equality check for map
    equals(nw, ne, sw, se) {
        // level 0
        if (ne === undefined) {
            let population = nw;
            return (this.level === 0 && this.population === population);
        }
        // quick level check
        if (nw.level !== this.level-1) {
            return false;
        }
        // Check if neighbours are all the same
        return (
            nw === this.nw &&
            ne === this.ne &&
            sw === this.sw &&
            se === this.se
        );
    }
}

export class HashedFactory extends SimulatedFactory {
    constructor(time_compression) {
        super(time_compression);
        this.map = {};
        this.hits = 0;
        this.misses = 0;
        this.count = 0;
    }

    // override creation
    // use hashmap (this is the basis for hashlife)
    // we use recursive algorithms specifically for better hashing
    create(nw, ne, sw, se) {
        let key = this.hash_code(nw, ne, sw, se);
        let nodes = this.map[key];

        if (nodes == undefined) {
            let node = new HashedNode(nw, ne, sw, se);
            this.map[key] = [node];
            this.misses += 1;
            this.count += 1;
            return node;
        }

        for (let node of nodes) {
            if (node.equals(nw, ne, sw, se)) {
                this.hits += 1;
                return node;
            }
        }

        this.misses += 1;
        this.count += 1;
        let node = new HashedNode(nw, ne, sw, se);
        nodes.push(node);
        return node;
    }


    clear() {
        this.map = {};
    }

    hash_code(nw, ne, sw, se) {
        // level 0
        if (ne === undefined) {
            let population = nw;
            return population;
        } 
        // other levels
        return nw.address +
            11 * ne.address + 
            101 * sw.address +
            1007 * se.address;
    }
}