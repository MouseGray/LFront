let TextEditors = [];

let current_marker = undefined;

export function InitMarkers(...textEditors) {
    TextEditors = textEditors;
    const marker_list = document.querySelector('.marker-list');
    for (let idx = 0; idx < 5; ++idx) {
        const new_marker = CreateMarker(idx + 1);
        marker_list.appendChild(new_marker);
        const marker_name = marker_list.lastElementChild.querySelector('.marker-name');
        marker_name.addEventListener('click', UpdateMarker);
    }    
}

function CreateMarker(no) {
    const tmpl_marker = document.querySelector('.marker-template');
    const new_marker = tmpl_marker.content.cloneNode(true);
    new_marker.querySelector('.marker-name').innerHTML = `Маркер ${no}`;
    return new_marker;
}

function UpdateMarker(event) {
    if (current_marker !== undefined) {
        current_marker.style.textDecoration = 'none';
    }
    current_marker = event.target;
    current_marker.style.textDecoration = 'underline';
    for(const textEditor of TextEditors) 
        textEditor.markerid = parseInt(current_marker.textContent.split(' ')[1] - 1);
}