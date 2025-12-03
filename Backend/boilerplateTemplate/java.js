import java_mapper from "../mapper/java_mapper.js";

export default function java_template(functionName, returnType, inputs) {
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

        let structs = "";
        const types = new Set(inputs.map(i => i.type));

        if (types.has("ListNode")) {
            structs += `
class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}
`;
        }

        if (types.has("TreeNode")) {
            structs += `
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) { 
        this.val = val; 
        this.left = left; 
        this.right = right; 
    }
}
`;
        }

        const mappedReturn = java_mapper[returnType];
        if (!mappedReturn) {
            throw new Error(`Unsupported return type in Java: ${returnType}`);
        }

        const args = inputs
            .map(inp => {
                const mappedType = java_mapper[inp.type];
                if (!mappedType) throw new Error(`Unsupported input type in Java: ${inp.type}`);
                return `${mappedType} ${inp.name}`;
            })
            .join(", ");

        return `
${structs}
class Solution {
    public ${mappedReturn} ${functionName}(${args}) {

    }
}
`.trim();

    } catch (err) {
        return `// ERROR: ${err.message}`;
    }
}
