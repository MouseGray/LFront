// import { errorIconByID } from "../../Definitions/errors.js";
// import { operationByID, operationByText } from "../../Definitions/operations.js";
// import { getRowComplexAttribute, getRowStringAttribute, getRowStringAttributes, setRowComplexAttribute, setRowStringAttribute, setRowStringAttributes } from "./Tools/attribute.js";
// import { getRowIntData, getRowStringData, setRowIntData, setRowStringData } from "./Tools/data.js";
// import { setRowImage } from "./Tools/image.js";
// import { createImage } from "./work_canvas.js";
// let GlobalUUID = 0;  
// export type row_t = {
//     uid:        number,
//     left:       string,
//     right:      string,
//     operation:  number,
//     connection: number,
//     numbers:    number[],
//     markers:    markers_raw_t,
//     error:      number,
//     error_text: string
// }
// export function resetGlobalUUID() : void {
//     GlobalUUID = 0;
// }
// export function generateUUID() : number {
//     return ++GlobalUUID;
// }
// export function getUID(row : HTMLLIElement) : number {
//     return getRowIntData(row, 'expr-uid');
// }
// export function setUID(row : HTMLLIElement, value : number) : void {
//     GlobalUUID = Math.max(GlobalUUID, value);
//     setRowIntData(row, 'expr-uid', value);
// }
// export function getConnID(row : HTMLLIElement) : string {
//     return getRowStringData(row, 'expr-conn');
// }
// export function setConnID(row : HTMLLIElement, value : number) : void {
//     if (value == undefined) 
//         setRowStringData(row, 'expr-conn', '?');
//     else
//         setRowStringData(row, 'expr-conn', value.toString());
// }
// export function getOperationID(row : HTMLLIElement) : number {
//     return operationByText(getRowStringData(row, 'expr-op'));
// }
// export function setOperationID(row : HTMLLIElement, value : number) : void {
//     setRowStringData(row, 'expr-op', operationByID(value));
// }
// export function getNumbers(row : HTMLLIElement) : number[] {
//     return getRowComplexAttribute(row, 'expr-info', 'data-numbers');
// }
// export function setNumbers(row : HTMLLIElement, value : number[]) : void {
//     setRowComplexAttribute(row, 'expr-info', 'data-numbers', value);
// }
// export type markers_t = { left: number[][], right: number[][] };
// export type marker_raw_t = { left: number[], right: number[] };
// export type markers_raw_t = marker_raw_t[];
// export function getMarkers(row : HTMLLIElement) : markers_t {
//     return { left: <number[][]>getRowComplexAttribute(row, 'expr-left', 'data-markers'),
//         right: <number[][]>getRowComplexAttribute(row, 'expr-right', 'data-markers') };
// }
// export function setMarkers(row : HTMLLIElement, value : markers_t) : void {
//     setRowComplexAttribute(row, 'expr-left', 'data-markers', value.left);
//     setRowComplexAttribute(row, 'expr-right', 'data-markers', value.right);
// }
// export type text_t = { left: string, middle: string, right: string };
// export function getText(row : HTMLLIElement) : text_t {
//     return { left: getRowStringAttribute(row, 'expr-left', 'data-text'),
//         middle: getRowStringAttribute(row, 'expr-mid', 'data-text'),
//         right: getRowStringAttribute(row, 'expr-right', 'data-text') };
// }
// export function setTextSide(row : HTMLElement, 
//                             name : string, 
//                             value : string, 
//                             markers : number[][]) : void {
//     const img = createImage(value, markers);
//     setRowImage(row, name, img.url);
//     setRowStringAttribute(row, name, 'width', img.width + 'px');
//     setRowStringAttribute(row, name, 'height', img.height + 'px');
//     setRowStringAttribute(row, name, 'data-text', value);
// }
// export function setText(row : HTMLLIElement, value : text_t) : void {
//     const markers = getMarkers(row);
//     setTextSide(row, 'expr-left', value.left, markers.left);
//     setTextSide(row, 'expr-mid', value.middle, [[], [], [], [], []]);
//     setTextSide(row, 'expr-right', value.right, markers.right);
// }
// export function getErrorText(row : HTMLLIElement) : string {
//     return getRowStringAttribute(row, 'expr-error', 'data-error-text');
// }
// export function setError(row : HTMLLIElement, id : number, text : string) : void {
//     setRowImage(row, 'expr-error', errorIconByID(id));
//     setRowStringAttribute(row, 'expr-error', 'data-error-text', text);
// }
// function editPanel() : HTMLDivElement {
//     return document.querySelector('.edit-panel');
// }
// export function getEditOperationID() : number {
//     return operationByText(getRowStringAttribute(editPanel(), 'edit-op', 'value'));
// }
// export function setEditOperationID(value : number) : void {
//     setRowStringAttribute(editPanel(), 'edit-op', 'value', operationByID(value));
// }
// export function getEditNumbers() : number[] {
//     return getRowStringAttributes(editPanel(), 'edit-link', 'value')
//         .map(val => parseInt(val));
// }
// export function setEditNumbers(values : number[]) : void {
//     setRowStringAttributes(editPanel(), 'edit-link', 'value', 
//         values.map(val => val.toString()));
// }
// export function getEditMarkers() : markers_t {
//     return { left: <number[][]>getRowComplexAttribute(editPanel(), 'edit-left', 'data-markers'),
//         right: <number[][]>getRowComplexAttribute(editPanel(), 'edit-right', 'data-markers') };
// }
// export function setEditMarkers(value : markers_t) : void {
//     setRowComplexAttribute(editPanel(), 'edit-left', 'data-markers', value.left);
//     setRowComplexAttribute(editPanel(), 'edit-right', 'data-markers', value.right);
// }
// export function getEditText() : text_t {
//     return { left: getRowStringAttribute(editPanel(), 'edit-left', 'data-text'),
//         middle: '=',
//         right: getRowStringAttribute(editPanel(), 'edit-right', 'data-text') };
// }
// export function setEditTextSide(row : HTMLElement, 
//                                 name : string, 
//                                 value : string, 
//                                 markers : number[][]) : void {
//     const img = createImage(value, markers);
//     setRowImage(row, name, img.url);
//     setRowStringAttribute(row, name, 'width', img.width + 'px');
//     setRowStringAttribute(row, name, 'height', img.height + 'px');
//     setRowStringAttribute(row, name, 'data-text', value);
// }
// export function setEditText(value : text_t) : void {
//     const markers = getEditMarkers();
//     setTextSide(editPanel(), 'edit-left', value.left, markers.left);
//     setTextSide(editPanel(), 'edit-right', value.right, markers.right);
// }
// export function fromRawMarkers(raw_markers : markers_raw_t) : markers_t {
//     const markers = <markers_t>{ left: [], right: [] };
//     for (const raw_marker of raw_markers) {
//         markers.left.push(raw_marker.left);
//         markers.right.push(raw_marker.right);
//     }
//     return markers;
// }
// export function toRawMarkers(markers : markers_t) : markers_raw_t {
//     const raw_markers = <markers_raw_t>[];
//     const length = Math.min(markers.left.length, markers.right.length);
//     for (let it = 0; it < length; ++it) {
//         raw_markers.push({ left: markers.left[it], 
//                             right: markers.right[it] });
//     }
//     return raw_markers;
// }
