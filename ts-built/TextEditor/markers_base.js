import { copyArray } from "../Utils/utils.js";
export class MarkersBase {
    __data;
    constructor(data = [[], [], [], [], []]) {
        this.__data = data;
    }
    static copy(markers) {
        const result = new MarkersBase();
        result.__data = copyArray(markers.__data);
        return result;
    }
    data() {
        return this.__data;
    }
    set(data) {
        this.__data = data;
    }
    get(no) {
        if (no < 0 || this.__data.length <= no)
            throw Error('Invalid marker number');
        return this.__data[no];
    }
}
