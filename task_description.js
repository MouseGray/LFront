import { ShowMessageBox } from "./messagebox.js";

const service_url = 'http://localhost:8000/service/task/description';

export function LoadTaskDescription(description) {
    ShowLoadingUI();
    SetTaskDescription(description);
    //FetchData();
}

function ShowLoadingUI() {
    const task_description = document.querySelector('.task-description');
    task_description.innerHTML = 'Загрузка...';
}

function ShowErrorUI() {
    const task_description = document.querySelector('.task-description');
    task_description.innerHTML = '[Нет данных]';
}

function FetchData() {
    fetch(service_url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include"
    })
    .then(result => {
        if(result.ok) {
            result.json()
            .then(SetTaskDescription)
            .catch(error => {
                Promise.reject(error);
            });
        }
        else {
            Promise.reject(res.error);
        }
    })
    .catch(error => {
        ShowErrorUI();
        ShowMessageBox('Ошибка', 'Ошибка сервера приложений.<br>Не удалось загрузить текст задания.');
    });
}

function SetTaskDescription(result) {
    const task_description = document.querySelector('.task-description');
    task_description.innerHTML = CreateDescription(result.taskid, result.title, result.text);
}

function CreateDescription(no, title, text) {
    return '#' + no + ' ' + title + '<br>' + text;
}