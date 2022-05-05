export function setTitle(title) {
    document.querySelector('.title').innerHTML = title;
}
export function setInputData(id, type, placeholder) {
    const element = document.querySelector(`.${id}-input`);
    element.type = type;
    element.placeholder = placeholder;
    element.value = '';
}
export function hideInput(id) {
    const element = document.querySelector(`.${id}-input`);
    element.style.display = 'none';
}
export function getInputData(id) {
    const element = document.querySelector(`.${id}-input`);
    return element.value;
}
export function showErrorText(text) {
    const element = document.querySelector('.error-text');
    element.innerHTML = text;
    element.style.visibility = 'visible';
}
export function hideErrorText() {
    const element = document.querySelector('.error-text');
    element.innerHTML = '';
    element.style.visibility = 'hidden';
}
export function setAcceptButtonText(text) {
    document.querySelector('.accept-btn').innerHTML = text;
}
