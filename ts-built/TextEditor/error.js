export class Error {
    code;
    text;
    constructor(code = 0, text = 'Не проверено') {
        this.code = code;
        this.text = text;
    }
    static copy(error) {
        if (error === undefined)
            return undefined;
        return new Error(error.code, error.text);
    }
    set(code, text) {
        this.code = code;
        this.text = text;
    }
}
