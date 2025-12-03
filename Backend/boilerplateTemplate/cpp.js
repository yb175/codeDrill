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

        // Include DS structs based on usage
        let structs = "";
        const types = new Set(inputs.map(i => i.type));

        if (types.has("ListNode")) {
            structs += `
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};
`;
        }

        if (types.has("TreeNode")) {
            structs += `
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right)
        : val(x), left(left), right(right) {}
};
`;
        }

        const mappedReturnType = cpp_mapper[returnType];
        if (!mappedReturnType) {
            throw new Error(`Unsupported return type in C++: ${returnType}`);
        }

        const args = inputs
            .map(inp => {
                const mappedType = cpp_mapper[inp.type];
                if (!mappedType) {
                    throw new Error(`Unsupported input type in C++: ${inp.type}`);
                }
                return `${mappedType} ${inp.name}`;
            })
            .join(", ");

        // *** FINAL WORKING TEMPLATE ***
        return `
#include <bits/stdc++.h>
#include <algorithm>
using namespace std;

${structs}
class Solution {
public:
    ${mappedReturnType} ${functionName}(${args}) {

    }
};

int main() {
    Solution sol;
    return 0;
}
`.trim();

    } catch (err) {
        return `// ERROR: ${err.message}`;
    }
}
