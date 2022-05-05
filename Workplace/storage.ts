// import { TextViewer } from "../TextEditor/viewer.js";

// export class Storage {
//     data : TextViewer[];
//     edit_row : number;

//     constructor() {
//         this.data = [];
//         this.edit_row = undefined;
//     }

//     addRow() {
//         const new_row = Storage.createHtmlRow();
//         this.data.push(new TextViewer(new_row,
//             undefined, GetEditBuffer(), GetOperation(), undefined, GetMarkers(), GetNumbers(),
//             undefined, undefined));
//         InitTools(new_row, EditRow, ToUp, ToDown, RemoveRow);
//         InitToolTip(new_row, storage[storage.length - 1]);
//     }

//     static createHtmlRow() {
//         const expr_list = document.querySelector('.expr-list') as HTMLTableElement;
//         const expr_tmpl = expr_list.querySelector('.expr-template') as HTMLTemplateElement;
//         const new_expt_item = expr_tmpl.content.cloneNode(true);
//         expr_list.appendChild(new_expt_item);
//         return expr_list.lastElementChild;
//     }
// }

// let edit_row = undefined;

// export function DeployData(data) {
//     for (let row of data) {
//         AddRow(row);
//     }
// }

// export function AddNewRow() {
    
// }

// function AddRow(row) {
//     const new_row = CreateRow();
//     storage.push(new TextView(new_row,
//         row.uid, GetBuffer(row), row.operation, row.connection, row.markers, row.numbers,
//         row.error, row.error_text));
//     InitTools(new_row, EditRow, ToUp, ToDown, RemoveRow);
//     InitToolTip(new_row, storage[storage.length - 1]);
// }



// export function Clear() {
//     const expr_list = document.querySelector('.expr-list');
//     const list = expr_list.querySelectorAll('.expr-list > .expr-row');
//     for (let row of list) {
//         row.remove();
//     }
//     storage.splice(0, storage.length);
// }

// function GetBuffer(row) {
//     return { left: row.left, right: row.right };
// }

// export function GetRow(uid) {
//     return storage.find(row => {
//         return row.uid === uid;
//     });
// }

// export function SaveRow() {
//     if (edit_row === undefined) return;
//     const view = GetRow(edit_row);
//     view.updateData(GetEditBuffer(), GetOperation(), GetMarkers(), GetNumbers());
// }

// function EditRow(row) {
//     const uid = parseInt(row.querySelector('.expr-uid').innerHTML);
//     const view = GetRow(uid);
//     SetEdit(view.buffer, copyArray(view.markers), view.numbers);  
//     edit_row = uid;  
// }

// function ToUp(row) {
//     const expr_list = document.querySelector('.expr-list');
//     const rows = document.querySelectorAll('.expr-row');
//     const idx = Array.from(rows).findIndex(el => {
//         return el === row;
//     });
//     expr_list.insertBefore(rows[idx], rows[idx - 1]);
//     swap(storage, idx, idx - 1);
//     Save();
// }

// function ToDown(row) {
//     const expr_list = document.querySelector('.expr-list');
//     const rows = document.querySelectorAll('.expr-row');
//     const idx = Array.from(rows).findIndex(el => {
//         return el === row;
//     });
//     expr_list.insertBefore(rows[idx], rows[idx + 2]);
//     swap(storage, idx, idx + 1);
//     Save();
// }

// function RemoveRow(row) {
//     const expr_list = document.querySelectorAll('.expr-row');
//     const idx = Array.from(expr_list).findIndex(el => {
//         return el === row;
//     });
//     storage.splice(idx, 1);
//     row.remove();
//     Save();
// }

// export function PackData() {
//     const lines = [];
//     for (const row of storage) {
//         const line = {
//             left:       row.buffer.left,
//             right:      row.buffer.right,
//             operation:  row.op_id,
//             uid:        row.uid,
//             numbers:    row.numbers,
//             markers:    row.markers
//         };
//         lines.push(line);
//     }
//     return lines;
// }