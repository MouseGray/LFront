export class Stack {
    data;
    constructor() {
        this.data = [];
    }
    top() {
        return this.data[this.data.length - 1];
    }
    pop() {
        return this.data.pop();
    }
    push(element) {
        this.data.push(element);
    }
    empty() {
        return this.data.length === 0;
    }
}
