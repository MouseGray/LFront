import { Save } from "./analyze.js";
import { GetBuffer as GetEditBuffer, GetMarkers, GetNumbers, GetOperation, right_edit, SetEdit, StopEdit } 
        from "./edit_panel.js";
import { TextViewer } from "./ts-built/TextEditor/viewer.js";
import { InitTools } from "./tools.js";
import { InitToolTip } from "./tooltip.js";
import { copyArray, swap } from "./utils.js";
import { MarkersBase } from "./ts-built/TextEditor/markers_base.js";
import { BufferBase } from "./ts-built/TextEditor/buffer_base.js";

export const storage = [];

let edit_row = undefined;

export function DeployData(data) {
    for (let row of data) {
        AddRow(row);
    }
}

export function AddNewRow() {
    const new_row = CreateRow();
    storage.push(new TextViewer(new_row,
        undefined, GetEditBuffer(), GetOperation(), undefined, GetMarkers(), GetNumbers(),
        undefined, undefined));
    InitTools(new_row, EditRow, ToUp, ToDown, RemoveRow);
    InitToolTip(new_row, storage[storage.length - 1]);
}

function AddRow(row) {
    const new_row = CreateRow();
    storage.push(new TextViewer(new_row,
        row.uid, GetBuffer(row), row.operation, row.connection, 
        convertMarkersBack(row.markers), row.numbers,
        row.error, row.error_text));
    InitTools(new_row, EditRow, ToUp, ToDown, RemoveRow);
    InitToolTip(new_row, storage[storage.length - 1]);
}

function CreateRow() {
    const expr_list = document.querySelector('.expr-list');
    const expr_tmpl = expr_list.querySelector('.expr-template');
    const new_expt_item = expr_tmpl.content.cloneNode(true);
    expr_list.appendChild(new_expt_item);
    return expr_list.lastElementChild;
}

export function Clear() {
    const expr_list = document.querySelector('.expr-list');
    const list = expr_list.querySelectorAll('.expr-list > .expr-row');
    for (let row of list) {
        row.remove();
    }
    storage.splice(0, storage.length);
}

function GetBuffer(row) {
    return { left: new BufferBase(row.left), right: new BufferBase(row.right) };
}

export function GetRow(uid) {
    return storage.find(row => {
        return row.uid === uid;
    });
}

export function SaveRow() {
    if (edit_row === undefined) return;
    const view = GetRow(edit_row);
    view.setData(GetEditBuffer(), GetMarkers(), GetNumbers());
    view.setOperation(GetOperation());
    StopEdit();
    edit_row = undefined;
}

function EditRow(row) {
    const uid = parseInt(row.querySelector('.expr-uid').innerHTML);
    const view = GetRow(uid);
    SetEdit(view.buffer, view.markers, view.numbers, view.operation);  
    edit_row = uid;  
}

function ToUp(row) {
    const expr_list = document.querySelector('.expr-list');
    const rows = document.querySelectorAll('.expr-row');
    const idx = Array.from(rows).findIndex(el => {
        return el === row;
    });
    expr_list.insertBefore(rows[idx], rows[idx - 1]);
    swap(storage, idx, idx - 1);
    Save();
}

function ToDown(row) {
    const expr_list = document.querySelector('.expr-list');
    const rows = document.querySelectorAll('.expr-row');
    const idx = Array.from(rows).findIndex(el => {
        return el === row;
    });
    expr_list.insertBefore(rows[idx], rows[idx + 2]);
    swap(storage, idx, idx + 1);
    Save();
}

function RemoveRow(row) {
    const expr_list = document.querySelectorAll('.expr-row');
    const idx = Array.from(expr_list).findIndex(el => {
        return el === row;
    });
    storage.splice(idx, 1);
    row.remove();
    Save();
}

export function PackData() {
    const lines = [];
    for (const row of storage) {
        const line = {
            left:       row.buffer.left.data(),
            right:      row.buffer.right.data(),
            operation:  row.operation,
            uid:        row.uid,
            numbers:    row.numbers,
            markers:    convertMarkers(row.markers)
        };
        lines.push(line);
    }
    return lines;
}

function convertMarkers(markers) {
    const result = [];
    for(let idx = 0; idx < 5; ++idx) {
        result.push({left: markers.left.data()[idx], 
            right: markers.right.data()[idx]});
    }
    return result;
}

function convertMarkersBack(markers) {
    const left = [];
    const right = [];
    for(let idx = 0; idx < 5; ++idx) {
        left.push(markers[idx].left);
        right.push(markers[idx].right);
    }
    return { left: new MarkersBase(left), right: new MarkersBase(right) };
}