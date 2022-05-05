export class Stack {
    data : any[];

    constructor() {
        this.data = [];
    }

    top() : any {
        return this.data[this.data.length - 1];
    }

    pop() : any {
        return this.data.pop();
    }

    push(element) : void {
        this.data.push(element);
    }

    empty() : boolean {
        return this.data.length === 0;
    }
}