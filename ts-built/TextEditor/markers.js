import { findProjection, findProjections, isBrothers } from '../Algorithm/algorithm.js';
import { create2 } from '../Algorithm/tree.js';
import { ErrorCode, is_valid_expression } from '../Algorithm/validator.js';
import { copyArray, isValidArgs } from '../Utils/utils.js';
import { MarkersBase } from './markers_base.js';
export class Markers extends MarkersBase {
    selected;
    tree;
    constructor() {
        super();
        this.selected = undefined;
    }
    static copy(markers) {
        const result = new Markers();
        result.set(copyArray(markers.data()));
        return result;
    }
    from(data, markers) {
        if (markers === undefined)
            return;
        this.set(markers.__data);
        if (is_valid_expression(data).error === ErrorCode.no_error) {
            this.tree = create2(data);
            this.normolizeMarkers();
        }
        else {
            this.tree = undefined;
        }
    }
    getSelectConfig() {
        if (!isValidArgs(this.selected, this.tree))
            return undefined;
        return findProjection(this.tree, this.selected);
    }
    getConfig(markerid) {
        return Markers.getConfigImpl(this.get(markerid), this.tree);
    }
    static getConfigImpl(marker, tree) {
        if (!isValidArgs(tree))
            return undefined;
        if (marker.length === 0)
            return undefined;
        if (marker.length === 1) {
            const node = findProjection(tree, marker[0]);
            if (node === undefined)
                return undefined;
            return { extra: [], parent: node.projections, children: node.childrenProjectionsAll() };
        }
        const nodes = findProjections(tree, marker);
        if (nodes.length === 0)
            return undefined;
        const parents = [];
        const children = [];
        for (const node of nodes) {
            parents.push(...node.projections);
            children.push(...node.childrenProjectionsAll());
        }
        return { extra: nodes[0].parent.projections, parent: parents, children: children };
    }
    static getConfig(markerid, data, markers) {
        if (!isValidArgs(markers))
            return undefined;
        if (is_valid_expression(data).error === ErrorCode.no_error) {
            const tree = create2(data);
            return Markers.getConfigImpl(markers.get(markerid), tree);
        }
        return undefined;
    }
    isCorrectMarkers() {
        return this.tree !== undefined;
    }
    select(pos) {
        this.selected = pos;
    }
    insert(data, pos, length) {
        this.updateMarksInsert(pos, length);
        if (is_valid_expression(data).error === ErrorCode.no_error) {
            this.tree = create2(data);
            this.normolizeMarkers();
        }
        else {
            this.tree = undefined;
        }
    }
    erase(data, pos, length) {
        this.updateMarksErase(pos, length);
        if (is_valid_expression(data).error === ErrorCode.no_error) {
            this.tree = create2(data);
            this.normolizeMarkers();
        }
        else {
            this.tree = undefined;
        }
    }
    mark(pos, marker) {
        // Новый маркер
        const cur_marker = this.get(marker);
        if (cur_marker.length === 0) {
            cur_marker.push(pos);
            return;
        }
        // Снять выделение
        if (cur_marker.includes(pos)) {
            cur_marker.splice(cur_marker.indexOf(pos), 1);
            return;
        }
        // Добавляем новое выделение
        if (isBrothers(this.tree, [cur_marker[0], pos])) {
            cur_marker.push(pos);
            return;
        }
        // Переносим выделение
        cur_marker.splice(0, cur_marker.length, pos);
    }
    updateMarksInsert(offset, length) {
        for (const marker of this.data()) {
            for (let idx = 0; idx < marker.length; ++idx) {
                if (marker[idx] >= offset)
                    marker[idx] += length;
            }
        }
    }
    updateMarksErase(offset, length) {
        for (const marker of this.data()) {
            for (let idx = 0; idx < marker.length; ++idx) {
                if (marker[idx] >= offset + length)
                    marker[idx] -= length;
                else if (marker[idx] >= offset && marker[idx] < offset + length) {
                    marker.splice(idx, 1);
                    --idx;
                }
            }
        }
    }
    normolizeMarkers() {
        for (const marker of this.data()) {
            const new_marker = [];
            if (marker.length < 2)
                continue;
            new_marker.push(marker[0]);
            for (let idx = 1; idx < marker.length; ++idx) {
                if (isBrothers(this.tree, [new_marker[0], marker[idx]])) {
                    new_marker.push(marker[idx]);
                }
            }
            marker.splice(0, marker.length, ...new_marker);
        }
    }
}
