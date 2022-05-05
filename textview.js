import { create2 } from "./ts-built/Algorithm/tree.js";
import { ErrorCode, is_valid_expression } from "./ts-built/Algorithm/validator.js";

export class TextView 
{
    static uid = 0;

    constructor(element 
               , uid
               , buffer
               , op_id
               , conn        = 0
               , markers     = []
               , numbers     = []
               , error       = 0
               , error_text  = "Не проверено"
               ) 
    {
        this.uid = (uid === undefined ? TextView.uid++ : uid);
        this.element = element;
        this.buffer = buffer;
        this.op_id = op_id;
        this.conn = conn;
        this.markers = markers;
        this.numbers = numbers;
        this.error = error;
        this.error_text = error_text;
        this.img = this.createImage();

        this.updateUid(uid);
        this.update();
    }

    updateData(buffer
            , op_id
            , markers
            , numbers
        ) 
    {
        this.buffer = buffer;
        this.op_id = op_id;
        this.conn = 0;
        this.markers = markers;
        this.numbers = numbers;
        this.error = 0;
        this.error_text = "Не проверено";
        this.img = this.createImage();

        this.update();
    }

    updateUid(uid) {
        if (uid !== undefined) 
            TextView.uid = Math.max(TextView.uid, uid + 1);
    }

    getMarkers(left) {
        if (left) return this.markers.left;
        return this.markers.right;
    }

    __getMarkers() {
        // Костыль для получения объекта для сервиса
        //const result = [];
        //for (let idx = 0; idx < this.markers.left.length; idx++) {
        //    result.push({ left: this.markers.left[idx], right: this.markers.right[idx] });
        //}
        return this.markers;
    }

    ___getMarkers() {
        // Костыль для рисования
        const result = { left: [], right: [] };
        for (let idx = 0; idx < this.markers.length; idx++) {
           result.left.push(this.markers[idx].left);
           result.right.push(this.markers[idx].right);
        }
        return result;
    }

    getNumbers() {
        return this.numbers;
    }

    createImage() {
        const work_canvas = TextView.getWorkCanvas(this.buffer);
        const context = TextView.getContext(work_canvas);

        if(is_valid_expression(this.buffer.left).error === ErrorCode.no_error) {
            const tree = create2(this.buffer.left);
            TextUtils.drawMarked(context, this.buffer.left, this.___getMarkers().left, tree);
        }
        const offset = TextUtils.drawLText(context, this.buffer.left + '=');
        if(is_valid_expression(this.buffer.right).error === ErrorCode.no_error) {
            const tree = create2(this.buffer.right);
            TextUtils.drawMarked(context, this.buffer.right, this.___getMarkers().right, tree, offset);
        }
        TextUtils.drawLText(context, this.buffer.right, offset);
        return work_canvas.toDataURL();
    }    

    static getWorkCanvas(buffer) {
        const work_canvas = document.querySelector('.work-canvas');
        const context = TextView.getContext(work_canvas);
        const new_canvas_width = TextUtils.getBufferWidth(context, buffer);
        work_canvas.width = new_canvas_width;
        work_canvas.height = 30;
        context.clearRect(0, 0, work_canvas.width, work_canvas.height);
        return work_canvas;
    }

    static getContext(element) {
        const context = element.getContext("2d");
        context.font = '20pt LFont';
        context.textBaseline = 'top';
        return context;
    }

    setConncection(conn) {
        this.conn = conn;
        this.element.querySelector('.expr-conn').innerText = this.conn === 0 ? '?' : this.conn;
    }

    setError(error, error_text) {
        const error_icon = this.element.querySelector('.expr-error');
        error_icon.src = this.errorIcon(error);
        this.error_text = error_text;
    }

    update() {
        this.element.querySelector('.expr-uid').innerText = this.uid;
        this.element.querySelector('.expr-conn').innerText = this.conn === 0 ? '?' : this.conn;
        this.element.querySelector('.expr-error').src = this.errorIcon(this.error);
        this.element.querySelector('.expr-op').innerText = operationById(this.op_id);
        this.element.querySelector('.expr-val').src = this.img;
    }

    errorIcon(error) {
        if (error === 0) return './ErrorIcons/NoCheckIcon.png';
        if (error === 1) return './ErrorIcons/OkIcon.png';
        if (error === 2 || error === 3) return './ErrorIcons/ErrorIcon.png';
        if (error === 4) return './ErrorIcons/WarningIcon.png';
        return './ErrorIcons/NoCheckIcon.png';
    }
}