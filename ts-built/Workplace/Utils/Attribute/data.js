export function getRowData(row, name) {
    const element = row.querySelector(`.${name}`);
    return element.textContent;
}
export function setRowData(row, name, value) {
    const element = row.querySelector(`.${name}`);
    element.textContent = value;
}
export function getRowIntData(row, name) {
    return parseInt(getRowData(row, name));
}
export function setRowIntData(row, name, value) {
    setRowData(row, name, value.toString());
}
export function getRowStringData(row, name) {
    return getRowData(row, name);
}
export function setRowStringData(row, name, value) {
    setRowData(row, name, value);
}
