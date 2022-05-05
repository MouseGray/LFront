import { copyArray } from "../Utils/utils.js";

export enum NodeType {
    number = 0,
    variable = 1,
    operation = 2,
    undefined = 3
}

export class NodeConfig {
    extra : number[];
    parent : number[];
    children : number[];

    constructor() {
        this.extra = undefined;
        this.parent = undefined;
        this.children = [];
    }
}

export class Node {
    type : NodeType;
    value : any;
    parent : Node;
    children : Node[];
    projections : number[];

    constructor(type : NodeType, value : any) {
        this.type = type;
        this.value = value;
        this.parent = undefined;
        this.children = [];
        this.projections = [];
    }

    has(projections : number[]) : boolean {
        for(const projection of projections) {
            if (this.projections.includes(projection)) return true;
        }
        return false;
    }

    addProjections(projections : number[]) : void {
        this.projections.push(...projections);
    }

    attach(node : Node) : void {
        node.parent = this;
        this.children.push(node);
    }

    projectionsAll() : number[] {
        const result : number[] = copyArray(this.projections);
        for(const child of this.children) {
            result.push(...child.projectionsAll());
        }
        return result;
    }

    childrenProjectionsAll() : number[] {
        const result : number[] = [];
        for(const child of this.children) {
            result.push(...child.projectionsAll());
        }
        return result;
    }
}