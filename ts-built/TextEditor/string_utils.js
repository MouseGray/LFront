export var strutils;
(function (strutils) {
    function insert(str, pos, val) {
        insertValidation(str, pos);
        if (val.length === 0)
            return str;
        return str.substring(0, pos).concat(val, str.substring(pos));
    }
    strutils.insert = insert;
    function erase(str, begin, end) {
        eraseValidation(str, begin, end);
        if (begin === end)
            return str;
        return str.substring(0, begin).concat(str.substring(end));
    }
    strutils.erase = erase;
    function insertValidation(str, pos) {
        stringValidation(str, pos);
    }
    function eraseValidation(str, begin, end) {
        stringValidation(str, begin);
        stringValidation(str, end);
        if (begin > end)
            throw new Error('Invalid string range');
    }
    function stringValidation(str, pos) {
        if (pos < 0 || str.length < pos)
            throw new Error('Invalid string range');
    }
    strutils.stringValidation = stringValidation;
})(strutils || (strutils = {}));
