export namespace strutils {
    export function insert(str : string, pos : number, val : string) : string {
        insertValidation(str, pos);
        if (val.length === 0) return str;
        return str.substring(0, pos).concat(val, str.substring(pos));
    }

    export function erase(str : string, begin : number, end : number) : string {
        eraseValidation(str, begin, end);
        if (begin === end) return str;
        return str.substring(0, begin).concat(str.substring(end));
    }

    function insertValidation(str : string, pos : number) : void {
        stringValidation(str, pos);
    }

    function eraseValidation(str : string, begin : number, end : number) : void {
        stringValidation(str, begin);
        stringValidation(str, end);
        if (begin > end) 
            throw new Error('Invalid string range');
    }

    export function stringValidation(str : string, pos : number) : void {
        if (pos < 0 || str.length < pos)
            throw new Error('Invalid string range');
    }
}
