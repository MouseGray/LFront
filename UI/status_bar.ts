type status_item = { id: number, text : string }

let status_stack = <status_item[]>[];

export function addStatus(text : string) : number {
    const id = __addStatus(text);
    __renderStatus();
    return id;
}

export function releaseStatus(id : number) : void {
    __removeStatus(id);
    __renderStatus();
}

function __addStatus(text : string) : number {
    let last_id = 0;
    if (status_stack.length !== 0) 
    {
        last_id = status_stack[status_stack.length - 1].id;
    }
    status_stack.push({ id: last_id + 1, text: text });
    return last_id + 1;
}

function __removeStatus(id : number) : void {
    if (id === 0) return;
    status_stack = status_stack.filter(item => item.id !== id);
}

function __renderStatus() : void {
    const status_bar = document.querySelector('.menu-status') as HTMLLabelElement;
    if (status_stack.length !== 0)
    {
        status_bar.innerText = status_stack[status_stack.length - 1].text;
        status_bar.style.visibility = 'visible';
    }
    else
    {
        status_bar.style.visibility = 'hidden';
    }
}
