export class Error {
    code : number;
    text : string;

    constructor(code = 0, text = 'Не проверено') {
        this.code = code;
        this.text = text;
    }
    static copy(error : Error) : Error {
        if (error === undefined) return undefined;
        return new Error(error.code, error.text);
    }
    set(code : number, text : string) : void {
        this.code = code;
        this.text = text;
    }
}