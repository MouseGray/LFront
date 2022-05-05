import { BufferBase } from "./buffer_base.js";
import { Caret } from "./caret.js";
import { charCount, findOverlineEnd, validationStringIndex, validationStringRange } from "./utils.js";
export class Buffer extends BufferBase {
    caret;
    inserted_callback;
    erased_callback;
    constructor(inserted_callback = undefined, erased_callback = undefined) {
        super('');
        this.caret = new Caret();
        this.inserted_callback = inserted_callback;
        this.erased_callback = erased_callback;
    }
    static copy(buffer) {
        const result = new Buffer();
        result.set(buffer.data());
        result.caret = Caret.copy(buffer.caret);
        return result;
    }
    from(buffer) {
        this.set(buffer.data());
        this.caret = new Caret();
    }
    normalizeData() {
        return this.data().replaceAll(/[\{\}]/g, '');
    }
    getSelected() {
        if (!this.caret.hasSelect())
            return '';
        const result = this.subdata(this.caret.left(), this.caret.right());
        return Buffer.normalizeOverline(result);
    }
    static isValidChar(char) {
        return /^[A-Z\{\}\#\$\^\-\+\*\/\=\|0-9()]$/.test(char);
    }
    static normalizeOverline(str) {
        let level = 0;
        let result = '';
        for (const char of str) {
            if (!Buffer.isValidChar(char))
                continue;
            if (char === '{')
                ++level;
            if (char === '}') {
                if (level === 0)
                    continue;
                --level;
            }
            result += char;
        }
        for (let idx = 0; idx < level; ++idx)
            result += '}';
        return result;
    }
    toLeft() {
        this.caret.toLeft(0);
    }
    toRight() {
        this.caret.toRight(this.data.length);
    }
    addData(data) {
        if (this.caret.hasSelect()) {
            this.removeSelect();
        }
        this.__insert(data, this.caret.left());
        this.caret.move(this.caret.left() + data.length);
    }
    insertOverline() {
        if (!this.caret.hasSelect())
            return;
        this.__insert('}', this.caret.right());
        this.__insert('{', this.caret.left());
        this.caret.expandRight(2);
    }
    removeChar() {
        if (this.caret.hasSelect()) {
            this.removeSelect();
            return;
        }
        if (this.caret.left() === this.data().length)
            return;
        this.removePart(this.caret.left(), this.caret.left() + 1);
    }
    removeCharBefore() {
        if (this.caret.hasSelect()) {
            this.removeSelect();
            return;
        }
        if (this.caret.left() === 0)
            return;
        this.removePart(this.caret.left() - 1, this.caret.left());
        this.caret.move(this.caret.left() - 1);
    }
    removeSelect() {
        if (!this.caret.hasSelect())
            return;
        this.removePart(this.caret.left(), this.caret.right());
        this.caret.move(this.caret.left());
    }
    removePart(start, end) {
        validationStringRange(this.data(), start, end);
        end = this.removeOverlines(start, end);
        const overline_end_count = charCount(this.data(), start, end, '}');
        this.__erase(start, end);
        this.__insert('}'.repeat(overline_end_count), start);
    }
    removeOverlines(start, end) {
        validationStringRange(this.data(), start, end);
        for (let idx = start; idx < end; ++idx) {
            if (this.data()[idx] === '{') {
                const overline_end = this.removeOverline(idx);
                if (overline_end === -1)
                    return -1;
                if (overline_end < end)
                    --end;
                --idx;
                --end;
            }
        }
        return end;
    }
    removeOverline(start) {
        validationStringIndex(this.data(), start);
        if (this.data()[start] !== '{')
            throw new Error(`Argument 'start' is not overline start`);
        const end = findOverlineEnd(this.data(), start);
        this.__erase(end, end + 1);
        this.__erase(start, start + 1);
        return end;
    }
    __insert(data, offset) {
        this.insert(data, offset);
        if (this.inserted_callback !== undefined)
            this.inserted_callback(offset, data.length);
    }
    __erase(start, end) {
        this.erase(start, end);
        if (this.erased_callback !== undefined)
            this.erased_callback(start, end - start);
    }
}
