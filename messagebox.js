export function InitMessageBox() {
    const message_box_button = document.querySelector('.message-box-button');
    message_box_button.addEventListener('click', HideMessageBox);
}

export function ShowMessageBox(title, text) {
    const message_box = document.querySelector('.message-box-background');
    const message_box_title = message_box.querySelector('.message-box-title');
    message_box_title.innerHTML = title;
    const message_box_text = message_box.querySelector('.message-box-text');
    message_box_text.innerHTML = text;
    message_box.style.display = 'flex';
}

function HideMessageBox() {
    const message_box = document.querySelector('.message-box-background');
    message_box.style.display = 'none';
}