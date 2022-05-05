import { MarkerColor, SelectMarkerColor } from "../Definitions/colors.js";
import { Overline, OverlineMetrics } from "./overline.js";
import { renderutils } from "./render_utils.js";
import { inRect } from "./utils.js";
export class Renderer {
    offsetY;
    offsetX;
    caret_cache;
    carete_phase;
    carete_timer;
    font;
    element;
    constructor(element) {
        this.element = element;
        this.offsetX = 0;
        this.offsetY = 10;
        this.font = '20pt LFont';
        this.caret_cache = undefined;
        this.carete_phase = false;
        this.carete_timer = undefined;
    }
    cursorPosToCaretPos(cursorX, cursorY, data) {
        const context = this.getContext();
        if (cursorY <= this.offsetY) {
            const overlines = Overline.getOverlines(data);
            const overlinesMetrics = OverlineMetrics.getOverlinesMetrics(context, data, overlines, this.offsetY);
            for (let idx = 0; idx < overlinesMetrics.length; ++idx) {
                if (inRect(overlinesMetrics[idx].startX, overlinesMetrics[idx].Y - 1, overlinesMetrics[idx].endX, overlinesMetrics[idx].Y, cursorX, cursorY))
                    return overlines[idx].start;
            }
        }
        const real_cursor_x = cursorX + this.offsetX;
        let length = 0;
        for (let idx = 0; idx < data.length; ++idx) {
            length += renderutils.stringMetrics(context, data[idx]).width;
            if (length > real_cursor_x)
                return idx;
        }
        return data.length;
    }
    getContext() {
        const context = this.element.getContext('2d');
        context.font = this.font;
        context.textBaseline = 'top';
        return context;
    }
    clear(context) {
        renderutils.clear(context, this.element.width, this.element.height);
    }
    renderCaret(context, text, pos) {
        this.caret_cache = renderutils.stringMetrics(context, text.substring(0, pos));
        renderutils.drawLine(context, this.caret_cache.width + this.offsetX, this.offsetY, this.caret_cache.width + this.offsetX, this.offsetY + this.caret_cache.height, '#000000');
    }
    static renderText(context, text, offsetX, offsetY) {
        context.fillText(renderutils.normalizeText(text), offsetX, offsetY);
    }
    renderSelect(context, text, start, end) {
        for (let idx = start; idx < end; ++idx) {
            renderutils.fillCharBkg(context, text, idx, '#00FFAAFF', this.offsetX, this.offsetY);
        }
    }
    static renderOverlines(context, text, overlines, offsetX, offsetY) {
        for (const overline of overlines) {
            Renderer.renderOverline(context, text, overline, offsetX, offsetY);
        }
    }
    static renderOverline(context, text, overline, offsetX, offsetY) {
        const offset = renderutils.stringMetrics(context, text.substring(0, overline.start)).width;
        const end = renderutils.stringMetrics(context, text.substring(0, overline.end)).width;
        renderutils.drawLine(context, offset + offsetX, offsetY - 2 * overline.level, end + offsetX, offsetY - 2 * overline.level, '#000000');
    }
    renderMarkerSelect(context, text, markers) {
        const select = markers.getSelectConfig();
        if (select === undefined)
            return;
        renderutils.fillCharBkgArray(context, text, select.projections, SelectMarkerColor().parent, this.offsetX, this.offsetY);
        renderutils.fillCharBkgArray(context, text, select.childrenProjectionsAll(), SelectMarkerColor().children, this.offsetX, this.offsetY);
    }
    static renderMarkers(context, text, markers, offsetX, offsetY) {
        for (let idx = 0; idx < markers.data().length; ++idx) {
            Renderer.renderMarker(context, text, idx, markers, offsetX, offsetY);
        }
    }
    static renderMarker(context, text, marker_id, markers, offsetX, offsetY) {
        Renderer.renderMarkerImpl(context, text, marker_id, markers.getConfig(marker_id), offsetX, offsetY);
    }
    static renderMarkerImpl(context, text, marker_id, marker_config, offsetX, offsetY) {
        if (marker_config === undefined)
            return;
        renderutils.fillCharBkgArray(context, text, marker_config.extra, MarkerColor(marker_id).extra, offsetX, offsetY);
        renderutils.fillCharBkgArray(context, text, marker_config.parent, MarkerColor(marker_id).parent, offsetX, offsetY);
        renderutils.fillCharBkgArray(context, text, marker_config.children, MarkerColor(marker_id).children, offsetX, offsetY);
    }
    render(text, markers) {
        const context = this.getContext();
        context.beginPath();
        this.clear(context);
        Renderer.renderMarkers(context, text.data(), markers, this.offsetX, this.offsetY);
        this.renderMarkerSelect(context, text.data(), markers);
        this.renderSelect(context, text.data(), text.caret.left(), text.caret.right());
        Renderer.renderTextAndOverlineImpl(context, text.data(), this.offsetX, this.offsetY);
        this.renderCaret(context, text.data(), text.caret.caret);
        context.stroke();
    }
    static renderTextAndOverline(context, text, offsetX, offsetY) {
        context.beginPath();
        const overlines = Overline.getOverlines(text);
        Renderer.renderText(context, text, offsetX, offsetY);
        Renderer.renderOverlines(context, text, overlines, offsetX, offsetY);
        context.stroke();
    }
    static renderTextAndOverlineImpl(context, text, offsetX, offsetY) {
        const overlines = Overline.getOverlines(text);
        Renderer.renderText(context, text, offsetX, offsetY);
        Renderer.renderOverlines(context, text, overlines, offsetX, offsetY);
    }
}
