import { Buffer } from "./buffer.js";
import { Markers } from "./markers.js";
export class Unit {
    buffer;
    markers;
    static copy(unit) {
        const result = new Unit();
        result.buffer = Buffer.copy(unit.buffer);
        result.markers = Markers.copy(unit.markers);
        return result;
    }
}
export class Storage {
    data;
    pointer;
    __limit;
    constructor() {
        this.pointer = -1;
        this.data = [];
        this.__limit = 10;
    }
    undo() {
        if (this.pointer < 1)
            return undefined;
        return this.pGet(--this.pointer);
    }
    redo() {
        if (this.pointer >= this.data.length - 1)
            return undefined;
        return this.pGet(++this.pointer);
    }
    push(unit) {
        this.pPushBack(Unit.copy(unit));
        if (this.data.length >= this.__limit)
            this.pPopFront();
    }
    pGet(num) {
        return Unit.copy(this.data[num]);
    }
    pPushBack(unit) {
        this.data.splice(this.pointer + 1);
        this.data.push(unit);
        ++this.pointer;
    }
    pPopFront() {
        this.data.splice(0, 1);
        if (this.pointer > -1)
            --this.pointer;
    }
}
