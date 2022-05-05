function getRowAttribute(row, name, attribute) {
    const element = row.querySelector(`.${name}`);
    return element.getAttribute(attribute);
}
function setRowAttribute(row, name, attribute, value) {
    const element = row.querySelector(`.${name}`);
    element.setAttribute(attribute, value);
}
export function getRowStringAttribute(row, name, attribute) {
    return getRowAttribute(row, name, attribute);
}
export function setRowStringAttribute(row, name, attribute, value) {
    setRowAttribute(row, name, attribute, value);
}
export function getRowComplexAttribute(row, name, attribute) {
    return JSON.parse(getRowAttribute(row, name, attribute));
}
export function setRowComplexAttribute(row, name, attribute, value) {
    setRowAttribute(row, name, attribute, JSON.stringify(value));
}
