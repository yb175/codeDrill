import cpp_mapper from "../mapper/cpp_maper.js";

export default function cpp_boilerplate_template(functionName, returnType, inputs) {
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

        // Detect if any DS comment is needed
        let dsComment = "";

        const dsTypes = inputs.map(i => i.type);
        const uniqueDS = new Set(dsTypes);

        if (uniqueDS.has("ListNode")) {
            dsComment += `// Definition for singly-linked list.\n`;
            dsComment += `// struct ListNode {\n`;
            dsComment += `//     int val;\n`;
            dsComment += `//     ListNode *next;\n`;
            dsComment += `//     ListNode() : val(0), next(nullptr) {}\n`;
            dsComment += `//     ListNode(int x) : val(x), next(nullptr) {}\n`;
            dsComment += `//     ListNode(int x, ListNode *next) : val(x), next(next) {}\n`;
            dsComment += `// };\n\n`;
        }

        if (uniqueDS.has("TreeNode")) {
            dsComment += `// Definition for a binary tree node.\n`;
            dsComment += `// struct TreeNode {\n`;
            dsComment += `//     int val;\n`;
            dsComment += `//     TreeNode *left;\n`;
            dsComment += `//     TreeNode *right;\n`;
            dsComment += `//     TreeNode() : val(0), left(nullptr), right(nullptr) {}\n`;
            dsComment += `//     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n`;
            dsComment += `//     TreeNode(int x, TreeNode *left, TreeNode *right)\n`;
            dsComment += `//         : val(x), left(left), right(right) {}\n`;
            dsComment += `// };\n\n`;
        }

        // Validate and map return type
        const mappedReturnType = cpp_mapper[returnType];
        if (!mappedReturnType) {
            throw new Error(`Unsupported return type in C++: ${returnType}`);
        }

        // Validate and map args
        const args = inputs
            .map((inp) => {
                if (!inp.name || !inp.type) {
                    throw new Error("Each input must have 'name' and 'type'.");
                }

                const mappedType = cpp_mapper[inp.type];
                if (!mappedType) {
                    throw new Error(`Unsupported input type in C++: ${inp.type}`);
                }

                return `${mappedType} ${inp.name}`;
            })
            .join(", ");

        return `
${dsComment}class Solution {
public:
    ${mappedReturnType} ${functionName}(${args}) {
        // Write your code here

    }
};
`.trim();

    } catch (err) {
        return `// ERROR: ${err.message}`;
    }
}
