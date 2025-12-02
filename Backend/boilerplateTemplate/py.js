import python_mapper from "../mapper/python_mapper.js";

export default function python_boilerplate_template(functionName, returnType, inputs) {
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

        // Collect DS usage
        const inputTypes = new Set(inputs.map(i => i.type));
        let dsComment = "";

        if (inputTypes.has("ListNode")) {
            dsComment += `# Definition for singly-linked list.\n`;
            dsComment += `# class ListNode:\n`;
            dsComment += `#     def __init__(self, val=0, next=None):\n`;
            dsComment += `#         self.val = val\n`;
            dsComment += `#         self.next = next\n\n`;
        }

        if (inputTypes.has("TreeNode")) {
            dsComment += `# Definition for a binary tree node.\n`;
            dsComment += `# class TreeNode:\n`;
            dsComment += `#     def __init__(self, val=0, left=None, right=None):\n`;
            dsComment += `#         self.val = val\n`;
            dsComment += `#         self.left = left\n`;
            dsComment += `#         self.right = right\n\n`;
        }

        // Validate inputs + map them
        const args = inputs
            .map(inp => {
                if (!inp.name || !inp.type) {
                    throw new Error("Each input must have 'name' and 'type'.");
                }

                const mappedType = python_mapper[inp.type];
                if (!mappedType) {
                    throw new Error(`Unsupported input type in Python: ${inp.type}`);
                }

                return `${inp.name}: ${mappedType}`;
            })
            .join(", ");

        const mappedReturn = python_mapper[returnType];
        if (!mappedReturn) {
            throw new Error(`Unsupported return type in Python: ${returnType}`);
        }

        return `
${dsComment}class Solution:
    def ${functionName}(self, ${args}) -> ${mappedReturn}:
        # Write your code here
        pass
`.trim();

    } catch (err) {
        return `# ERROR: ${err.message}`;
    }
}
