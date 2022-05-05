import { MarkersBase } from "./markers_base.js";
export class MarkersUnit {
    left;
    right;
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }
    static copy(unit) {
        return new MarkersUnit(MarkersBase.copy(unit.left), MarkersBase.copy(unit.right));
    }
}
