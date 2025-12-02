export default function js_boilerplate_template(functionName, returnType, inputs) {
    try {
        if (!functionName || typeof functionName !== "string") {
            throw new Error("Invalid or missing function name.");
        }

        if (!returnType || typeof returnType !== "string") {
            throw new Error("Invalid or missing return type.");
        }

        if (!Array.isArray(inputs)) {
            throw new Error("Inputs must be an array.");
        }

        // Detect DS usage
        let dsComment = "";
        const inputTypes = new Set(inputs.map(i => i.type));

        // Linked List support
        if (inputTypes.has("ListNode")) {
            dsComment += `// Definition for singly-linked list.\n`;
            dsComment += `// function ListNode(val, next) {\n`;
            dsComment += `//     this.val = (val===undefined ? 0 : val)\n`;
            dsComment += `//     this.next = (next===undefined ? null : next)\n`;
            dsComment += `// }\n\n`;
        }

        // TreeNode support
        if (inputTypes.has("TreeNode")) {
            dsComment += `// Definition for a binary tree node.\n`;
            dsComment += `// function TreeNode(val, left, right) {\n`;
            dsComment += `//     this.val = (val===undefined ? 0 : val)\n`;
            dsComment += `//     this.left = (left===undefined ? null : left)\n`;
            dsComment += `//     this.right = (right===undefined ? null : right)\n`;
            dsComment += `// }\n\n`;
        }

        // JS function args (no types)
        const args = inputs
            .map(inp => {
                if (!inp.name || !inp.type) {
                    throw new Error("Each input must have 'name' and 'type'.");
                }
                return inp.name;
            })
            .join(", ");

        return `
${dsComment}class Solution {
    ${functionName}(${args}) {
        // Write your code here

    }
}
`.trim();

    } catch (err) {
        return `// ERROR: ${err.message}`;
    }
}
