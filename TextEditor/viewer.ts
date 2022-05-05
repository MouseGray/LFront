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
    static uid : number = 0;

    uid : number;
    element : HTMLTableRowElement;
    buffer : BufferUnit;
    markers : MarkersUnit;
    operation : number;
    numbers : number[];
    connection : number;
    error : Error;
    image : string;

    constructor(element : HTMLTableRowElement, uid : number, buffer : BufferUnit, 
        operation : number, connection : number = 0, 
        markers : MarkersUnit = new MarkersUnit(undefined, undefined), 
        numbers : number[] = [], error : Error = new Error()) 
    {
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

    static extractUid(uid : number) : number {
        return (uid === undefined ? TextViewer.uid++ : uid);
    }

    static updateUid(uid : number) : void {
        if (uid !== undefined) 
            TextViewer.uid = Math.max(TextViewer.uid, uid + 1);
    }

    static errorIcon(error : number) : string {
        if (error === 0) return './ErrorIcons/NoCheckIcon.png';
        if (error === 1) return './ErrorIcons/OkIcon.png';
        if (error === 2 || error === 3) return './ErrorIcons/ErrorIcon.png';
        if (error === 4) return './ErrorIcons/WarningIcon.png';
        return './ErrorIcons/NoCheckIcon.png';
    }

    setData(buffer : BufferUnit, markers : MarkersUnit, numbers : number[]) : void {
        this.buffer = BufferUnit.copy(buffer);
        this.markers = MarkersUnit.copy(markers);
        this.numbers = copyArray(numbers);
        this.image = this.createImage();
        this.updateText();
    }

    setConnection(connection : number) : void {
        this.connection = connection;
        this.updateConnection();
    }

    setError(error : Error) : void {
        this.error = Error.copy(error);
        this.updateError();
    }

    setOperation(operation : number) : void {
        this.operation = operation;
        this.updateOperation();
    }

    updateConnection() : void {
        this.element.querySelector('.expr-conn').innerHTML = 
            this.connection === 0 ? '?' : '' + this.connection;
    }

    updateError() : void {
        (this.element.querySelector('.expr-error') as HTMLImageElement).src = 
            TextViewer.errorIcon(this.error.code);
    }

    updateOperation() : void {
        this.element.querySelector('.expr-op').innerHTML = 
            operationByID(this.operation);
    }

    updateText() : void {
        (this.element.querySelector('.expr-val') as HTMLImageElement)
            .src = this.image;
    }

    update() : void {
        this.element.querySelector('.expr-uid').innerHTML = '' + this.uid;
        this.updateText();
        this.updateConnection();
        this.updateError();
        this.updateOperation();
    }

    createImage() {
        const work_canvas = TextViewer.getWorkCanvas(this.buffer);
        const context = TextViewer.getContext(work_canvas);

        if(is_valid_expression(this.buffer.left.data()).error === ErrorCode.no_error) {
            const tree = create2(this.buffer.left.data());
            for (let idx = 0; idx < 5; idx++) {
                Renderer.renderMarkerImpl(context, this.buffer.left.data(), idx, 
                Markers.getConfigImpl(this.markers.left.get(idx), tree), 0, 10);
            }
        }
        Renderer.renderTextAndOverline(context, this.buffer.left.data() + '=', 0, 10);
        const offset = renderutils.stringMetrics(context, this.buffer.left.data() + '=').width;
        if(is_valid_expression(this.buffer.right.data()).error === ErrorCode.no_error) {
            const tree = create2(this.buffer.right.data());
            for (let idx = 0; idx < 5; idx++) {
                Renderer.renderMarkerImpl(context, this.buffer.right.data(), idx, 
                    Markers.getConfigImpl(this.markers.right.get(idx), tree), offset, 10);
            }
        }
        Renderer.renderTextAndOverline(context, this.buffer.right.data(), offset, 10);
        return work_canvas.toDataURL();
    }

    static getWorkCanvas(buffer : BufferUnit) {
        const work_canvas : HTMLCanvasElement = document.querySelector('.work-canvas');
        const context = TextViewer.getContext(work_canvas);
        const new_canvas_width = renderutils.stringMetrics(context, buffer.data()).width;
        work_canvas.width = new_canvas_width;
        work_canvas.height = 30;
        renderutils.clear(context, work_canvas.width, work_canvas.height);
        return work_canvas;
    }

    static getContext(element : HTMLCanvasElement) : CanvasRenderingContext2D {
        const context = element.getContext("2d");
        context.font = '20pt LFont';
        context.textBaseline = 'top';
        return context;
    }
}