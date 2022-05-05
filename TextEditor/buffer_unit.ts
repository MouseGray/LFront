import { BufferBase } from "./buffer_base.js";

export class BufferUnit {
    left : BufferBase;
    right : BufferBase;
    joiner : string;

    constructor(left : BufferBase, right : BufferBase, joiner : string) {
        this.left = left;
        this.right = right;
        this.joiner = joiner;
    }
    static copy(unit : BufferUnit) : BufferUnit {
        return new BufferUnit(BufferBase.copy(unit.left), 
            BufferBase.copy(unit.right), 
            unit.joiner);
    }
    data() : string {
        return this.left.data() + this.joiner + this.right.data();
    }
}