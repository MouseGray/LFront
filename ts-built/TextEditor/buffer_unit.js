import { BufferBase } from "./buffer_base.js";
export class BufferUnit {
    left;
    right;
    joiner;
    constructor(left, right, joiner) {
        this.left = left;
        this.right = right;
        this.joiner = joiner;
    }
    static copy(unit) {
        return new BufferUnit(BufferBase.copy(unit.left), BufferBase.copy(unit.right), unit.joiner);
    }
    data() {
        return this.left.data() + this.joiner + this.right.data();
    }
}
