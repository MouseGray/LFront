import { Overline } from "./overline.js";
export var renderutils;
(function (renderutils) {
    class StringMetrics {
        width;
        height;
        constructor() {
            this.width = 0;
            this.height = 0;
        }
    }
    renderutils.StringMetrics = StringMetrics;
    function clear(context, w, h) {
        context.clearRect(0, 0, w, h);
    }
    renderutils.clear = clear;
    function fillRect(context, x, y, w, h, style) {
        const old_style = context.fillStyle;
        context.fillStyle = style;
        context.fillRect(x, y, w, h);
        context.fillStyle = old_style;
    }
    renderutils.fillRect = fillRect;
    function drawLine(context, x1, y1, x2, y2, style) {
        const old_style = context.fillStyle;
        context.fillStyle = style;
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.fillStyle = old_style;
    }
    renderutils.drawLine = drawLine;
    function fillCharBkgArray(context, text, data, style, offsetX, offsetY) {
        for (const pos of data)
            fillCharBkg(context, text, pos, style, offsetX, offsetY);
    }
    renderutils.fillCharBkgArray = fillCharBkgArray;
    function fillCharBkg(context, text, pos, style, offsetX, offsetY) {
        const offset_metrics = stringMetrics(context, text.substring(0, pos));
        if (text[pos] == '{') {
            const overline_metrics = overlineMetrics(context, text, pos);
            fillRect(context, offset_metrics.width + offsetX, offsetY - 2 * overline_metrics.height - 1, overline_metrics.width, 3, style);
        }
        else {
            const char_metrics = stringMetrics(context, text[pos]);
            fillRect(context, offset_metrics.width + offsetX, offsetY, char_metrics.width, char_metrics.height, style);
        }
    }
    renderutils.fillCharBkg = fillCharBkg;
    function stringMetrics(context, text) {
        const normalized_text = normalizeText(text);
        const metrics = context.measureText(normalized_text);
        return { width: metrics.width, height: 20 };
    }
    renderutils.stringMetrics = stringMetrics;
    function overlineMetrics(context, text, pos) {
        const overline = Overline.getOverlineConfig(text, pos);
        const metrics = stringMetrics(context, text.substring(overline.start, overline.end));
        return { width: metrics.width, height: overline.level };
    }
    renderutils.overlineMetrics = overlineMetrics;
    function normalizeText(text) {
        return text.replaceAll(/[\{\}]/g, '');
    }
    renderutils.normalizeText = normalizeText;
})(renderutils || (renderutils = {}));
