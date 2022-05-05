import { Load } from './analyze.js';
import { ShowMessageBox } from './messagebox.js'
import { LoadTaskDescription } from './task_description.js';
import { getEventObject } from './utils.js';

const service_url = 'http://localhost:8000/service/task/list';

export function InitTaskList() {
    const task_list = document.querySelector('.task-list-background');
    task_list.addEventListener('click', event => {
        if (event.target === task_list) HideTaskListUI();
    });
}

export function ShowTaskList() {
    ShowTaskListUI();
    FetchTaskList();
}

function ShowTaskListUI() {
    const task_list = document.querySelector('.task-list-background');
    task_list.style.display = 'block';
}

function HideTaskListUI() {
    const task_list = document.querySelector('.task-list-background');
    task_list.style.display = 'none';
}

function FetchTaskList() {
    ClearTaskList();
    StartLoadingUI();
    FetchData();
}

function StartLoadingUI() {
    const task_list_status = document.querySelector('.task-list-status');
    task_list_status.innerHTML = 'Загрузка...';
    task_list_status.style.display = 'block';
}

function HideLoadingUI() {
    const task_list_status = document.querySelector('.task-list-status');
    task_list_status.innerHTML = 'Заданий нет';
    task_list_status.style.display = 'none';
}

function ShowNoTaskUI() {
    const task_list_status = document.querySelector('.task-list-status');
    task_list_status.innerHTML = 'Заданий нет';
    task_list_status.style.display = 'block';
}

function FetchData() {
    fetch(service_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            method: 'TaskList'
        }),
        credentials: 'include'
    })
    .then(result => {
        if(result.ok) {
            return result.json();
        }
        Promise.reject();
    })
    .then(json => {
        if (json.length === 0) {
            ShowNoTaskUI();
        }
        else {
            HideLoadingUI();
            FillTaskList(json);
        }
    })
    .catch(() => {
        ShowMessageBox('Ошибка', 'Ошибка сервера приложений.<br>Не удалось получить список заданий.');
        ShowNoTaskUI();
    });
}

function ClearTaskList() {
    const tasks = document.querySelectorAll('.task-list > .task');
    tasks.forEach(el => {
        el.remove();
    });
}

function FillTaskList(task_list) {
    const html_task_list = document.querySelector('.task-list');
    for (let task of task_list) {
        const new_task = CreateTask(task);
        new_task.addEventListener('click', SelectTask);
        html_task_list.appendChild(new_task);
    }
}

function CreateTask(task) {
    const tmpl_task = document.querySelector('.task-template');
    const new_tmpl_task = tmpl_task.content.cloneNode(true);
    const new_task = new_tmpl_task.querySelector('.task');

    const new_task_title = new_task.querySelector('.task-title');
    new_task_title.innerHTML = GetTitle(task);

    const status = GetStatus(task);

    const new_task_status_text = new_task.querySelector('.task-status-text');
    new_task_status_text.innerHTML = status.text;
    new_task_status_text.style.color = status.color;

    const new_task_status_icon = new_task.querySelector('.task-status-icon');
    new_task_status_icon.style.background = status.color;

    const new_task_text = new_task.querySelector('.task-text');
    new_task_text.innerHTML = task.text;

    return new_task;
}

function SelectTask(event) {
    const object = getEventObject(event, 'task');
    const task_title = object.querySelector('.task-title');
    const task_text = object.querySelector('.task-text');
    const task_number = GetNumberFromTitle(task_title.innerHTML);
    const task_title_text = GetTitleTextFromTitle(task_title.innerHTML);
    const description = { taskid: task_number, 
        title: task_title_text, text: task_text.innerHTML }
    
    SetDocumentTaskNo(task_number);
    LoadTaskDescription(description);
    Load();
    HideTaskListUI();
}

function SetDocumentTaskNo(no) {
    document.cookie = 'taskid=' + no;
}

function GetNumberFromTitle(title) {
    return parseInt(title.split(' ')[0].substr(1));
}

function GetTitleTextFromTitle(title) {
    return title.split(' ')[1].substr(0);
}

function GetTitle(task) {
    return '#' + task.task_id + ' ' + task.title;
}

function GetStatus(task) {
    if (task.rating === 0) {
        return { color: 'yellow', text: 'в работе' };
    }
    else {
        return { color: 'green', text: 'выполнено' };
    }
}
