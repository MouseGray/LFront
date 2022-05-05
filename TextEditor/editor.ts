import { Buffer } from "./buffer.js";
import { Markers } from "./markers.js";
import { Error } from "./error.js"
import { Renderer } from "./renderer.js";
import { Storage, Unit } from "./storage.js";
import { MarkersBase } from "./markers_base.js";
import { BufferBase } from "./buffer_base.js";

export class TextEditor {
    renderer : Renderer;
    buffer : Buffer;
    markers : Markers;
    error : Error;
    
    markerid : number;

    storage : Storage;

    __select : boolean;

    focused : Function;

    constructor(element : HTMLCanvasElement) {
        this.renderer = new Renderer(element);
        this.buffer = new Buffer((pos, size) => this.callback__TextInserted(pos, size), 
            (pos, size) => this.callback__TextErased(pos, size));
        this.markers = new Markers();
        this.error = new Error();

        this.markerid = 0;

        this.storage = new Storage();
        this.storage.push(this.getState());

        this.__select = false;

        this.pInitElement(element);
    }

    private pInitElement(element : HTMLCanvasElement) : void {
        element.addEventListener('mousedown',     event => this.pMouseDownEvent(event));
        element.addEventListener('mousemove',     event => this.pMouseMoveEvent(event));
        element.addEventListener('mouseup',       () => this.pMouseUpEvent());
        element.addEventListener('mouseleave',    () => this.pMouseLeaveEvent());
        element.addEventListener('keydown',       event => this.pKeyPressEvent(event));
        element.addEventListener('focus',         () => this.focused());
        element.addEventListener('resize',         () => this.update());
    }

    private pMouseDownEvent(event : MouseEvent) {
        const new_caret_pos = this.renderer.cursorPosToCaretPos(event.offsetX, 
            event.offsetY, this.buffer.data());
        if (event.ctrlKey === true) {
            this.markers.mark(new_caret_pos, this.markerid);
        }
        else {
            if (event.shiftKey === true) 
                this.buffer.caret.select(new_caret_pos);
            else
                this.buffer.caret.move(new_caret_pos);
            this.__select = true;
        }
        this.update();
    }

    private pMouseMoveEvent(event : MouseEvent) {
        const new_caret_pos = this.renderer.cursorPosToCaretPos(event.offsetX, 
            event.offsetY, this.buffer.data());
        this.markers.select(new_caret_pos);
        if (this.__select) this.buffer.caret.select(new_caret_pos);
        this.update();
    }

    private pMouseUpEvent() {
        this.__select = false;
    }

    private pMouseLeaveEvent() {
        this.hideSelect();
        this.__select = false;
        this.update();
    }

    private pKeyPressEvent(event : KeyboardEvent) : void {
        const key = event.key.toUpperCase();
        if ("Z" === key && event.ctrlKey) {
            this.undo();
        }
        else if ("Y" === key && event.ctrlKey) {
            this.redo();
        }
        else if ("C" === key && event.ctrlKey) {
            this.pCopyToClipboard();
        }
        else if ("V" === key && event.ctrlKey) {
            this.pPasteFromClipboard();
        }
        else if ("X" === key && event.ctrlKey) {
            this.pCutToClipboard();
        }
        else if (/^[A-Z\#\$\^\-\+\*\/\=\|0-9().]$/.test(key)) {
            this.insertText(key);
        }
        else if ("BACKSPACE" === key) {
            this.backspase();
        }
        else if ("DELETE" === key) {
            this.delete();
        }
        else if ("ARROWLEFT" === key) {
            this.toLeft();
        }
        else if ("ARROWRIGHT" === key) {
            this.toRight();
        }
    }

    private getState() : Unit {
        return { buffer: this.buffer, markers: this.markers };
    }

    private pCopyToClipboard() {
        const data = this.buffer.getSelected();
        if (data.length === 0) return;
        navigator.clipboard.writeText(data)
        .then(res => {})
        .catch(err => {});
    }

    private pPasteFromClipboard() {
        navigator.clipboard.readText()
        .then(data => {
            if (data === undefined || data.length === 0) return;
            this.insertText(Buffer.normalizeOverline(data));
        })
        .catch(err => {}); 
    }

    private pCutToClipboard() {
        const data = this.buffer.getSelected();
        if (data.length === 0) return;
        this.removeSelected();
        navigator.clipboard.writeText(data)
        .then(res => {})
        .catch(err => {});
    }

    focus() : void {
        this.renderer.element.focus();
    }

    toLeft() : void {
        this.buffer.toLeft();
        this.update();
    }

    toRight() : void {
        this.buffer.toRight();
        this.update();
    }

    caretMove(pos : number) : void {
        this.buffer.caret.move(pos);
        this.update();
    }

    caretSelect(pos : number) : void {
        this.buffer.caret.select(pos);
        this.update();
    }

    hideSelect() : void {
        this.markers.select(undefined);
        this.update();
    }

    select(pos : number) : void {
        this.markers.select(pos);
        this.update();
    }

    setData(buffer : BufferBase, markers : MarkersBase) {
        this.buffer.from(buffer);
        this.markers.from(buffer.data(), markers);
        this.update();
    }

    undo() {
        const unit = this.storage.undo();
        if (unit === undefined) return;
        this.buffer = unit.buffer;
        this.markers = unit.markers;
        this.update();
    }

    redo() {
        const unit = this.storage.redo();
        if (unit === undefined) return;
        this.buffer = unit.buffer;
        this.markers = unit.markers;
        this.update();
    }

    complement() {
        this.buffer.insertOverline();
        this.storage.push(this.getState());
        this.update();
    }

    insertText(text : string) : void {
        this.buffer.addData(text);
        this.storage.push(this.getState());
        this.update();
    }

    removeSelected() : void {
        if (this.buffer.caret.hasSelect()) {
            this.buffer.removeSelect();
            this.storage.push(this.getState());
            this.update();
        }
    }

    backspase() : void {
        this.buffer.removeCharBefore();
        this.storage.push(this.getState());
        this.update();
    }

    delete() : void {
        this.buffer.removeChar();
        this.storage.push(this.getState());
        this.update();
    }

    callback__TextInserted(pos : number, size : number) : void {
        this.markers.insert(this.buffer.data(), pos, size);
    }

    callback__TextErased(pos : number, size : number) : void {
        this.markers.erase(this.buffer.data(), pos, size);
    }

    update() : void {
        this.renderer.render(this.buffer, this.markers);
    }
}