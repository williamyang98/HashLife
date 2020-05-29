import { QuadTreeSimulated } from "./QuadTreeSimulated";

class HashMap {
    constructor() {
        this.map = {};
    }

    put(key, item) {
        let entries = this.map[key];
        if (entries === undefined) {
            this.map[key] = [item];
            return item;
        }
        for (let entry of entries) {
            if (entry.equals(item)) {
                return entry;
            }
        }
        entries.push(item);
        return item;
    }
}

export class HashLifeNode extends QuadTreeSimulated {
    static HashedNodes = new HashMap();
    static CurrentID = 101;

    constructor(nw, ne, sw, se) {
        super(nw, ne, sw, se);
        this.address = HashLifeNode.generate_id();
    }

    equals(n) {
        if (n.level !== this.level) {
            return false;
        }
        if (n.level === 0) {
            return n.population === this.population;
        }
        return (
            n.nw === this.nw &&
            n.ne === this.ne &&
            n.sw === this.sw &&
            n.se === this.se
        );
    }

    hash_code() {
        if (this.level === 0) {
            return this.population;
        } 
        return this.nw.address +
            11 * this.ne.address + 
            101 * this.sw.address +
            1007 * this.se.address;
    }

    // get random number
    static generate_id() {
        let id = HashLifeNode.CurrentID;
        HashLifeNode.CurrentID += 7;
        return id;
    }

    static put_default_node(node) {
        let key = node.hash_code();
        let stored = HashLifeNode.HashedNodes.put(key, node);
        if (!node.equals(stored)) {
            console.error('Bad entries');
            console.error(stored, stored.hash_code());
            console.error(node, node.hash_code());
            throw new Error('Mismatch in hash list');
        }
        return stored;
    }

    // override factory method by adding a hash
    create(nw, ne, sw, se) {
        let node = new HashLifeNode(nw, ne, sw, se);
        node = HashLifeNode.put_default_node(node);
        return node;
    }

    static bootstrap(alive, level) {
        return new HashLifeNode(0).create_tree(alive, level);
    }
}

