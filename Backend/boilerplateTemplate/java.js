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

        // Detect DS types
        let dsComment = "";
        const inputTypes = inputs.map(i => i.type);
        const unique = new Set(inputTypes);

        // Add ListNode comment
        if (unique.has("ListNode")) {
            dsComment += `// Definition for singly-linked list.\n`;
            dsComment += `// class ListNode {\n`;
            dsComment += `//     int val;\n`;
            dsComment += `//     ListNode next;\n`;
            dsComment += `//     ListNode() {}\n`;
            dsComment += `//     ListNode(int val) { this.val = val; }\n`;
            dsComment += `//     ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n`;
            dsComment += `// }\n\n`;
        }

        // Add TreeNode comment
        if (unique.has("TreeNode")) {
            dsComment += `// Definition for a binary tree node.\n`;
            dsComment += `// class TreeNode {\n`;
            dsComment += `//     int val;\n`;
            dsComment += `//     TreeNode left;\n`;
            dsComment += `//     TreeNode right;\n`;
            dsComment += `//     TreeNode() {}\n`;
            dsComment += `//     TreeNode(int val) { this.val = val; }\n`;
            dsComment += `//     TreeNode(int val, TreeNode left, TreeNode right) {\n`;
            dsComment += `//         this.val = val;\n`;
            dsComment += `//         this.left = left;\n`;
            dsComment += `//         this.right = right;\n`;
            dsComment += `//     }\n`;
            dsComment += `// }\n\n`;
        }

        // Validate return type
        const mappedReturn = java_mapper[returnType];
        if (!mappedReturn) {
            throw new Error(`Unsupported return type in Java: ${returnType}`);
        }

        // Validate and map inputs
        const args = inputs
            .map((inp) => {
                if (!inp.name || !inp.type) {
                    throw new Error("Each input must have 'name' and 'type'.");
                }

                const mappedType = java_mapper[inp.type];
                if (!mappedType) {
                    throw new Error(`Unsupported input type in Java: ${inp.type}`);
                }

                return `${mappedType} ${inp.name}`;
            })
            .join(", ");

        return `
${dsComment}class Solution {
    public ${mappedReturn} ${functionName}(${args}) {
        // Write your code here

    }
}
`.trim();

    } catch (err) {
        return `// ERROR: ${err.message}`;
    }
}
