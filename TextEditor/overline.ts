import { renderutils } from "./render_utils.js";
import { validationStringIndex } from "./utils.js";

export class Overline {
    start : number;
    end : number;
    level : number;

    constructor() {
        this.start = this.end = 0;
        this.level = 0;
    }

    static getMaxLevel(overlines : Overline[]) : number {
        let max_level : number = 0;
        for(const overline of overlines) {
            if (overline.level > max_level) 
                max_level = overline.level;
        }
        return max_level;
    }

    static getOverlines(text : string) : Overline[] {
        const result : Overline[] = [];
        for(let idx = 0; idx < text.length; ++idx) {
            if (text[idx] === '{') 
                result.push(Overline.getOverlineConfig(text, idx));
        }
        return result;
    }

    static getOverlineConfig(text : string, start : number) : Overline {
        let level : number = 0;
        let max_level : number = 0;
        validationStringIndex(text, start);
        if (text[start] !== '{')
            throw new Error(`Argument 'start' is not overline start`);
        for (let idx = start; idx < text.length; ++idx) {
            if (text[idx] === '{') {
                if (++level > max_level) 
                    max_level = level;
            }
            if (text[idx] === '}') {
                if (--level === 0) {
                    return { start: start, end: idx, level: max_level };
                }
            }
        }
        throw new Error(`Not found overline end`);
    }
} 

export class OverlineMetrics {
    startX : number;
    endX : number;
    Y : number;

    constructor() {
        this.startX = this.endX = 0;
        this.Y = 0;
    }

    static getOverlinesMetrics(context : CanvasRenderingContext2D, text : string, 
        overlines : Overline[], offsetY : number) : OverlineMetrics[] {
        const result : OverlineMetrics[] = [];
        for (const overline of overlines) 
            result.push(OverlineMetrics.getOverlineMetrics(context, text, overline, offsetY));
        return result;
    }
    static getOverlineMetrics(context : CanvasRenderingContext2D, text : string, 
        overline : Overline, offsetY : number) : OverlineMetrics {
        const result = new OverlineMetrics();
        result.startX = renderutils.stringMetrics(context, 
            text.substring(0, overline.start)).width;
        result.endX = result.startX + renderutils.stringMetrics(context, 
            text.substring(overline.start, overline.end)).width;
        result.Y = offsetY - 2*overline.level;
        return result;
    }
}