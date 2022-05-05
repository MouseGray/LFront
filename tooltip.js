export function InitToolTip(element, text_obj) {
    const error_icon = element.querySelector('.expr-error');
    error_icon.addEventListener('mouseenter', () => {
        ShowToolTip(error_icon, text_obj.error.text);
    });
    error_icon.addEventListener('mouseleave', HideToolTip);
}

export function ShowToolTip(element, text) {
    const tool_tip = document.querySelector('.tool-tip');
    tool_tip.style.left = element.x + 'px';
    tool_tip.style.top = (element.y + 20) + 'px';
    tool_tip.innerHTML = text;
    tool_tip.style.visibility = 'visible';
}

export function HideToolTip() {
    const tool_tip = document.querySelector('.tool-tip');
    tool_tip.style.visibility = 'hidden';
}