import { copyArray } from "../Utils/utils.js";

export class MarkersBase {
    __data : number[][];

    constructor(data : number[][] = [[], [], [], [], []]) {
        this.__data = data;
    }
    static copy(markers : MarkersBase) : MarkersBase {
        const result = new MarkersBase();
        result.__data = copyArray(markers.__data);
        return result;
    }
    data() : number[][] {
        return this.__data;
    }
    set(data : number[][]) {
        this.__data = data;
    }
    get(no : number) {
        if (no < 0 || this.__data.length <= no) 
            throw Error('Invalid marker number');
        return this.__data[no];
    }
}