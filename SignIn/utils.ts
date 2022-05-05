export function setTitle(title : string) {
    document.querySelector('.title').innerHTML = title;
}

export function setInputData(id : string, type : string, placeholder : string) : void {
    const element = document.querySelector(`.${id}-input`) as HTMLInputElement;
    element.type = type;
    element.placeholder = placeholder;
    element.value = '';
}

export function hideInput(id : string) : void {
    const element = document.querySelector(`.${id}-input`) as HTMLInputElement;
    element.style.display = 'none';
}

export function getInputData(id : string) : string {
    const element = document.querySelector(`.${id}-input`) as HTMLInputElement;
    return element.value;
}

export function showErrorText(text : string) : void {
    const element = document.querySelector('.error-text') as HTMLDivElement;
    element.innerHTML = text;
    element.style.visibility = 'visible';
}

export function hideErrorText() : void {
    const element = document.querySelector('.error-text') as HTMLDivElement;
    element.innerHTML = '';
    element.style.visibility = 'hidden';
}

export function setAcceptButtonText(text : string) : void {
    document.querySelector('.accept-btn').innerHTML = text;
}