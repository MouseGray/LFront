export function InitTools(row, edit, up, down, remove) {
    row.addEventListener('mouseenter', showTools);
    row.addEventListener('mouseleave', hideTools);

    const tools = row.querySelectorAll('.expr-tool');
    tools[0].addEventListener('click', event => {
        edit(event.target.parentNode.parentNode.parentNode);
    });
    tools[1].addEventListener('click', event => {
        up(event.target.parentNode.parentNode.parentNode);
    });
    tools[2].addEventListener('click', event => {
        down(event.target.parentNode.parentNode.parentNode);
    });
    tools[3].addEventListener('click', event => {
        remove(event.target.parentNode.parentNode.parentNode);
    });
}

function showTools(event) {
    const container = document.querySelector('.data-container');
    const tools = event.currentTarget.querySelector('.expr-tool-kit');
    tools.style.left = (container.scrollLeft + container.clientWidth - 135) + 'px';
    tools.style.visibility = 'visible';
}

function hideTools(event) {
    const tools = event.currentTarget.querySelector('.expr-tool-kit');
    tools.style.visibility = 'hidden';
}