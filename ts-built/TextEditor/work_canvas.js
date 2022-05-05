import { create2 } from "../Algorithm/tree.js";
import { ErrorCode, is_valid_expression } from "../Algorithm/validator.js";
import { Markers } from "./markers.js";
import { Renderer } from "./renderer.js";
import { renderutils } from "./render_utils.js";
export var work_canvas;
(function (work_canvas_1) {
    function createImage(buffer, markers) {
        const work_canvas = getWorkCanvas(buffer.data());
        const context = getContext(work_canvas);
        if (is_valid_expression(buffer.data()).error === ErrorCode.no_error) {
            const tree = create2(buffer.data());
            for (let idx = 0; idx < 5; idx++) {
                Renderer.renderMarkerImpl(context, buffer.data(), idx, Markers.getConfigImpl(markers.get(idx), tree), 0, 10);
            }
        }
        Renderer.renderTextAndOverline(context, buffer.data(), 0, 10);
        return work_canvas.toDataURL();
    }
    work_canvas_1.createImage = createImage;
    function createSimpleImage(text) {
        const work_canvas = getWorkCanvas(text);
        const context = getContext(work_canvas);
        Renderer.renderText(context, text, 0, 10);
        return work_canvas.toDataURL();
    }
    work_canvas_1.createSimpleImage = createSimpleImage;
    function getWorkCanvas(buffer) {
        const work_canvas = document.querySelector('.work-canvas');
        const context = getContext(work_canvas);
        const new_canvas_width = renderutils.stringMetrics(context, buffer).width;
        work_canvas.width = new_canvas_width;
        work_canvas.height = 30;
        renderutils.clear(context, work_canvas.width, work_canvas.height);
        return work_canvas;
    }
    function getContext(element) {
        const context = element.getContext("2d");
        context.font = '20pt LFont';
        context.textBaseline = 'top';
        return context;
    }
})(work_canvas || (work_canvas = {}));
