import { create2 } from "../Algorithm/tree.js";
import { ErrorCode, is_valid_expression } from "../Algorithm/validator.js";
import { operationByID } from "../Definitions/operations.js";
import { copyArray } from "../Utils/utils.js";
import { BufferUnit } from "./buffer_unit.js";
import { Error } from "./error.js";
import { Markers } from "./markers.js";
import { MarkersUnit } from "./markers_unit.js";
import { Renderer } from "./renderer.js";
import { renderutils } from "./render_utils.js";
export class TextViewer {
    static uid = 0;
    uid;
    element;
    buffer;
    markers;
    operation;
    numbers;
    connection;
    error;
    image;
    constructor(element, uid, buffer, operation, connection = 0, markers = new MarkersUnit(undefined, undefined), numbers = [], error = new Error()) {
        this.uid = TextViewer.extractUid(uid);
        this.element = element;
        this.buffer = BufferUnit.copy(buffer);
        this.operation = operation;
        this.connection = connection;
        this.markers = MarkersUnit.copy(markers);
        this.numbers = copyArray(numbers);
        this.error = Error.copy(error);
        this.image = this.createImage();
        TextViewer.updateUid(uid);
        this.update();
    }
    static extractUid(uid) {
        return (uid === undefined ? TextViewer.uid++ : uid);
    }
    static updateUid(uid) {
        if (uid !== undefined)
            TextViewer.uid = Math.max(TextViewer.uid, uid + 1);
    }
    static errorIcon(error) {
        if (error === 0)
            return './ErrorIcons/NoCheckIcon.png';
        if (error === 1)
            return './ErrorIcons/OkIcon.png';
        if (error === 2 || error === 3)
            return './ErrorIcons/ErrorIcon.png';
        if (error === 4)
            return './ErrorIcons/WarningIcon.png';
        return './ErrorIcons/NoCheckIcon.png';
    }
    setData(buffer, markers, numbers) {
        this.buffer = BufferUnit.copy(buffer);
        this.markers = MarkersUnit.copy(markers);
        this.numbers = copyArray(numbers);
        this.image = this.createImage();
        this.updateText();
    }
    setConnection(connection) {
        this.connection = connection;
        this.updateConnection();
    }
    setError(error) {
        this.error = Error.copy(error);
        this.updateError();
    }
    setOperation(operation) {
        this.operation = operation;
        this.updateOperation();
    }
    updateConnection() {
        this.element.querySelector('.expr-conn').innerHTML =
            this.connection === 0 ? '?' : '' + this.connection;
    }
    updateError() {
        this.element.querySelector('.expr-error').src =
            TextViewer.errorIcon(this.error.code);
    }
    updateOperation() {
        this.element.querySelector('.expr-op').innerHTML =
            operationByID(this.operation);
    }
    updateText() {
        this.element.querySelector('.expr-val')
            .src = this.image;
    }
    update() {
        this.element.querySelector('.expr-uid').innerHTML = '' + this.uid;
        this.updateText();
        this.updateConnection();
        this.updateError();
        this.updateOperation();
    }
    createImage() {
        const work_canvas = TextViewer.getWorkCanvas(this.buffer);
        const context = TextViewer.getContext(work_canvas);
        if (is_valid_expression(this.buffer.left.data()).error === ErrorCode.no_error) {
            const tree = create2(this.buffer.left.data());
            for (let idx = 0; idx < 5; idx++) {
                Renderer.renderMarkerImpl(context, this.buffer.left.data(), idx, Markers.getConfigImpl(this.markers.left.get(idx), tree), 0, 10);
            }
        }
        Renderer.renderTextAndOverline(context, this.buffer.left.data() + '=', 0, 10);
        const offset = renderutils.stringMetrics(context, this.buffer.left.data() + '=').width;
        if (is_valid_expression(this.buffer.right.data()).error === ErrorCode.no_error) {
            const tree = create2(this.buffer.right.data());
            for (let idx = 0; idx < 5; idx++) {
                Renderer.renderMarkerImpl(context, this.buffer.right.data(), idx, Markers.getConfigImpl(this.markers.right.get(idx), tree), offset, 10);
            }
        }
        Renderer.renderTextAndOverline(context, this.buffer.right.data(), offset, 10);
        return work_canvas.toDataURL();
    }
    static getWorkCanvas(buffer) {
        const work_canvas = document.querySelector('.work-canvas');
        const context = TextViewer.getContext(work_canvas);
        const new_canvas_width = renderutils.stringMetrics(context, buffer.data()).width;
        work_canvas.width = new_canvas_width;
        work_canvas.height = 30;
        renderutils.clear(context, work_canvas.width, work_canvas.height);
        return work_canvas;
    }
    static getContext(element) {
        const context = element.getContext("2d");
        context.font = '20pt LFont';
        context.textBaseline = 'top';
        return context;
    }
}
