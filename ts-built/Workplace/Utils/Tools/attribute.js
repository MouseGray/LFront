function getRowAttribute(row, name, attribute) {
    const element = row.querySelector(`.${name}`);
    return element.getAttribute(attribute);
}
function setRowAttribute(row, name, attribute, value) {
    const element = row.querySelector(`.${name}`);
    element.setAttribute(attribute, value);
}
function getRowAttributes(row, name, attribute) {
    const elements = row.querySelectorAll(`.${name}`);
    return Array.from(elements).map(val => val.getAttribute(attribute));
}
function setRowAttributes(row, name, attribute, values) {
    const elements = row.querySelectorAll(`.${name}`);
    Array.from(elements).map((val, idx) => val.setAttribute(attribute, values[idx]));
}
export function getRowStringAttribute(row, name, attribute) {
    return getRowAttribute(row, name, attribute);
}
export function setRowStringAttribute(row, name, attribute, value) {
    setRowAttribute(row, name, attribute, value);
}
export function getRowStringAttributes(row, name, attribute) {
    return getRowAttributes(row, name, attribute);
}
export function setRowStringAttributes(row, name, attribute, values) {
    setRowAttributes(row, name, attribute, values);
}
export function getRowComplexAttribute(row, name, attribute) {
    return JSON.parse(getRowAttribute(row, name, attribute));
}
export function setRowComplexAttribute(row, name, attribute, value) {
    setRowAttribute(row, name, attribute, JSON.stringify(value));
}
