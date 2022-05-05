import { ShowMessageBox } from "./messagebox.js";
import { Clear, DeployData, GetRow, PackData } from "./storage.js";
import { Error } from "./ts-built/TextEditor/error.js";
import { Limiter } from "./ts-built/Network/limiter.js";
import { addStatus, releaseStatus } from "./ts-built/UI/status_bar.js"

const service_url_save = 'http://localhost:8000/service/task/update';
const service_url_load = 'http://localhost:8000/service/task/solution';
const service_url_analyze = 'http://localhost:8000/service/task/analyze';

const limiter = new Limiter(3000, SaveImpl);

let process_save_status_id = 0;
let error_save_status_id = 0;

let process_load_status_id = 0;
let error_load_status_id = 0;

export function Save() {
    releaseStatus(error_save_status_id);
    process_save_status_id = addStatus('Сохранение...');
    limiter.push(PackData());
}

function SaveImpl(data) {
    fetch(service_url_save, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            method: "TaskSolutionUpdate",
            solution: JSON.stringify(data)
        }),
        credentials: "include"
    })
    .then(result => {
        if(result.ok) {
            releaseStatus(process_save_status_id);
            FetchAnalyze();
        }
        else {
            Promise.reject(res.error);
        }
    })
    .catch(error => {
        releaseStatus(process_save_status_id);
        error_save_status_id = addStatus('Не сохранено');
        ShowMessageBox('Ошибка', 'Ошибка сервера приложений.<br>Не удалось сохранить данные.');
    });
}

export function Load() {
    releaseStatus(error_load_status_id);
    process_load_status_id = addStatus('Загрузка...');
    LoadImpl();
}

function LoadImpl() {
    Clear();

    fetch(service_url_load, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            method: 'TaskSolutionRead'
        }),
        credentials: "include"
    })
    .then(res => {
        if(res.ok) {
            releaseStatus(process_load_status_id);
            return res.json();
        }
        Promise.reject(res.error);
    })
    .then(json => {
        DeployData(json.solution);
        FetchAnalyze();
    })
    .catch(error => {
        releaseStatus(process_load_status_id);
        error_load_status_id = addStatus('Не загружено');
        ShowMessageBox('Ошибка', 'Ошибка сервера приложений.<br>Не удалось загрузить данные.');
    });
}

function FetchAnalyze() {
    fetch(service_url_analyze, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            method: 'TaskSolutionAnalyze'
        }),
        credentials: "include"
    })
    .then(result => {
        if(result.ok) {
            result.body.getReader().read()
            .then(val => {
                const decoder = new TextDecoder('windows-1251');
                AcceptAnalyze(JSON.parse(decoder.decode(val.value)));
            })
            .catch(error => {
                Promise.reject(error);
            });
        }
        else {
            Promise.reject(res.error);
        }
    })
    .catch(error => {
        ShowMessageBox('Ошибка', 'Ошибка сервера приложений.<br>Не удалось получить аналитику.');
    });
}

function AcceptAnalyze(result) {
    if ('error' in result) {
        ShowMessageBox('Ошибка', result.error);
        return;
    }
    for (let i = 0; i < result.errors.length; ++i) {
        const view = GetRow(result.errors[i].uid);
        if (view !== undefined) {
            view.setConnection(result.errors[i].connection);
            view.setError(new Error(result.errors[i].error, result.errors[i].error_text));
        }
    }
    if (result.result === true) {
        ShowMessageBox('Ура', 'Задание выполнено.');
    }
}