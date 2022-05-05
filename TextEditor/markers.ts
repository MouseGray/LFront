import { findProjection, findProjections, isBrothers } from '../Algorithm/algorithm.js';
import { Node, NodeConfig } from '../Algorithm/node.js';
import { create2 } from '../Algorithm/tree.js';
import { ErrorCode, is_valid_expression } from '../Algorithm/validator.js';
import { copyArray, isValidArgs } from '../Utils/utils.js';
import { MarkersBase } from './markers_base.js';

export class Markers extends MarkersBase {
    selected : number;
    tree : Node;

    constructor() {
        super();
        this.selected = undefined;
    }

    static copy(markers : Markers) : Markers {
        const result = new Markers();
        result.set(copyArray(markers.data()));
        return result;
    }

    from(data : string, markers : MarkersBase) : void {
        if (markers === undefined) return;
        this.set(markers.__data);
        if (is_valid_expression(data).error === ErrorCode.no_error) {
            this.tree = create2(data);
            this.normolizeMarkers();
        }
        else {
            this.tree = undefined;
        }
    }

    getSelectConfig() : Node {
        if (!isValidArgs(this.selected, this.tree)) return undefined;
        return findProjection(this.tree, this.selected);
    }

    getConfig(markerid : number) : NodeConfig {
        return Markers.getConfigImpl(this.get(markerid), this.tree);
    }

    static getConfigImpl(marker : number[], tree : Node) : NodeConfig {
        if (!isValidArgs(tree)) return undefined;
        if (marker.length === 0) return undefined;
        if (marker.length === 1) {
            const node = findProjection(tree, marker[0]);
            if (node === undefined) return undefined; 
            return { extra: [], parent: node.projections, children: node.childrenProjectionsAll() };
        }
        const nodes = findProjections(tree, marker);
        if (nodes.length === 0) return undefined;
        const parents : number[] = [];
        const children : number[] = [];
        for (const node of nodes) {
            parents.push(...node.projections);
            children.push(...node.childrenProjectionsAll());
        }
        return { extra: nodes[0].parent.projections, parent: parents, children: children };
    }

    static getConfig(markerid : number, data : string, markers : MarkersBase) : NodeConfig {
        if (!isValidArgs(markers)) return undefined;
        if (is_valid_expression(data).error === ErrorCode.no_error) {
            const tree = create2(data);
            return Markers.getConfigImpl(markers.get(markerid), tree);
        }
        return undefined;
    }

    isCorrectMarkers() : boolean {
        return this.tree !== undefined;
    }

    select(pos : number) : void {
        this.selected = pos;
    }

    insert(data : string, pos : number, length : number) : void {
        this.updateMarksInsert(pos, length);
        if (is_valid_expression(data).error === ErrorCode.no_error) {
            this.tree = create2(data);
            this.normolizeMarkers();
        }
        else {
            this.tree = undefined;
        }
    }

    erase(data : string, pos : number, length : number) : void {
        this.updateMarksErase(pos, length);
        if (is_valid_expression(data).error === ErrorCode.no_error) {
            this.tree = create2(data);
            this.normolizeMarkers();
        }
        else {
            this.tree = undefined;
        }
    }

    mark(pos : number, marker : number) : void {
        // Новый маркер
        const cur_marker : number[] = this.get(marker);
        if (cur_marker.length === 0) {
            cur_marker.push(pos);
            return;
        }
        // Снять выделение
        if(cur_marker.includes(pos)) {
            cur_marker.splice(cur_marker.indexOf(pos), 1);
            return;
        }
        // Добавляем новое выделение
        if(isBrothers(this.tree, [cur_marker[0], pos])) {
            cur_marker.push(pos);
            return;
        }
        // Переносим выделение
        cur_marker.splice(0, cur_marker.length, pos);
    }

    updateMarksInsert(offset : number, length : number) : void {
        for (const marker of this.data()) {
            for (let idx = 0; idx < marker.length; ++idx) {
                if (marker[idx] >= offset) marker[idx] += length;
            }
        }
    }

    updateMarksErase(offset : number, length : number) : void {
        for(const marker of this.data()) {
            for (let idx = 0; idx < marker.length; ++idx) {
                if(marker[idx] >= offset + length) marker[idx] -= length;
                else if(marker[idx] >= offset && marker[idx] < offset + length) {
                    marker.splice(idx, 1);
                    --idx;
                }
            }   
        }
    }

    normolizeMarkers() : void {
        for (const marker of this.data()) {
            const new_marker : number[] = [];
            if (marker.length < 2) continue;
            new_marker.push(marker[0]);
            for (let idx = 1; idx < marker.length; ++idx) {
                if(isBrothers(this.tree, [new_marker[0], marker[idx]])) {
                    new_marker.push(marker[idx]);
                }                    
            }
            marker.splice(0, marker.length, ...new_marker);
        }
    }
}