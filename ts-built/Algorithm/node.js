import { copyArray } from "../Utils/utils.js";
export var NodeType;
(function (NodeType) {
    NodeType[NodeType["number"] = 0] = "number";
    NodeType[NodeType["variable"] = 1] = "variable";
    NodeType[NodeType["operation"] = 2] = "operation";
    NodeType[NodeType["undefined"] = 3] = "undefined";
})(NodeType || (NodeType = {}));
export class NodeConfig {
    extra;
    parent;
    children;
    constructor() {
        this.extra = undefined;
        this.parent = undefined;
        this.children = [];
    }
}
export class Node {
    type;
    value;
    parent;
    children;
    projections;
    constructor(type, value) {
        this.type = type;
        this.value = value;
        this.parent = undefined;
        this.children = [];
        this.projections = [];
    }
    has(projections) {
        for (const projection of projections) {
            if (this.projections.includes(projection))
                return true;
        }
        return false;
    }
    addProjections(projections) {
        this.projections.push(...projections);
    }
    attach(node) {
        node.parent = this;
        this.children.push(node);
    }
    projectionsAll() {
        const result = copyArray(this.projections);
        for (const child of this.children) {
            result.push(...child.projectionsAll());
        }
        return result;
    }
    childrenProjectionsAll() {
        const result = [];
        for (const child of this.children) {
            result.push(...child.projectionsAll());
        }
        return result;
    }
}
