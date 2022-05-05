import { MarkersBase } from "./markers_base.js";

export class MarkersUnit {
    left : MarkersBase;
    right : MarkersBase;
    constructor(left : MarkersBase, right : MarkersBase) {
        this.left = left;
        this.right = right;
    }
    static copy(unit : MarkersUnit) : MarkersUnit {
        return new MarkersUnit(MarkersBase.copy(unit.left), 
            MarkersBase.copy(unit.right));
    }

}