import { strutils } from "./string_utils.js";

export class BufferBase {
    __data : string;
    constructor(text : string = '') {
        this.__data = text;
    }
    static copy(buffer : BufferBase) : BufferBase {
        return new BufferBase(buffer.__data);
    }
    data() : string {
        return this.__data;
    }
    set(text : string) : void {
        this.__data = text;
    }
    insert(text : string, pos : number) : void {
        this.__data = strutils.insert(this.__data, pos, text);
    }
    erase(begin : number, end : number) : void {
        this.__data = strutils.erase(this.__data, begin, end);
    }
    subdata(begin : number = undefined, end : number = undefined) : string {
        if (begin === undefined) return this.__data;
        strutils.stringValidation(this.__data, begin);
        if (end === undefined) return this.__data.substring(begin);
        strutils.stringValidation(this.__data, end);
        return this.__data.substring(begin, end);
    }
}