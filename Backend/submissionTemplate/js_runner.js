// final_js_single_test_generator.js

export default function js_runner(
    userTemplate,
    functionName,
    returnType,
    inputs
) {
    if (!userTemplate || !functionName || !returnType || !Array.isArray(inputs)) {
        return "// ERROR: Missing arguments";
    }

    // Build call arguments
    const callArgs = inputs.map(i => i.name).join(", ");

    // Build parsing logic
    const parseInputs = inputs.map(inp => {
        switch (inp.type) {
            case "int":
            case "string":
            case "bool":
                return `    const ${inp.name} = input["${inp.name}"];`;
            case "int[]":
            case "string[]":
                return `    const ${inp.name} = input["${inp.name}"];`;
            case "ListNode":
                return `    const ${inp.name} = buildList(input["${inp.name}"]);`;
            case "TreeNode":
                return `    const ${inp.name} = buildTree(input["${inp.name}"]);`;
            default:
                return `    // Unsupported type: ${inp.type}`;
        }
    }).join("\n");

    // Serializer
    let serializer = "";
    switch (returnType) {
        case "int":
        case "string":
        case "bool":
            serializer = `    result = output;`; break;
        case "int[]":
        case "string[]":
            serializer = `    result = JSON.stringify(output);`; break;
        case "ListNode":
            serializer = `    result = listToJson(output);`; break;
        case "TreeNode":
            serializer = `    result = treeToJson(output);`; break;
        default:
            serializer = `    result = "UNSUPPORTED_RETURN_TYPE";`;
    }

    // DS blocks
    const listBlock = inputs.some(i => i.type === "ListNode") ? generateJSListNodeBlock() : "";
    const treeBlock = inputs.some(i => i.type === "TreeNode") ? generateJSTreeNodeBlock() : "";

    // =============== FINAL JAVASCRIPT RUNNER ===============
    return `
${listBlock}
${treeBlock}

// =================== USER SOLUTION ===================
${userTemplate}

// =================== MAIN (Single Test) ===================
const fs = require("fs");

(function main() {
    const data = fs.readFileSync(0, "utf8").trim();
    const input = JSON.parse(data);

${parseInputs}

    const output = ${functionName}(${callArgs});

    let result;
${serializer}

    process.stdout.write(String(result));
})();
`.trim();
}


// =========================================================
//          HELPERS: ListNode + TreeNode for JS
// =========================================================

function generateJSListNodeBlock() {
    return `
class ListNode {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }
}

function buildList(arr) {
    if (!arr || arr.length === 0) return null;
    let head = new ListNode(arr[0]);
    let curr = head;
    for (let i = 1; i < arr.length; i++) {
        curr.next = new ListNode(arr[i]);
        curr = curr.next;
    }
    return head;
}

function listToJson(head) {
    const res = [];
    while (head) {
        res.push(head.val);
        head = head.next;
    }
    return JSON.stringify(res);
}
`;
}

function generateJSTreeNodeBlock() {
    return `
class TreeNode {
    constructor(val, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

function buildTree(arr) {
    if (!arr || arr.length === 0) return null;

    let nodes = arr.map(v => (v === null ? null : new TreeNode(v)));
    let i = 1;
    for (let idx = 0; idx < nodes.length && i < nodes.length; idx++) {
        const node = nodes[idx];
        if (node !== null) {
            if (i < nodes.length) node.left = nodes[i++];
            if (i < nodes.length) node.right = nodes[i++];
        }
    }
    return nodes[0];
}

function treeToJson(root) {
    if (!root) return "[]";
    const queue = [root];
    const res = [];

    while (queue.length > 0) {
        const node = queue.shift();
        if (node) {
            res.push(node.val);
            queue.push(node.left);
            queue.push(node.right);
        } else {
            res.push(null);
        }
    }

    while (res.length && res[res.length - 1] === null) res.pop();
    return JSON.stringify(res);
}
`;
}
