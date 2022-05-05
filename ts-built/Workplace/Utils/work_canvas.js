import { create2 } from "../../Algorithm/tree.js";
import { ErrorCode, is_valid_expression } from "../../Algorithm/validator.js";
import { Markers } from "../../TextEditor/markers.js";
import { Renderer } from "../../TextEditor/renderer.js";
import { renderutils } from "../../TextEditor/render_utils.js";
export function workCanvas() {
    return document.querySelector('.work-canvas');
}
export function initCanvas(canvas, width, height) {
    const context = getContext(canvas);
    canvas.width = width;
    canvas.height = height;
    context.clearRect(0, 0, width, height);
    return getContext(canvas);
}
export function getContext(canvas) {
    const context = canvas.getContext("2d");
    context.font = '20pt LFont';
    context.textBaseline = 'top';
    return context;
}
export function createImage(text, markers) {
    const work_canvas = workCanvas();
    let context = getContext(work_canvas);
    const width = renderutils.stringMetrics(context, text).width, height = 30;
    context = initCanvas(work_canvas, width, height);
    if (is_valid_expression(text).error === ErrorCode.no_error) {
        const tree = create2(text);
        for (let idx = 0; idx < 5; idx++) {
            Renderer.renderMarkerImpl(context, text, idx, Markers.getConfigImpl(markers[idx], tree), 0, 10);
        }
    }
    Renderer.renderTextAndOverline(context, text, 0, 10);
    return { url: work_canvas.toDataURL(), width: width, height: height };
}
