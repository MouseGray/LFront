import { TextEditor } from "./ts-built/TextEditor/editor.js";
import { MarkersUnit } from "./ts-built/TextEditor/markers_unit.js";
import { copyArray } from "./utils.js";

export let left_edit;
export let right_edit;
export let current_edit;

export const Part = {
    Left: 0,
    Right: 1
};

export function InitEditPanel() {
    const edits = document.querySelectorAll('.edit');

    edits[Part.Left].setAttribute("tabindex", 0);
    left_edit = new TextEditor(edits[Part.Left]);
    left_edit.focused = () => { current_edit = Part.Left; };
    //SetListeners(edits[Part.Left], Part.Left);

    edits[Part.Right].setAttribute("tabindex", 0);
    right_edit = new TextEditor(edits[Part.Right]);
    right_edit.focused = () => { current_edit = Part.Right; };
    //SetListeners(edits[Part.Right], Part.Right);

    InitExtraSymbols();
    InitOperations();

    SetResizable();
}

function SetListeners(edit, part) {
    edit.addEventListener('mousedown',     e => GetEdit(part).mouseDown(e));
    edit.addEventListener('mousemove',     e => GetEdit(part).mouseMove(e));
    edit.addEventListener('mouseup',       e => GetEdit(part).mouseUp(e));
    edit.addEventListener('mouseleave',    e => GetEdit(part).mouseLeave(e));
    edit.addEventListener('keydown',       e => GetEdit(part).keyPressed(e));
    edit.addEventListener('focus',         e => { current_edit = part; });
}

function SetResizable() {
    window.addEventListener('resize', ResizePanel);
    ResizePanel();
}

function ResizePanel() {
    const panel = document.querySelector('.edit-panel');
    const edits = panel.querySelectorAll('.edit');
    edits[Part.Left].width = panel.clientWidth;
    left_edit.update();
    edits[Part.Right].width = panel.clientWidth;
    right_edit.update();
}

function InitExtraSymbols () {
    const extra_symbols = document.querySelectorAll('.extra-symbol');
    extra_symbols[0].addEventListener('click', AddComplement);
    extra_symbols[1].addEventListener('click', AddIntersection);
    extra_symbols[2].addEventListener('click', AddUnion);
    extra_symbols[3].addEventListener('click', AddMinus);
}

function InitOperations() {
    const operation_list = document.querySelector('.edit-op');
    for (const op of operations) {
        const new_option = document.createElement('option');
        new_option.value = op.id;
        new_option.innerHTML = op.text;
        operation_list.appendChild(new_option);
    }    
}

export function SetEdit(buffer, markers, numbers, operation) {
    left_edit.setData(buffer.left, markers.left);
    right_edit.setData(buffer.right, markers.right);
    SetNumbers(numbers);
    const op = document.querySelector('.edit-op');
    op.value = '' + operation;
    const send_btn = document.querySelector('.send-btn');
    send_btn.innerText = 'Применить';
    const cancel_btn = document.querySelector('.cancel-btn');
    cancel_btn.style.display = 'block';
}

export function StopEdit() {
    const send_btn = document.querySelector('.send-btn');
    send_btn.innerText = 'Добавить';
    const cancel_btn = document.querySelector('.cancel-btn');
    cancel_btn.style.display = 'none';
}

function SetNumbers(numbers) {
    const edit_links = document.querySelectorAll('.edit-link');
    for(let idx = 0; idx < numbers.length; ++idx) {
        if (!isNaN(numbers[idx])) {
            edit_links[idx].value = numbers[idx];
        }
    }
}

function GetEdit(part) {
    if (part === Part.Left) return left_edit;
    if (part === Part.Right) return right_edit;
}

export function GetBuffer() {
    return { left: left_edit.buffer, right: right_edit.buffer, joiner: '=' };
}

function GetFlatMarkers(markers) {
    const left = [];
    const right = [];
    for (let idx = 0; idx < markers.length; idx++) {
        left.push(copyArray(markers[idx].left));
        right.push(copyArray(markers[idx].right));
    }
    return { left: left, right: right };
}

export function GetMarkers() {
    return new MarkersUnit(left_edit.markers, right_edit.markers);
}

export function GetOperation() {
    const edit_op = document.querySelector('.edit-op');
    return parseInt(edit_op.value);
}

export function GetNumbers() {
    const result = [];
    const edit_links = document.querySelectorAll('.edit-link');
    for(let edit_link of edit_links) {
        result.push(parseInt(edit_link.value));
    }
    return result;
}

function AddComplement() {
    if (current_edit === undefined) return;
    GetEdit(current_edit).complement();
    GetEdit(current_edit).focus();
}

function AddIntersection() {
    if (current_edit === undefined) return;
    GetEdit(current_edit).insertText('#');
    GetEdit(current_edit).focus();
}

function AddUnion() {
    if (current_edit === undefined) return;
    GetEdit(current_edit).insertText('$');
    GetEdit(current_edit).focus();
}

function AddMinus() {
    if (current_edit === undefined) return;
    GetEdit(current_edit).insertText('^');
    GetEdit(current_edit).focus();
}


