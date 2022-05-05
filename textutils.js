class TextUtils {
    static getCharWidth(context, char) {
        if (char == '{' || char == '}') return 0;
        return context.measureText(char).actualBoundingBoxRight;
    }

    static getBufferWidth(context, buffer) {
        const string = buffer.left + '=' + buffer.right;
        return TextUtils.getStringWidth(context, string);
    }

    static getStringWidth(context, string) {
        const normal_string = string.replaceAll(/[\{\}]/g, '');
        return context.measureText(normal_string).actualBoundingBoxRight;
    }

    static getStringMetrics(context, string) {
        const normal_string = string.replaceAll(/[\{\}]/g, '');
        const measure = context.measureText(normal_string);
        return { width: measure.actualBoundingBoxRight, 
            height: measure.actualBoundingBoxDescent };
    }

    static splitOverline(text) {
        let result = [];
        let level = 0;
        let start_pos = 0;
        for (let i = 0; i < text.length; ++i) {
            if ( text[i] === '{' ) {
                result.push({ level, value: text.substring(start_pos, i) });
                ++level
                start_pos = i + 1;
            }
            else if ( text[i] === '}' ) {
                result.push({ level, value: text.substring(start_pos, i) });
                --level;
                start_pos = i + 1;
            }
        }
        if ( start_pos < text.length ) {
            result.push({ level: level, value: text.substring(start_pos, text.length) })
        }
        return result;
    }

    static fillRect(context, x, y, w, h, color) {
        const old_style = context.fillStyle;
        context.fillStyle = color;
        context.fillRect(x, y, w, h);
        context.fillStyle = old_style;
    }

    static fillText(context, text, x, y, font, align = 'left') {
        const old_font = context.font;
        context.font = font;
        context.textAlign = align;
        context.fillText(text, x, y);
        context.font = old_font;
    }

    static getMaxLevel(parts = []) {
        let max = 0;
        for (let idx = 0; idx < parts.length; ++idx) {
            if(parts[idx].level > max) {
                max = parts[idx].level;
            }
        }
        return max;
    }

    static drawLText(context, data, offsetX = 0, offsetY = 10) {
        const parts = TextUtils.splitOverline(data);
        const max_lvl = TextUtils.getMaxLevel(parts) * 2;

        let cur_pos = offsetX;
        context.beginPath();
        for (let i = 0; i < parts.length; ++i) {
            const width = TextUtils.getStringWidth(context, parts[i].value);
            context.fillText(parts[i].value, cur_pos, offsetY); 
            for (let j = 0; j < parts[i].level; ++j) {
                context.moveTo(cur_pos, offsetY - max_lvl + j * 2);
                context.lineTo(cur_pos + width, offsetY - max_lvl + j * 2);
            }
            cur_pos += width;
        }
        context.stroke();
        return cur_pos;
    }

    static drawMarked(context, buffer, markers, tree, offsetX = 0, offsetY = 10) {
        for (let marker = 0; marker < markers.length; ++marker) {
            if (markers[marker].length === 1) {
                const marked = search(tree, markers[marker][0]);
                TextUtils.paintCharArrayBackground(context, buffer, MarkerColor(marker).parent, marked.parent, offsetX, offsetY);
                TextUtils.paintCharArrayBackground(context, buffer, MarkerColor(marker).children, marked.children, offsetX, offsetY);
            }
            else if (markers[marker].length > 1) {
                const is_brothers = isBrothers(tree, markers[marker]);
                if (is_brothers.result === true) {
                    TextUtils.paintCharArrayBackground(context, buffer, MarkerColor(marker).extra, is_brothers.parent.positions, offsetX, offsetY);
                }
                for (let idx = 0; idx < markers[marker].length; ++idx) {
                    const marked = search(tree, markers[marker][idx]);
                    TextUtils.paintCharArrayBackground(context, buffer, MarkerColor(marker).parent, marked.parent, offsetX, offsetY);
                    TextUtils.paintCharArrayBackground(context, buffer, MarkerColor(marker).children, marked.children, offsetX, offsetY);
                }
            }
        }        
    } 

    static paintCharArrayBackground(context, data, color, arr, offsetX = 0, offsetY = 10) {
        for (let i = 0; i < arr.length; ++i) {
            TextUtils.paintCharBackground(context, data, color, arr[i], offsetX, offsetY);
        }
    }

    static paintCharBackground(context, data, color, pos, offsetX = 0, offsetY = 10) {
        const offset_metrics = TextUtils.getStringMetrics(context, data.substring(0, pos));
        const char_metrics = TextUtils.getStringMetrics(context, data[pos]);
        const old_style = context.fillStyle;
        context.fillStyle = color;
        context.fillRect(offset_metrics.width + offsetX, offsetY, char_metrics.width + offsetX, char_metrics.height);
        context.fillStyle = old_style;
    }

    static findOverlineStart(text, offset = 0) {
        for(let idx = offset; idx < text.length; ++idx) {
            if (text[idx] === '{') return idx;
        }
        return -1;
    }

    static findOverlineEnd(text, start) {
        let level = 0;
        for(let idx = start; idx < text.length; ++idx) {
            if (text[idx] === '{') ++level;
            if (text[idx] === '}') {
                if (--level === 0) return idx;
            }
        }
        return -1;
    }
}