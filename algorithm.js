export function create2(data)
{
    const stack = new Stack();
    let root;
    let quantityFlag = false;

    for (let it = 0; it < data.length; ++it)
    {
        const char = data[it];
        if (isNumber(char))
        {
            try {
                const number_end = extractNumber(data, it);
                root = new Node(NodeType.number, parseFloat(data.substr(it, number_end + 1 - it)));
                root.addPositions(Array.from(new Array(number_end + 1 - it),
                    (val, index) => index + it));
                it = number_end;
            } catch (error) {
                return new Node();
            }
            continue;
        }
        if (char === '-')
        {
            // Unary
            if (it === 0 || isOperation(data[it - 1])) {
                const node = new Node(NodeType.operation, '`');
                node.addPositions([ it ]);
                stack.push(node);
            }
            else {
                while (!stack.empty())
                {
                    if(priority('+') > priority(stack.top().value)) break;
                    stack.top().attach(root);
                    root = stack.top();
                    stack.pop();
                }
                if (root.value === '+') {
                    stack.push(root);
                }
                else {
                    stack.push(new Node(NodeType.operation, '+'));
                    stack.top().attach(root);
                }
                const node = new Node(NodeType.operation, '`');
                node.addPositions([ it ]);
                stack.push(node);
            }
            continue;
        }
        if (isBinaryOperation(char)) {
            while (!stack.empty())
            {
                if(priority(char) > priority(stack.top().value)) break;
                stack.top().attach(root);
                root = stack.top();
                stack.pop();
            }

            const node = new Node(NodeType.operation, char);
            node.addPositions([ it ]);
            node.attach(root);
            stack.push(node);
            continue;
        }
        if (isMultiOperation(char)) {
            while (!stack.empty())
            {
                if(priority(char) > priority(stack.top().value)) break;
                stack.top().attach(root);
                root = stack.top();
                stack.pop();
            }
            if (root.value == char) {
                root.addPositions([ it ])
                stack.push(root);
            }
            else {
                const node = new Node(NodeType.operation, char);
                node.addPositions([ it ]);
                node.attach(root);
                stack.push(node);
            }
            continue;
        }
        if (char === '{') {
            const node = new Node(NodeType.operation, char);
            node.addPositions([ it ]);
            stack.push(node);
            continue;
        }
        if (char === '}') {
            while (!stack.empty())
            {
                stack.top().attach(root);
                root = stack.top();
                if(root.value == '{') {
                    root.addPositions([ it ]);
                    stack.pop();
                    break;
                }
                stack.pop();
            }
            continue;
        }
        if (char === '(') {
            const node = new Node(NodeType.operation, char);
            node.addPositions([ it ]);
            stack.push(node);
            continue;
        }
        if (char === ')') {
            while (!stack.empty())
            {
                stack.top().attach(root);
                root = stack.top();
                if(stack.top().value == '(') {
                    root.addPositions([ it ]);
                    stack.pop();
                    break;
                }
                stack.pop();
            }
            continue;
        }
        if (char === '|') {
            if (quantityFlag) {
                while (!stack.empty())
                {
                    stack.top().attach(root);
                    root = stack.top();
                    if(stack.top().value == '|') {
                        root.addPositions([ it ]);
                        stack.pop();
                        break;
                    }
                    stack.pop();
                }
            }
            else {
                const node = new Node(NodeType.operation, char);
                node.addPositions([ it ]);
                stack.push(node);
            }
            quantityFlag = !quantityFlag;
            continue;
        }
        root = new Node(NodeType.operation, char);
        root.addPositions([ it ]);
    }
    while (!stack.empty())
    {
        if (stack.top() === '{' || stack.top() === '(' || 
            stack.top() === '|') return new Node();
        stack.top().attach(root);
        root = stack.top();
        stack.pop();
    }
    return root;
}

export function search(node, pos) {
    if (node === undefined) return { parent: [], children: [] };
    if (node.positions.includes(pos)) {
        return { parent: node.positions, children: allPositions(node.sub_nodes) };
    }
    for (let i = 0; i < node.sub_nodes.length; ++i) {
        const res = search(node.sub_nodes[i], pos);
        if (res.parent.length !== 0) return res;
    }
    return { parent: [], children: [] };
}

function allPositions(node_list) {
    let result = [];
    for (let i = 0; i < node_list.length; ++i) {
        result = result.concat(positions(node_list[i]));
    }
    return result;
}

function positions(node) {
    let result = node.positions;
    for (let i = 0; i < node.sub_nodes.length; ++i) {
        result = result.concat(positions(node.sub_nodes[i]));
    }
    return result;
}

function subPositions(node) {
    let result = [];
    for (let i = 0; i < node.sub_nodes.length; ++i) {
        result = result.concat(positions(node.sub_nodes[i]));
    }
    return result;
}

export function isBrothers(node, arr) {
    if (arr.length < 2) return { result: false, parent: undefined };
    let isContain = false;
    for (let i = 0; i < node.sub_nodes.length; ++i) {
        let isFound = false;
        for (let j = 0; j < arr.length; ++j) {
            if (node.sub_nodes[i].positions.includes(arr[j])) {
                isContain = true;
                isFound = true;
                break;
            }
        }
        if (isContain && !isFound) return { result: false, parent: undefined };
    }
    if (isContain) return { result: true, parent: node };

    for (let i = 0; i < node.sub_nodes.length; ++i) {
        const res = isBrothers(node.sub_nodes[i], arr);
        if (res.result === true) return res;
    }
    return { result: false, parent: undefined };
}

function extractNumber(data, start) {
    let has_point = false;
    let i = start;
    if (data[i] === '.') throw 'Invalid number';
    for (; i < data.length; ++i) {
        if (isDigit(data[i])) continue;
        if (data[i] === '.') {
            if (has_point) throw 'Invalid number';
            has_point = true;
        }
        break;
    }
    if (data[i - 1] === '.') throw 'Invalid number';
    return i - 1;
}

function isNumber(char) {
    return isDigit(char) || char === '.'; 
}

function isDigit(char)
{
    return ('0' <= char && char <= '9');
}

function isOperation(char) {
    return isUnaryOperation(char) || isBinaryOperation(char);
}

function isUnaryOperation(char)
{
    return char === '-' || char === '{' || char === '(' || char == '|';
}

function isBinaryOperation(char)
{
    return char === '-' || char === '/';
}

function isMultiOperation(char)
{
    return char === '#' || char === '$' || char === '+' || char === '*' || char === '=';
}

function priority(char)
{
    switch (char) {
        case '#': return 7;
        case '^': return 7;
        case '$': return 6;
        case '`': return 5;
        case '*': return 4;
        case '/': return 4;
        case '-': return 3;
        case '+': return 3;
        case '=': return 2;
        case '{': return 1;
        case '}': return 1;
        case '|': return 1;
        case '(': return 1;
        case ')': return 1;
        case '_': return 0;
    default:
        return 0;
    }
}