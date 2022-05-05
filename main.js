import { Load, Save } from './analyze.js';
import { InitEditPanel, left_edit, right_edit, StopEdit } from './edit_panel.js';
import { InitMarkers } from './markers.js';
import { InitMessageBox } from './messagebox.js';
import { AddNewRow, SaveRow } from './storage.js';
import { InitTaskList, ShowTaskList } from './tasklist.js'
import { LoadTaskDescription } from './task_description.js';

function main() {
    InitTaskList();
    InitMessageBox();
    InitEditPanel();
    InitMarkers(left_edit, right_edit);

    const menu_tasks = document.querySelector('.menu-tasks');
    menu_tasks.addEventListener("click", ShowTaskList);

    const send_btn = document.querySelector('.send-btn');
    send_btn.addEventListener("click", (event) => {
        if (event.target.innerText === 'Добавить') {
            AddNewRow();
        }
        else if (event.target.innerText === 'Применить') {
            SaveRow();
        }
        Save();        
    });

    const cancel_btn = document.querySelector('.cancel-btn');
    cancel_btn.addEventListener("click", event => {
        StopEdit();
    }); 

    //LoadTaskDescription();
    //Load();
}

document.addEventListener("DOMContentLoaded", main);