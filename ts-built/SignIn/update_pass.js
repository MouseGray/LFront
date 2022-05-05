import { Limiter } from "../Network/limiter.js";
import { getInputData, hideErrorText, hideInput, setAcceptButtonText, setInputData, setTitle, showErrorText } from "./utils.js";
const limiter = new Limiter(1000, sendRequest);
export function initUpdatePass() {
    setTitle('Авторизация');
    setInputData('top', 'password', 'Новый пароль');
    hideInput('bottom');
    setAcceptButtonText('Продолжить');
    document.querySelector('.accept-btn').addEventListener('click', accept);
}
function accept() {
    const password = getInputData('top');
    if (password.length < 7)
        showErrorText('Пароль должен состоять минимум из 7 символов');
    else
        limiter.push(JSON.stringify({ password: password }));
}
function sendRequest(data) {
    fetch('http://localhost:8000/service/password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data,
        credentials: "include"
    })
        .then(res => {
        if (res.ok) {
            hideErrorText();
            toNextPage();
        }
        else {
            showErrorText('Ошибка сервера');
        }
    })
        .catch(() => {
        showErrorText('Ошибка сервера');
    });
}
function toNextPage() {
    document.location.href = 'http://localhost/main.html';
}
