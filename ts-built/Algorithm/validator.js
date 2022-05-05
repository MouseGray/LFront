const ClassCode = {
    undefined: 0x00000,
    set_binary: 0x00008,
    set_unary: 0x00010,
    num_binary: 0x00020,
    num_unary: 0x00040,
    variable: 0x00080,
    digit: 0x00100,
    dot: 0x00200,
    close_cmpl: 0x00800,
    open_cmpl: 0x01000,
    close_q: 0x02000,
    open_q: 0x04000,
    close_brk: 0x08000,
    open_brk: 0x10000,
    begin: 0x00002,
    end: 0x00004,
    set_area: 0x20000,
    num_area: 0x40000
};
export var ErrorCode;
(function (ErrorCode) {
    ErrorCode["no_error"] = "\u041E\u0448\u0438\u0431\u043E\u043A \u043D\u0435\u0442";
    ErrorCode["not_found_left_operand"] = "\u041D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D \u043B\u0435\u0432\u044B\u0439 \u043E\u043F\u0435\u0440\u0430\u043D\u0434";
    ErrorCode["not_found_right_operand"] = "\u041D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D \u043F\u0440\u0430\u0432\u044B\u0439 \u043E\u043F\u0435\u0440\u0430\u043D\u0434";
    ErrorCode["not_found_operand"] = "\u041D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D \u043E\u043F\u0435\u0440\u0430\u043D\u0434";
    ErrorCode["unexpect_symbol"] = "\u041D\u0435\u043E\u0436\u0438\u0434\u0430\u043D\u043D\u044B\u0439 \u0441\u0438\u043C\u0432\u043E\u043B";
    ErrorCode["not_found_open_parenthese"] = "\u041D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430 \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u044E\u0449\u0430\u044F \u0441\u043A\u043E\u0431\u043A\u0430";
    ErrorCode["not_found_close_parenthese"] = "\u041D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430 \u0437\u0430\u043A\u0440\u044B\u0432\u0430\u044E\u0449\u0430\u044F \u0441\u043A\u043E\u0431\u043A\u0430";
})(ErrorCode || (ErrorCode = {}));
;
const Action = {
    Undefined: '\0',
    Intersection: '#',
    Union: '$',
    Minus: '^',
    Subtraction: '-',
    Addition: '+',
    Multiplication: '*',
    Division: '/',
    Complement: '{',
    ComplementEnd: '}',
    Quantity: '|',
    Faction: '(',
    FactionEnd: ')',
    UnaryMinus: '`',
    Equal: '='
};
export function is_valid_expression(expr = "") {
    let has_dot = false;
    let has_quantity = false;
    const parentheses = [];
    let expect_code = expectedCode(ClassCode.begin, 0);
    for (let idx = 0; idx < expr.length; ++idx) {
        const prev = previous(expr, idx);
        const code = symbolCode(expr.charAt(idx), prev, has_quantity);
        if ((code & (ClassCode.set_binary | ClassCode.num_binary)) && prev === 0)
            return { index: idx, error: ErrorCode.not_found_left_operand };
        if ((code & (ClassCode.set_binary | ClassCode.num_binary)) && idx == expr.length - 1)
            return { index: idx, error: ErrorCode.not_found_right_operand };
        if ((code & (ClassCode.set_unary | ClassCode.num_unary)) && idx == expr.length - 1)
            return { index: idx, error: ErrorCode.not_found_operand };
        if ((code & expect_code) != code)
            return { index: idx, error: ErrorCode.unexpect_symbol };
        if (code & ClassCode.dot)
            has_dot = true;
        if (has_dot) {
            if (code == ClassCode.dot)
                return { index: idx, error: ErrorCode.unexpect_symbol };
            if (code != ClassCode.digit)
                has_dot = false;
        }
        if (code & (ClassCode.open_brk | ClassCode.open_cmpl | ClassCode.open_q))
            parentheses.push(code);
        if (code & (ClassCode.close_brk | ClassCode.close_cmpl | ClassCode.close_q)) {
            if (parentheses.length === 0)
                return { index: idx, error: ErrorCode.not_found_open_parenthese };
            if (!(parentheses[parentheses.length - 1] & ((code & 0xFFFF) << 1)))
                return { index: idx, error: ErrorCode.unexpect_symbol };
            parentheses.pop();
        }
        if (code & (ClassCode.open_q | ClassCode.close_q))
            has_quantity = !has_quantity;
        expect_code = expectedCode(code, expect_code);
    }
    if (parentheses.length !== 0)
        return { index: expr.length - 1, error: ErrorCode.not_found_close_parenthese };
    return { index: 0, error: ErrorCode.no_error };
}
function symbolCode(symbol, prev, hasQ) {
    // SetBinary
    if (is_set_binary(symbol))
        return ClassCode.set_area | ClassCode.set_binary;
    // SetUnary
    //if (is_set_unary(symbol)) return ClassCode.set_area | ClassCode.set_unary;
    // NumBinary
    if (is_num_binary(symbol, prev))
        return ClassCode.num_area | ClassCode.num_binary;
    // NumUnary
    if (is_num_unary(symbol, prev))
        return ClassCode.num_area | ClassCode.num_unary;
    // Set
    if (is_variable(symbol))
        return ClassCode.set_area | ClassCode.variable;
    // Digit
    if (is_digit(symbol))
        return ClassCode.num_area | ClassCode.digit;
    // Dot
    if (is_dot(symbol))
        return ClassCode.num_area | ClassCode.dot;
    // CloseCmpl
    if (is_close_cmpl(symbol))
        return ClassCode.set_area | ClassCode.close_cmpl;
    // OpenCmpl
    if (is_open_cmpl(symbol))
        return ClassCode.set_area | ClassCode.open_cmpl;
    // CloseQ
    if (is_close_q(symbol, hasQ))
        return ClassCode.set_area | ClassCode.close_q;
    // OpenQ
    if (is_open_q(symbol, hasQ))
        return ClassCode.num_area | ClassCode.open_q;
    // CloseBrk
    if (is_close_brk(symbol))
        return ClassCode.close_brk;
    // OpenBrk
    if (is_open_brk(symbol))
        return ClassCode.open_brk;
    return ClassCode.undefined;
}
function cur_area(code) {
    return ((code) & (ClassCode.set_area | ClassCode.num_area));
}
function expectedCode(symbolCode, expectCode) {
    // Start
    if (symbolCode & ClassCode.begin)
        return ClassCode.set_area
            | ClassCode.num_area
            | ClassCode.open_brk
            | ClassCode.open_cmpl
            | ClassCode.open_q
            | ClassCode.variable
            | ClassCode.digit
            | ClassCode.set_unary
            | ClassCode.num_unary;
    // SetBinary
    if (symbolCode & ClassCode.set_binary)
        return ClassCode.set_area
            | ClassCode.variable
            | ClassCode.open_brk
            | ClassCode.open_cmpl;
    // SetUnary
    //if (symbolCode & ClassCode.set_unary) 
    //  return ClassCode.set_area 
    //       | ClassCode.variable 
    //       | ClassCode.open_brk 
    //       | ClassCode.open_cmpl;
    // NumBinary
    if (symbolCode & ClassCode.num_binary)
        return ClassCode.num_area
            | ClassCode.digit
            | ClassCode.open_brk
            | ClassCode.open_q;
    // NumUnary
    if (symbolCode & ClassCode.num_unary)
        return ClassCode.num_area
            | ClassCode.digit
            | ClassCode.open_brk
            | ClassCode.open_q;
    // Set
    if (symbolCode & ClassCode.variable)
        return ClassCode.set_area
            | ClassCode.set_binary
            | ClassCode.close_brk
            | ClassCode.close_cmpl
            | ClassCode.close_q
            | ClassCode.end;
    // Digit
    if (symbolCode & ClassCode.digit)
        return ClassCode.num_area
            | ClassCode.num_binary
            | ClassCode.digit
            | ClassCode.dot
            | ClassCode.close_brk
            | ClassCode.end;
    // Dot
    if (symbolCode & ClassCode.dot)
        return ClassCode.num_area
            | ClassCode.digit;
    // CloseCmpl
    if (symbolCode & ClassCode.close_cmpl)
        return ClassCode.set_area
            | ClassCode.close_cmpl
            | ClassCode.set_binary
            | ClassCode.close_brk
            | ClassCode.close_q
            | ClassCode.end;
    // OpenCmpl
    if (symbolCode & ClassCode.open_cmpl)
        return ClassCode.set_area
            | ClassCode.variable
            | ClassCode.open_cmpl
            | ClassCode.open_brk
            | ClassCode.set_unary;
    // CloseQ
    if (symbolCode & ClassCode.close_q)
        return ClassCode.num_area
            | ClassCode.close_brk
            | ClassCode.num_binary
            | ClassCode.end;
    // OpenQ
    if (symbolCode & ClassCode.open_q)
        return ClassCode.set_area
            | ClassCode.variable
            | ClassCode.set_unary
            | ClassCode.open_brk
            | ClassCode.open_cmpl;
    // CloseBrk
    if (symbolCode & ClassCode.close_brk)
        return cur_area(expectCode)
            | ClassCode.close_cmpl
            | ClassCode.set_binary
            | ClassCode.num_binary
            | ClassCode.close_brk
            | ClassCode.close_q
            | ClassCode.end;
    // OpenBrk
    if (symbolCode & ClassCode.open_brk)
        return cur_area(expectCode)
            | ClassCode.variable
            | ClassCode.digit
            | ClassCode.open_cmpl
            | ClassCode.open_brk
            | ClassCode.open_q
            | ClassCode.set_unary
            | ClassCode.num_unary;
    return ClassCode.undefined;
}
function previous(view, pos) {
    return pos === 0x0 ? 0 : view[pos - 1];
}
function is_set_binary(ch) {
    return ch === Action.Intersection || ch === Action.Union || ch === Action.Minus;
}
function is_set_unary(ch) {
    return false;
}
function is_num_binary(ch, prev) {
    return ch === Action.Addition || ch === Action.Multiplication || ch === Action.Division
        || (prev !== 0x0 && prev !== Action.Faction && ch === Action.Subtraction);
}
function is_num_unary(ch, prev) {
    return (prev === 0x0 || prev === Action.Faction) && ch === Action.Subtraction;
}
function is_variable(ch) {
    return 'A' <= ch && ch <= 'Z';
}
function is_digit(ch) {
    return '0' <= ch && ch <= '9';
}
function is_dot(ch) {
    return ch === '.';
}
function is_close_cmpl(ch) {
    return ch === Action.ComplementEnd;
}
function is_open_cmpl(ch) {
    return ch === Action.Complement;
}
function is_close_q(ch, hasQ) {
    return ch == Action.Quantity && hasQ;
}
function is_open_q(ch, hasQ) {
    return ch === Action.Quantity && !hasQ;
}
function is_close_brk(ch) {
    return ch === Action.FactionEnd;
}
function is_open_brk(ch) {
    return ch === Action.Faction;
}
