import { strutils } from "./string_utils.js";
export class BufferBase {
    __data;
    constructor(text = '') {
        this.__data = text;
    }
    static copy(buffer) {
        return new BufferBase(buffer.__data);
    }
    data() {
        return this.__data;
    }
    set(text) {
        this.__data = text;
    }
    insert(text, pos) {
        this.__data = strutils.insert(this.__data, pos, text);
    }
    erase(begin, end) {
        this.__data = strutils.erase(this.__data, begin, end);
    }
    subdata(begin = undefined, end = undefined) {
        if (begin === undefined)
            return this.__data;
        strutils.stringValidation(this.__data, begin);
        if (end === undefined)
            return this.__data.substring(begin);
        strutils.stringValidation(this.__data, end);
        return this.__data.substring(begin, end);
    }
}
