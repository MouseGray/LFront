export function is_correct_symbol(symbol) {
    if ('A' <= symbol && symbol <= 'Z')
        return true;
    else if ('0' <= symbol && symbol <= '9')
        return true;
    else if (symbol === '(' || symbol === ')')
        return true;
    else if (symbol === '{' || symbol === '}')
        return true;
    else if (symbol === '#' || symbol === '$' || symbol === '^')
        return true;
    else if (symbol === '-' || symbol === '+' ||
        symbol === '*' || symbol === '/')
        return true;
    else if (symbol === '=')
        return true;
    else if (symbol === '.')
        return true;
    return false;
}
