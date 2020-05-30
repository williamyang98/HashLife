import { QuadTreeSimulated } from "./QuadTreeSimulated";

class HashMap {
    constructor() {
        this.map = {};
        this.hits = 0;
        this.misses = 0;
        this.count = 0;
        console.log(this);
    }

    clear() {
        this.map = {};
    }

    put(key, nw, ne, sw, se, time_compression) {
        let entries = this.map[key];
        if (entries === undefined) {
            let item = new HashLifeNode(nw, ne, sw, se, time_compression);
            this.map[key] = [item];
            this.misses += 1;
            this.count += 1;
            return item;
        }
        for (let entry of entries) {
            if (entry.equals(nw, ne, sw, se, time_compression)) {
                this.hits += 1;
                return entry;
            }
        }
        this.misses += 1;
        this.count += 1;
        let item = new HashLifeNode(nw, ne, sw, se, time_compression);
        entries.push(item);
        return item;
    }
}

export class HashLifeNode extends QuadTreeSimulated {
    static HashedNodes = new HashMap();
    static CurrentID = 101;

    constructor(nw, ne, sw, se, time_compression=false) {
        super(nw, ne, sw, se, time_compression);
        this.address = HashLifeNode.generate_id();
    }

    equals(nw, ne, sw, se, time_compression) {
        // level 0
        if (ne === undefined) {
            let population = nw;
            return (this.level === 0 && this.population === population);
        }
        // If other levels
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

    static hash_code(nw, ne, sw, se, time_compression) {
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

    // get random number
    static generate_id() {
        let id = HashLifeNode.CurrentID;
        HashLifeNode.CurrentID += 7;
        return id;
    }

    static put_default_node(nw, ne, sw, se, time_compression) {
        let key = HashLifeNode.hash_code(nw, ne, sw, se, time_compression);
        let stored = HashLifeNode.HashedNodes.put(key, nw, ne, sw, se, time_compression);
        return stored;
    }

    // override factory method by adding a hash
    create(nw, ne, sw, se) {
        let node = HashLifeNode.put_default_node(nw, ne, sw, se, this.time_compression);
        return node;
    }

    // override default tree creation to include time compression
    create_tree(alive, level) {
        if (level === 0) {
            return this.create(alive, undefined, undefined, undefined);
        }
        let n = this.create_tree(alive, level-1);
        return this.create(n, n, n, n);
    }

    static bootstrap(alive, level, time_compression=false) {
        return new HashLifeNode(0, undefined, undefined, undefined, time_compression).create_tree(alive, level);
    }
}

