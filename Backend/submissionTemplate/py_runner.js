// final_python_single_test_generator.js

export default function python_runner(
    userTemplate,
    functionName,
    returnType,
    inputs
) {
    if (!userTemplate || !functionName || !returnType || !Array.isArray(inputs)) {
        return "# ERROR: Missing arguments";
    }

    const callArgs = inputs.map(i => i.name).join(", ");

    // -------- Input Parsing for Python --------
    const parseInputs = inputs.map(inp => {
        switch (inp.type) {
            case "int":
            case "string":
            case "bool":
            case "int[]":
            case "string[]":
                return `    ${inp.name} = input_obj["${inp.name}"]`;
            case "ListNode":
                return `    ${inp.name} = build_list(input_obj["${inp.name}"])`;
            case "TreeNode":
                return `    ${inp.name} = build_tree(input_obj["${inp.name}"])`;
            default:
                return `    # Unsupported: ${inp.type}`;
        }
    }).join("\n");

    // -------- Serializer --------
    let serializer = "";
    switch (returnType) {
        case "int":
        case "string":
        case "bool":
            serializer = `    result = output`;
            break;
        case "int[]":
        case "string[]":
            serializer = `    result = json.dumps(output)`;
            break;
        case "ListNode":
            serializer = `    result = list_to_json(output)`;
            break;
        case "TreeNode":
            serializer = `    result = tree_to_json(output)`;
            break;
        default:
            serializer = `    result = "UNSUPPORTED_RETURN_TYPE"`;
    }

    const listBlock = inputs.some(i => i.type === "ListNode") ? generatePythonListNodeBlock() : "";
    const treeBlock = inputs.some(i => i.type === "TreeNode") ? generatePythonTreeNodeBlock() : "";

    return `
import json
import sys
from typing import Optional, List

${listBlock}
${treeBlock}

# ======================== USER SOLUTION ===========================
${userTemplate}

# ======================== MAIN (Single Test) ======================
if __name__ == "__main__":
    data = sys.stdin.read()
    input_obj = json.loads(data)

    # ----------------- AUTO FIX FOR NESTED JSON STRINGS -----------------
    # Backend sends things like:  "{\"root\":[1,2,3,null]}"
    # This auto-converts string -> list/dict
    for key in input_obj:
        if isinstance(input_obj[key], str):
            try:
                input_obj[key] = json.loads(input_obj[key])
            except:
                pass

${parseInputs}

    sol = Solution()
    output = sol.${functionName}(${callArgs})

${serializer}

    print(result)
`.trim();
}


// ========== Helper DS Blocks ==========

function generatePythonListNodeBlock() {
    return `
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def build_list(arr):
    if arr is None or len(arr) == 0:
        return None
    head = ListNode(arr[0])
    curr = head
    for v in arr[1:]:
        curr.next = ListNode(v)
        curr = curr.next
    return head

def list_to_json(head):
    out = []
    while head:
        out.append(head.val)
        head = head.next
    return json.dumps(out)
`;
}

function generatePythonTreeNodeBlock() {
    return `
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(arr):
    if arr is None or len(arr) == 0:
        return None

    nodes = [None if v is None else TreeNode(v) for v in arr]

    i = 1
    for idx, node in enumerate(nodes):
        if node is not None:
            if i < len(nodes): node.left = nodes[i]
            i += 1
            if i < len(nodes): node.right = nodes[i]
            i += 1

    return nodes[0]

def tree_to_json(root):
    if not root:
        return "[]"
    from collections import deque
    q = deque([root])
    out = []
    while q:
        n = q.popleft()
        if n:
            out.append(n.val)
            q.append(n.left)
            q.append(n.right)
        else:
            out.append(None)
    while out and out[-1] is None:
        out.pop()
    return json.dumps(out)
`;
}
