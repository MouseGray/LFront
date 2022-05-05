export function isValidArgs(...Args : any) : boolean {
    for (const arg of Args)
        if (arg === undefined) return false;
    return true;
}

export function validationArgs(...Args : any) : void {
    for (const arg of Args)
        if (arg === undefined) throw 'Argument is undefined';
}

export function copyArray(src : any) : any {
    if (Array.isArray(src)) {
        const new_array = [];
        for(const el of src) {
            new_array.push(copyArray(el));
        }
        return new_array;
    }
    return src;    
}