class Stack {
    constructor() {
        this.data = [];
    }

    top() {
        return this.data[this.data.length - 1];
    }

    pop() {
        const last = this.top();
        this.data.pop();
        return last;
    }

    push(element) {
        this.data.push(element);
    }

    empty() {
        return this.data.length === 0;
    }
}