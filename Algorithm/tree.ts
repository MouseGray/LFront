import { Stack } from "../Utils/stack.js";
import { Node, NodeType } from "./node.js";

export function create2(data : string) : Node
{
    const stack = new Stack();
    let root : Node = undefined;
    let quantity_flag : boolean = false;

    for (let it = 0; it < data.length; ++it)
    {
        const char = data[it];
        if (isNumber(char))
        {
            try {
                const number_end = extractNumber(data, it);
                root = new Node(NodeType.number, parseFloat(data.substr(it, number_end + 1 - it)));
                root.addProjections(Array.from(new Array(number_end + 1 - it),
                    (val, index) => index + it));
                it = number_end;
            } catch (error) {
                //throw 'Number conversion error';
            }
            continue;
        }
        if (char === '-')
        {
            // Unary
            if (it === 0 || isOperation(data[it - 1])) {
                const node = new Node(NodeType.operation, '`');
                node.addProjections([ it ]);
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
                node.addProjections([ it ]);
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
            node.addProjections([ it ]);
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
                root.addProjections([ it ])
                stack.push(root);
            }
            else {
                const node = new Node(NodeType.operation, char);
                node.addProjections([ it ]);
                node.attach(root);
                stack.push(node);
            }
            continue;
        }
        if (char === '{') {
            const node = new Node(NodeType.operation, char);
            node.addProjections([ it ]);
            stack.push(node);
            continue;
        }
        if (char === '}') {
            while (!stack.empty())
            {
                stack.top().attach(root);
                root = stack.top();
                if(root.value == '{') {
                    root.addProjections([ it ]);
                    stack.pop();
                    break;
                }
                stack.pop();
            }
            continue;
        }
        if (char === '(') {
            const node = new Node(NodeType.operation, char);
            node.addProjections([ it ]);
            stack.push(node);
            continue;
        }
        if (char === ')') {
            while (!stack.empty())
            {
                stack.top().attach(root);
                root = stack.top();
                if(stack.top().value == '(') {
                    root.addProjections([ it ]);
                    stack.pop();
                    break;
                }
                stack.pop();
            }
            continue;
        }
        if (char === '|') {
            if (quantity_flag) {
                while (!stack.empty())
                {
                    stack.top().attach(root);
                    root = stack.top();
                    if(stack.top().value == '|') {
                        root.addProjections([ it ]);
                        stack.pop();
                        break;
                    }
                    stack.pop();
                }
            }
            else {
                const node = new Node(NodeType.operation, char);
                node.addProjections([ it ]);
                stack.push(node);
            }
            quantity_flag = !quantity_flag;
            continue;
        }
        root = new Node(NodeType.operation, char);
        root.addProjections([ it ]);
    }
    while (!stack.empty())
    {
        if (stack.top() === '{' || stack.top() === '(' || 
            stack.top() === '|') throw `Unexpected '${stack.top()}'`;
        stack.top().attach(root);
        root = stack.top();
        stack.pop();
    }
    return root;
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
            continue;
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
    return char === '-' || char === '{' || char === '(';
}

function isBinaryOperation(char)
{
    return char === '-' || char === '/' || char === '^';
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