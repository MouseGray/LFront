import { getEditText, setEditMarkers, setEditText } from "./utils.js";
export var edit;
(function (edit) {
    function initEdit(name) {
        const edit_element = document.querySelector(name);
        edit_element.addEventListener('keydown', keyPressed);
        edit_element.addEventListener('click', mousePressed);
        setEditMarkers({ left: [[], [], [], [], []], right: [[], [], [], [], []] });
        setEditText({ left: '', middle: '', right: '' });
    }
    edit.initEdit = initEdit;
    function mousePressed(event) {
        const target = event.target;
        target.setAttribute("tabindex", '0');
    }
    function keyPressed(event) {
        const target = event.target;
        const key = event.key.toUpperCase();
        if ("Z" === key && event.ctrlKey) {
            //this.undo();
        }
        else if ("Y" === key && event.ctrlKey) {
            //this.redo();
        }
        else if ("C" === key && event.ctrlKey) {
            //this.pCopyToClipboard();
        }
        else if ("V" === key && event.ctrlKey) {
            //this.pPasteFromClipboard();
        }
        else if ("X" === key && event.ctrlKey) {
            //this.pCutToClipboard();
        }
        else if (/^[A-Z\#\$\^\-\+\*\/\=\|0-9().]$/.test(key)) {
            const text = getEditText();
            setEditText({ left: text.left + key, middle: text.middle, right: text.right });
        }
        else if ("BACKSPACE" === key) {
            //this.backspase();
        }
        else if ("DELETE" === key) {
            //this.delete();
        }
        else if ("ARROWLEFT" === key) {
            //this.toLeft();
        }
        else if ("ARROWRIGHT" === key) {
            //this.toRight();
        }
    }
})(edit || (edit = {}));
