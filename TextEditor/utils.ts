export function validationStringIndex(data : string, index : number) : void {
    if (index < 0 || data.length <= index) 
        throw new Error('Invalid string range');
}

export function validationStringEnd(data : string, end : number) : void {
    if (end < 0 || data.length < end) 
        throw new Error('Invalid string range');
}

export function validationStringRange(data : string, start : number, end : number) : void {
    if ((start < 0 || data.length <= start) || 
        (end < 0 || data.length < end) || (start > end))
        throw new Error('Invalid string range');
}

export function findOverlineEnd(data : string, start : number) : number {
    if (start < 0) 
        throw new Error(`Argument 'start' < 0`);
    let level : number = 0;
    for (let idx : number = start; idx < data.length; ++idx) {
        if (data[idx] === '{') {
            ++level; continue;
        }
        if (data[idx] === '}') {
            if (--level === 0) return idx;
        }
    }
    throw new Error(`Not found overline end`);
}

export function findOverlineConfig(data : string, start : number) : number {
    if (start < 0) 
        throw new Error(`Argument 'start' < 0`);
    let level : number = 0;
    for (let idx : number = start; idx < data.length; ++idx) {
        if (data[idx] === '{') {
            ++level; continue;
        }
        if (data[idx] === '}') {
            if (--level === 0) return idx;
        }
    }
    throw new Error(`Not found overline end`);
}

export function eraseFromString(data : string, begin : number, end : number) : string {
    validationStringRange(data, begin, end);
    if (begin === end) return data;
    return data.substring(0, begin).concat(data.substring(end));
}

export function insertToString(data : string, begin : number, new_data : string) : string {
    validationStringEnd(data, begin);
    if (new_data.length === 0) return data;
    return data.substring(0, begin).concat(new_data, data.substring(begin));
}

export function charCount(data : string, begin : number, end : number, char : string) : number {
    validationStringRange(data, begin, end);
    let result : number = 0;
    for (let idx : number = begin; idx < end; ++idx) {
        if (data[idx] === char) {
            ++result;
        }
    }
    return result;
}

export function inRect(startX, startY, endX, endY, posX, posY) : boolean {
    return (startX <= posX && posX <= endX) &&
        (startY <= posY && posY <= endY);
}