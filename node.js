NodeType = {
    number : 0,
    variable : 1,
    operation : 2,
    undefined : 3
}

export class Node {
    constructor(type, value) {
        this.type = type;
        this.value = value;
        this.sub_nodes = [];
        this.positions = [];
    }
    addPositions(arr) {
        this.positions = this.positions.concat(arr);
    }
    attach(node) {
        this.sub_nodes.push(node);
    }
}