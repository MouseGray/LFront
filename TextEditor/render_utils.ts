import { Overline } from "./overline.js";

export namespace renderutils {
    export class StringMetrics {
        width : number;
        height : number;
    
        constructor() {
            this.width = 0;
            this.height = 0;
        }
    }

    export type Style = string | CanvasGradient | CanvasPattern;

    export function clear(context : CanvasRenderingContext2D, w : number, h : number) : void {
        context.clearRect(0, 0, w, h);
    }

    export function fillRect(context : CanvasRenderingContext2D, x : number, y : number, 
        w : number, h : number, style : Style) : void {
        const old_style = context.fillStyle;
        context.fillStyle = style;
        context.fillRect(x, y, w, h);
        context.fillStyle = old_style;
    }

    export function drawLine(context : CanvasRenderingContext2D, x1 : number, y1 : number,
        x2 : number, y2 : number, style : Style) : void {
        const old_style = context.fillStyle;
        context.fillStyle = style;
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.fillStyle = old_style;
    }

    export function fillCharBkgArray(context : CanvasRenderingContext2D, 
        text : string, data : number[], style : Style, offsetX : number, offsetY : number) : void {
        for (const pos of data)
            fillCharBkg(context, text, pos, style, offsetX, offsetY);
    }
    
    export function fillCharBkg(context : CanvasRenderingContext2D, 
        text : string, pos : number, style : Style, offsetX : number, offsetY : number) : void {
        const offset_metrics : StringMetrics = stringMetrics(context, text.substring(0, pos));
        if (text[pos] == '{') {
            const overline_metrics = overlineMetrics(context, text, pos);
            fillRect(context, offset_metrics.width + offsetX, offsetY - 2*overline_metrics.height - 1, 
                overline_metrics.width, 3, style);
        }
        else {
            const char_metrics : StringMetrics = stringMetrics(context, text[pos]);
            fillRect(context, offset_metrics.width + offsetX, offsetY, 
                char_metrics.width, char_metrics.height, style);
        }
    }

    export function stringMetrics(context : CanvasRenderingContext2D, text : string) : StringMetrics {
        const normalized_text = normalizeText(text);
        const metrics : TextMetrics = context.measureText(normalized_text);
        return { width: metrics.width, height: 20 };
    }

    export function overlineMetrics(context : CanvasRenderingContext2D, 
        text : string, pos : number) : StringMetrics {
        const overline = Overline.getOverlineConfig(text, pos);
        const metrics = stringMetrics(context, 
            text.substring(overline.start, overline.end));
        return { width: metrics.width, height: overline.level };
    }

    export function normalizeText(text : string) : string {
        return text.replaceAll(/[\{\}]/g, '');
    }
}