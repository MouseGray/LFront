export function setRowImage(row, name, value) {
    const element = row.querySelector(`.${name}`);
    element.src = value;
}
