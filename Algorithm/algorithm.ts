import { isValidArgs } from "../Utils/utils.js";
import { Node, NodeConfig } from "./node.js";

export function findProjection(tree : Node, projection : number) : Node {
    if (!isValidArgs(tree, projection)) return undefined;
    if (tree.has([projection])) return tree;
    for (const sub_tree of tree.children) {
        const result = findProjection(sub_tree, projection);
        if (result !== undefined) return result;
    }
    return undefined;
}

export function findProjections(tree : Node, projections : number[]) : Node[] {
    if (!isValidArgs(tree)) return [];
    const result : Node[] = [];
    for (const projection of projections) {
        const node = findProjection(tree, projection);
        if (node === undefined) continue;
        result.push(node);
    }
    return result;
}

export function createNodeConfig(tree : Node, projections : number[]) : NodeConfig {
    if (tree === undefined) return undefined;
    if (tree.has(projections)) {
        return { extra: [], parent: tree.projections, children: tree.childrenProjectionsAll() };
    }
    for (const sub_tree of tree.children) {
        const result = createNodeConfigImpl(sub_tree, tree, projections);
        if (result !== undefined) return result;
    }
    return undefined;
}

function createNodeConfigImpl(tree : Node, parent: Node, projections : number[]) : NodeConfig {
    if (tree === undefined) return undefined;
    if (tree.has(projections)) {
        return { extra: parent.projections, parent: tree.projections, children: tree.childrenProjectionsAll() };
    }
    for (const sub_tree of tree.children) {
        const result = createNodeConfigImpl(sub_tree, tree, projections);
        if (result !== undefined) return result;
    }
    return undefined;
}

export function isBrothers(tree : Node, projections : number[]) : boolean {
    if (tree === undefined) return false;
    if (projections.length < 2) return false;
    let isContain = false;
    for (const projection of projections) {
        let isFound = false;
        for (const sub_tree of tree.children) {
            if (sub_tree.has([projection])) {
                isContain = true;
                isFound = true;
                break;
            }
        }
        if (isContain && !isFound) return false;
        if (!isFound) break;
    }
    if (isContain) return true;

    for (const sub_tree of tree.children) {
        const res = isBrothers(sub_tree, projections);
        if (res === true) return res;
    }
    return false;
}
