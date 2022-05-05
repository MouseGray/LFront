export class Caret {
    caret;
    extra_caret;
    constructor() {
        this.caret = this.extra_caret = 0;
    }
    static copy(caret) {
        const result = new Caret();
        result.caret = caret.caret;
        result.extra_caret = caret.extra_caret;
        return result;
    }
    toLeft(limit) {
        if (this.hasSelect()) {
            this.move(this.left());
            return;
        }
        if (this.caret === limit)
            return;
        this.move(this.caret - 1);
    }
    toRight(limit) {
        if (this.hasSelect()) {
            this.move(this.right());
            return;
        }
        if (this.caret === limit)
            return;
        this.move(this.caret + 1);
    }
    left() {
        return Math.min(this.caret, this.extra_caret);
    }
    right() {
        return Math.max(this.caret, this.extra_caret);
    }
    move(pos) {
        this.caret = this.extra_caret = pos;
    }
    select(pos) {
        this.caret = pos;
    }
    hasSelect() {
        return this.caret !== this.extra_caret;
    }
    reset() {
        this.caret === this.extra_caret;
    }
    expandRight(size) {
        if (this.caret > this.extra_caret) {
            this.caret += size;
        }
        else {
            this.extra_caret += size;
        }
    }
    expandLeft(size) {
        if (this.caret < this.extra_caret) {
            this.caret -= size;
        }
        else {
            this.extra_caret -= size;
        }
    }
}
