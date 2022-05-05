export class Caret {
    caret : number;
    extra_caret : number;

    constructor() {
        this.caret = this.extra_caret = 0;
    }

    static copy(caret : Caret) : Caret {
        const result = new Caret();
        result.caret = caret.caret;
        result.extra_caret = caret.extra_caret;
        return result;
    }

    toLeft(limit : number) : void {
        if (this.hasSelect()) {
            this.move(this.left());
            return;
        }
        if (this.caret === limit) return;
        this.move(this.caret - 1);
    }

    toRight(limit : number) : void {
        if (this.hasSelect()) {
            this.move(this.right());
            return;
        }
        if (this.caret === limit) return;
        this.move(this.caret + 1);
    }

    left() : number {
        return Math.min(this.caret, this.extra_caret);
    }

    right() : number {
        return Math.max(this.caret, this.extra_caret);
    }

    move(pos : number) : void {
        this.caret = this.extra_caret = pos;
    }

    select(pos : number) : void {
        this.caret = pos;
    }

    hasSelect() : boolean {
        return this.caret !== this.extra_caret;
    }

    reset() : void {
        this.caret === this.extra_caret;
    }

    expandRight(size : number) : void {
        if (this.caret > this.extra_caret) {
            this.caret += size;
        }
        else {
            this.extra_caret += size;
        }
    }

    expandLeft(size : number) : void {
        if (this.caret < this.extra_caret) {
            this.caret -= size;
        }
        else {
            this.extra_caret -= size;
        }
    }
}