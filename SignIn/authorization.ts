import { Limiter } from "../Network/limiter.js";
import { initUpdatePass } from "./update_pass.js";
import { getInputData, hideErrorText, setAcceptButtonText, setInputData, setTitle, showErrorText } from "./utils.js";

const limiter = new Limiter(1000, sendRequest);

export function initAuthtorization() : void {
    setTitle('Авторизация');
    setInputData('top', 'text', 'Логин');
    setInputData('bottom', 'password', 'Пароль');
    setAcceptButtonText('Войти');
    document.querySelector('.accept-btn').addEventListener('click', signIn);
}

function signIn() : void {
    limiter.push(JSON.stringify(getData()));
}

function getData() : any {
    return { method: "SignIn", login: getInputData('top'), password: getInputData('bottom') };
}

function sendRequest(data : string) : void {
    fetch('http://localhost:8000/service/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data,
        credentials: "include"
    })
    .then(res => {
        if(res.status === 401) {
            showErrorText('Неверный логин или пароль');
        }
        else return res.json();
    })
    .then(json => {
        if ('error' in json) {
            showErrorText(json.error);
        }
        else {
            hideErrorText();
            if (json.disposable) setNewPassword();
            else toNextPage();
        }
    })
    .catch(() => {
        showErrorText('Ошибка сервера');
    });
}

function toNextPage() : void {
    document.location.href = 'http://localhost:8000/main.html';
}

function setNewPassword() : void {
    document.querySelector('.accept-btn').removeEventListener('click', signIn);
    initUpdatePass();
}