import { Buffer } from "./buffer.js";
import { Markers } from "./markers.js";

export class Unit {
    buffer : Buffer;
    markers : Markers;

    static copy(unit : Unit) : Unit {
        const result = new Unit();
        result.buffer = Buffer.copy(unit.buffer);
        result.markers = Markers.copy(unit.markers);
        return result;
    }
}

export class Storage {
    data : Unit[];
    pointer : number;

    __limit : number;

    constructor() {
        this.pointer = -1;
        this.data = [];
        this.__limit = 10;
    }

    undo() : Unit {
        if (this.pointer < 1) return undefined;
        return this.pGet(--this.pointer);
    }

    redo() : Unit {
        if (this.pointer >= this.data.length - 1) return undefined;
        return this.pGet(++this.pointer);
    }

    push(unit : Unit) : void {
        this.pPushBack(Unit.copy(unit));
        if (this.data.length >= this.__limit)
            this.pPopFront();
    }

    private pGet(num : number) : Unit {
        return Unit.copy(this.data[num]);
    }

    private pPushBack(unit : Unit) : void {
        this.data.splice(this.pointer + 1);
        this.data.push(unit);
        ++this.pointer;
    }

    private pPopFront() {
        this.data.splice(0, 1);
        if (this.pointer > -1)
            --this.pointer;
    }
}