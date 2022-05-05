export function copyArray(src) {
    if (Array.isArray(src)) {
        const new_array = [];
        for(const el of src) {
            new_array.push(copyArray(el));
        }
        return new_array;
    }
    return src;    
}

export function getEventObject(event, obj) {
    for (let path of event.path) {
        if (path.className === obj) return path;
    }
}

export function swap(arr, idx_1, idx_2) {
    const tmp = arr[idx_1];
    arr[idx_1] = arr[idx_2];
    arr[idx_2] = tmp;
}