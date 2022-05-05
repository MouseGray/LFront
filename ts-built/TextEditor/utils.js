export function validationStringIndex(data, index) {
    if (index < 0 || data.length <= index)
        throw new Error('Invalid string range');
}
export function validationStringEnd(data, end) {
    if (end < 0 || data.length < end)
        throw new Error('Invalid string range');
}
export function validationStringRange(data, start, end) {
    if ((start < 0 || data.length <= start) ||
        (end < 0 || data.length < end) || (start > end))
        throw new Error('Invalid string range');
}
export function findOverlineEnd(data, start) {
    if (start < 0)
        throw new Error(`Argument 'start' < 0`);
    let level = 0;
    for (let idx = start; idx < data.length; ++idx) {
        if (data[idx] === '{') {
            ++level;
            continue;
        }
        if (data[idx] === '}') {
            if (--level === 0)
                return idx;
        }
    }
    throw new Error(`Not found overline end`);
}
export function findOverlineConfig(data, start) {
    if (start < 0)
        throw new Error(`Argument 'start' < 0`);
    let level = 0;
    for (let idx = start; idx < data.length; ++idx) {
        if (data[idx] === '{') {
            ++level;
            continue;
        }
        if (data[idx] === '}') {
            if (--level === 0)
                return idx;
        }
    }
    throw new Error(`Not found overline end`);
}
export function eraseFromString(data, begin, end) {
    validationStringRange(data, begin, end);
    if (begin === end)
        return data;
    return data.substring(0, begin).concat(data.substring(end));
}
export function insertToString(data, begin, new_data) {
    validationStringEnd(data, begin);
    if (new_data.length === 0)
        return data;
    return data.substring(0, begin).concat(new_data, data.substring(begin));
}
export function charCount(data, begin, end, char) {
    validationStringRange(data, begin, end);
    let result = 0;
    for (let idx = begin; idx < end; ++idx) {
        if (data[idx] === char) {
            ++result;
        }
    }
    return result;
}
export function inRect(startX, startY, endX, endY, posX, posY) {
    return (startX <= posX && posX <= endX) &&
        (startY <= posY && posY <= endY);
}
