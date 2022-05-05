import { Limiter } from "../Network/limiter.js";
import { initUpdatePass } from "./update_pass.js";
import { getInputData, hideErrorText, setAcceptButtonText, setInputData, setTitle, showErrorText } from "./utils.js";
const limiter = new Limiter(1000, sendRequest);
export function initAuthtorization() {
    setTitle('Авторизация');
    setInputData('top', 'text', 'Логин');
    setInputData('bottom', 'password', 'Пароль');
    setAcceptButtonText('Войти');
    document.querySelector('.accept-btn').addEventListener('click', signIn);
}
function signIn() {
    limiter.push(JSON.stringify(getData()));
}
function getData() {
    return { method: "SignIn", login: getInputData('top'), password: getInputData('bottom') };
}
function sendRequest(data) {
    fetch('http://localhost:8000/service/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data,
        credentials: "include"
    })
        .then(res => {
        if (res.status === 401) {
            showErrorText('Неверный логин или пароль');
        }
        else
            return res.json();
    })
        .then(json => {
        if ('error' in json) {
            showErrorText(json.error);
        }
        else {
            hideErrorText();
            if (json.disposable)
                setNewPassword();
            else
                toNextPage();
        }
    })
        .catch(() => {
        showErrorText('Ошибка сервера');
    });
}
function toNextPage() {
    document.location.href = 'http://localhost:8000/main.html';
}
function setNewPassword() {
    document.querySelector('.accept-btn').removeEventListener('click', signIn);
    initUpdatePass();
}
