export class TextEdit 
{
    static current_marker = 0;

    constructor(element) {
        this.element = element;
        this.caret = 0;
        this.caret_ex = 0;
        this.select_started = false;
        this.buffer = '';
        this.cursor_select = { parent: [], children: [] };
        this.node = new Node();
        this.numbers = [];
        this.markers = [ [], [], [], [], [] ];
        this.error_idx = -1;
        this.error_text = '';
    }

    complement() {
        if (this.hasSelect()) {
            this.buffer = this.buffer.substring(0, Math.min(this.caret, this.caret_ex))
                + '{' + this.buffer.substring(Math.min(this.caret, this.caret_ex), Math.max(this.caret, this.caret_ex))
                + '}' + this.buffer.substring(Math.max(this.caret, this.caret_ex));
        }
    }

    updateData(buffer, markers, numbers) {
        this.caret = 0;
        this.caret_ex = 0;
        this.select_started = false;
        this.buffer = buffer;
        this.cursor_select = { parent: [], children: [] };
        this.node = new Node();
        this.numbers = numbers;
        this.markers = markers;
        this.error_idx = -1;
        this.error_text = '';
        const is_valid = is_valid_expression(this.buffer);
        if (is_valid.error === ErrorCode.no_error) {
            this.node = create2(this.buffer);
            this.error_idx = -1;
            this.error_text = '';
        }
        else {
            this.node = new Node();
            this.error_idx = is_valid.idx;
            this.error_text = is_valid.error;
        }        
        this.update();
    }

    getContext() {
        const context = this.element.getContext("2d");
        context.font = '20pt LFont';
        context.textBaseline = 'top';
        return context;
    }

    markPosition(position, marker) {
        // Новый маркер
        if (this.markers[marker].length === 0) {
            this.markers[marker].push(position);
        }
        else {
            // Снять выделение
            if(this.markers[marker].includes(position)) {
                this.markers[marker].splice(this.markers[marker].indexOf(position), 1);
            }
            else {
                // Добавляем новое выделение
                if(isBrothers(this.node, [this.markers[marker][0], position])) {
                    this.markers[marker].push(position);
                }
                // Переносим выделение
                else {
                    this.markers[marker] = [position];
                }
            }
        }
        this.update();
    }

    updateMarkers(offset, length, add = true) {
        for(let marker = 0; marker < this.markers.length; ++marker) {
            if(this.markers[marker].length === 1) {
                if(add) {
                    if(this.markers[marker][0] >= offset) {
                        this.markers[marker][0] += length;
                    }
                }
                else {
                    if(this.markers[marker][0] >= offset + length) {
                        this.markers[marker][0] -= length;
                    }
                    else if(this.markers[marker][0] >= offset) {
                        this.markers[marker] = [];
                    }
                }                
            }
            else if (this.markers[marker].length > 1) {
                if(add) {
                    // Добавляем первый элемент
                    if(this.markers[marker][0] >= offset) {
                        this.markers[marker] = [this.markers[marker][0] + length];
                    }
                    else {
                        this.markers[marker] = [this.markers[marker][0]];
                    }
                    // Добавляем остальные элемент
                    for (let idx = 1; idx < this.markers[marker].length; ++idx) {
                        const position = this.markers[marker][idx];
                        if(this.markers[marker][idx] >= offset) {
                            position += length;
                        }
                        if(isBrothers(this.node, [this.markers[marker][0], position])) {
                            this.markers[marker].push(position);
                        }                    
                    }
                }
                else {
                    // Добавляем первый элемент
                    let start = 0;
                    // Ищем первый элемент
                    this.markers[marker] = [];
                    for (; start < this.markers[marker].length; ++start) {
                        if(this.markers[marker][start] >= offset + length) {
                            this.markers[marker] = [this.markers[marker][start] - length];
                            break;
                        }
                        else if(this.markers[marker][start] < offset) {
                            this.markers[marker] = [this.markers[marker][start]];
                            break;
                        }
                    }                    
                    // Добавляем остальные элемент
                    for (let idx = start + 1; idx < this.markers[marker].length; ++idx) {
                        const position = this.markers[marker][idx];
                        if(this.markers[marker][idx] >= offset + length) {
                            position = this.markers[marker][idx] - length;
                        }
                        else if(this.markers[marker][idx] < offset) {
                            position = this.markers[marker][idx];
                        }
                        else {
                            continue;
                        }
                        if(isBrothers(this.node, [this.markers[marker][0], position])) {
                            this.markers[marker].push(position);
                        }                    
                    }
                }   
            }
        }
    }

    keyPressed(event) {
        const key = event.key.toUpperCase();
        if (/^[A-Z\{\}\#\$\^\-\+\*\/\=\|0-9]$/.test(key)) {
            this.addChar(key);
        }
        else if ("BACKSPACE" === key) {
            this.removeChar();
        }
        else if ("DELETE" === key) {
            this.deleteChar();
        }
        else if ("ARROWLEFT" === key) {
            this.toLeft();
        }
        else if ("ARROWRIGHT" === key) {
            this.toRight();
        }
    }

    hasSelect() {
        return this.caret !== this.caret_ex;
    }

    removeSelect() {
        const begin = Math.min(this.caret, this.caret_ex);
        const end = Math.max(this.caret, this.caret_ex);
        this.buffer = this.buffer.substring(0, begin) +
            this.buffer.substring(end);
        this.caret = this.caret_ex = begin;
    }

    addChar(val) {
        if (this.hasSelect()) this.removeSelect();
        this.buffer = this.buffer.substring(0, this.caret) + 
            val + this.buffer.substring(this.caret);
        this.caret = this.caret_ex = this.caret + 1;
        this.check_and_update();
    }

    removeOverline() {
        const end = TextUtils.findOverlineEnd(this.buffer, this.caret);
        this.buffer = this.buffer.substring(0, this.caret) +
                      this.buffer.substring(this.caret + 1, end) +
                      this.buffer.substring(end + 1);
        this.check_and_update(false);
    }

    removeChar() {
        if (this.hasSelect()) this.removeSelect();
        else {
            if (this.caret === 0) return;
            this.caret = this.caret_ex = this.caret - 1;
            if (this.buffer[this.caret] === '{') {
                this.removeOverline();
                return;
            }
            if (this.buffer[this.caret] === '}') return;
            this.buffer = this.buffer.substring(0, this.caret) +
                this.buffer.substring(this.caret + 1);
        }
        this.check_and_update(false);
    }

    deleteChar() {
        if (this.hasSelect()) this.removeSelect();
        else {
            if (this.caret === this.buffer.length) return;
            if (this.buffer[this.caret] === '{') {
                this.removeOverline();
                return;
            }
            if (this.buffer[this.caret] === '}') return;
            this.buffer = this.buffer.substring(0, this.caret) +
                this.buffer.substring(this.caret + 1);
        }
        this.check_and_update(false);
    }

    toLeft() {
        if (this.hasSelect()) {
            this.caret = this.caret_ex = Math.min(this.caret, this.caret_ex);
        }
        else {
            if (this.caret === 0) return;
            this.caret = this.caret_ex = this.caret - 1;
        }
        this.update();
    }

    toRight() {
        if (this.hasSelect()) {
            this.caret = this.caret_ex = Math.max(this.caret, this.caret_ex);
        }
        else {
            if (this.caret === this.buffer.length) return;
            this.caret = this.caret_ex = this.caret + 1;
        }
        this.update();
    }

    getCaretPos(context, x) {
        let length = 0;        
        for (let i = 0; i < this.buffer.length; ++i) {
            length += TextUtils.getCharWidth(context, this.buffer[i]);
            if (length > x) {
                return i;
            }
        }
        return this.buffer.length;
    }

    mouseDown(event) {
        const context = this.getContext();
        const new_caret = this.getCaretPos(context, event.offsetX);
        if (event.ctrlKey === true) {
            this.markPosition(new_caret, TextEdit.current_marker);
        }
        else {
            this.caret = this.caret_ex = new_caret;
            this.select_started = true;
        }        
        this.update();
    }

    mouseMove(event) {
        const context = this.getContext();
        const temp_caret = this.getCaretPos(context, event.offsetX);
        this.cursor_select = search(this.node, temp_caret);
        if (this.select_started) {
            this.caret = temp_caret;
        }
        this.update();
    }

    mouseUp() {
        this.select_started = false;
    }

    mouseLeave() {
        this.cursor_select = { parent: [], children: [] };
        this.select_started = false;
        this.update();
    }

    check_and_update(add = true) {
        const is_valid = is_valid_expression(this.buffer);
        if (is_valid.error === ErrorCode.no_error) {
            this.node = create2(this.buffer);
            this.error_idx = -1;
            this.error_text = '';
        }
        else {
            this.node = new Node();
            this.error_idx = is_valid.idx;
            this.error_text = is_valid.error;
        }        
        this.updateMarkers(this.caret, 1, add);
        this.update();
    }

    update() {
        const context = this.getContext();

        context.clearRect(0, 0, this.element.width, this.element.height);
        const parts = TextUtils.splitOverline(this.buffer);

        const max_lvl = TextUtils.getMaxLevel(parts) * 2;

        const select_start = TextUtils.getStringWidth(context, 
            this.buffer.substring(0, Math.min(this.caret, this.caret_ex))
        );
        const select_metrics = TextUtils.getStringMetrics(context, 
            this.buffer.substring(
                Math.min(this.caret, this.caret_ex), Math.max(this.caret, this.caret_ex)
            )
        );
        context.fillStyle = 'green';
        context.fillRect(select_start, 10, select_metrics.width, select_metrics.height);
        context.fillStyle = 'black';

        this.drawMarked(context);

        this.drawCursorSelect(context);
        let part_pos = 0;
        context.beginPath();
        for (let i = 0; i < parts.length; ++i) {
            const width = TextUtils.getStringWidth(context, parts[i].value);
            context.fillText(parts[i].value, part_pos, 10); 
            for (let j = 0; j < parts[i].level; ++j) {
                context.moveTo(part_pos, 10 - max_lvl + j * 2);
                context.lineTo(part_pos + width, 10 - max_lvl + j * 2);
            }
            part_pos += width;
        }
        this.drawCaret(context);
        context.strokeStyle = '#000000';
        context.stroke();

        this.drawExtraOverline(context, max_lvl);
    }

    drawExtraOverline(context, max_level) {
        if (this.buffer[this.caret] === '{') {
            let level = 0;
            for (let idx = 0; idx < this.caret; ++idx) {
                if (this.buffer[idx] === '{') ++level;
                if (this.buffer[idx] === '}') --level;
            }
            context.beginPath();
            const end = TextUtils.findOverlineEnd(this.buffer, this.caret);
            const offset_metrics = TextUtils.getStringMetrics(context, this.buffer.substring(0, this.caret));
            const metrics = TextUtils.getStringMetrics(context, this.buffer.substring(this.caret, end));
            context.moveTo(offset_metrics.width, 10 - max_level  + level * 2);
            context.lineTo(offset_metrics.width + metrics.width, 10 - max_level + level * 2);
            context.strokeStyle = '#ff0000';
            context.stroke();
        }
    }

    drawCaret(context) {
        const metrics = TextUtils.getStringMetrics(context, this.buffer.substring(0, this.caret));
        context.moveTo(metrics.width, 10);
        context.lineTo(metrics.width, 10 + metrics.height);
    }

    drawCursorSelect(context) {
        for (let i = 0; i < this.cursor_select.parent.length; ++i) {
            this.paintCharBackground(context, 'yellow', this.cursor_select.parent[i]);
        }
        for (let i = 0; i < this.cursor_select.children.length; ++i) {
            this.paintCharBackground(context, 'green', this.cursor_select.children[i]);
        }
    }

    drawMarked(context) {
        for (let marker = 0; marker < this.markers.length; ++marker) {
            if (this.markers[marker].length === 1) {
                const marked = search(this.node, this.markers[marker][0]);
                this.paintCharArrayBackground(context, MarkerColor(marker).parent, marked.parent);
                this.paintCharArrayBackground(context, MarkerColor(marker).children, marked.children);
            }
            else if (this.markers[marker].length > 1) {
                const is_brothers = isBrothers(this.node, this.markers[marker]);
                if (is_brothers.result === true) {
                    this.paintCharArrayBackground(context, '#FF00FF55', is_brothers.parent.positions);
                }
                for (let idx = 0; idx < this.markers[marker].length; ++idx) {
                    const marked = search(this.node, this.markers[marker][idx]);
                    this.paintCharArrayBackground(context, MarkerColor(marker).parent, marked.parent);
                    this.paintCharArrayBackground(context, MarkerColor(marker).children, marked.children);
                }
            }
        }        
    } 

    paintCharArrayBackground(context, color, arr) {
        for (let i = 0; i < arr.length; ++i) {
            this.paintCharBackground(context, color, arr[i]);
        }
    }

    paintCharBackground(context, color, pos) {
        const offset_metrics = TextUtils.getStringMetrics(context, this.buffer.substring(0, pos));
        const char_metrics = TextUtils.getStringMetrics(context, this.buffer[pos]);
        const old_style = context.fillStyle;
        context.fillStyle = color;
        context.fillRect(offset_metrics.width, 10, char_metrics.width, char_metrics.height);
        context.fillStyle = old_style;
    }
}