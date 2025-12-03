// final_cpp_single_test_generator.js

export default function cpp_runner(
  userTemplate,
  functionName,
  returnType,
  inputs
) {
  if (!userTemplate || !functionName || !returnType || !Array.isArray(inputs)) {
    return "// ERROR: Missing arguments";
  }

  // Build call arguments
  const callArgs = inputs.map((i) => i.name).join(", ");

  // Build parsing logic - USING YOUR MAPPER NAMES
  const parseInputs = inputs
    .map((inp) => {
      switch (inp.type) {
        case "int":
          return `    int ${inp.name} = parseInt(getValue(inputStr, "${inp.name}"));`;
        case "string":
          return `    string ${inp.name} = parseString(getValue(inputStr, "${inp.name}"));`;
        case "bool":
          return `    bool ${inp.name} = parseBool(getValue(inputStr, "${inp.name}"));`;
        case "int[]":
          return `    vector<int> ${inp.name} = parseIntArray(getValue(inputStr, "${inp.name}"));`;
        case "string[]":
          return `    vector<string> ${inp.name} = parseStringArray(getValue(inputStr, "${inp.name}"));`;
        case "ListNode":  // <-- Your mapper uses "ListNode"
          return `    ListNode* ${inp.name} = buildList(getValue(inputStr, "${inp.name}"));`;
        case "TreeNode":  // <-- Your mapper uses "TreeNode"
          return `    TreeNode* ${inp.name} = buildTree(getValue(inputStr, "${inp.name}"));`;
        default:
          return `    // Unsupported input type: ${inp.type}`;
      }
    })
    .join("\n");

  // Return serializer - ALSO USING YOUR MAPPER NAMES
  let serializer = "";
  switch (returnType) {
    case "int":
      serializer = `    result = to_string(output);`;
      break;
    case "string":
      serializer = `    result = "\\"" + output + "\\"";`;
      break;
    case "bool":
      serializer = `    result = output ? "true" : "false";`;
      break;
    case "int[]":
      serializer = `    result = vectorToString(output);`;
      break;
    case "string[]":
      serializer = `    result = vectorStringToString(output);`;
      break;
    case "ListNode":  // <-- Your mapper uses "ListNode"
      serializer = `    result = listToString(output);`;
      break;
    case "TreeNode":  // <-- Your mapper uses "TreeNode"
      serializer = `    result = treeToString(output);`;
      break;
    default:
      serializer = `    result = "UNSUPPORTED_RETURN_TYPE";`;
  }

  // Helper functions need to check for YOUR mapper names
  const needsListNode = inputs.some(i => i.type === "ListNode") || returnType === "ListNode";
  const needsTreeNode = inputs.some(i => i.type === "TreeNode") || returnType === "TreeNode";

  return `
#include <iostream>
#include <vector>
#include <string>
#include <queue>
#include <sstream>
#include <algorithm>
using namespace std;

// =====================================================
//                   DATA STRUCTURES
// =====================================================
${needsListNode ? generateListNodeBlock() : ''}
${needsTreeNode ? generateTreeNodeBlock() : ''}

// =====================================================
//                 JSON PARSING UTILITIES
// =====================================================
string getValue(const string& json, const string& key) {
    string search = "\\"" + key + "\\":";
    size_t start = json.find(search);
    if (start == string::npos) return "null";
    
    start += search.length();
    size_t end = json.length();
    int bracket = 0;
    bool inQuotes = false;
    
    for (size_t i = start; i < json.length(); i++) {
        char c = json[i];
        if (c == '\\"') {
            inQuotes = !inQuotes;
        } else if (!inQuotes) {
            if (c == '{' || c == '[') bracket++;
            else if (c == '}' || c == ']') bracket--;
            else if (c == ',' && bracket == 0) {
                end = i;
                break;
            } else if (c == '}' && bracket == -1) {
                end = i;
                break;
            }
        }
    }
    
    string value = json.substr(start, end - start);
    // Trim whitespace
    value.erase(0, value.find_first_not_of(" \\t\\n\\r"));
    value.erase(value.find_last_not_of(" \\t\\n\\r") + 1);
    return value;
}

int parseInt(const string& str) {
    if (str == "null") return 0;
    string s = str;
    if (s.front() == '\\"') s = s.substr(1);
    if (s.back() == '\\"') s = s.substr(0, s.length() - 1);
    return stoi(s);
}

string parseString(const string& str) {
    if (str == "null") return "";
    string s = str;
    if (s.front() == '\\"') s = s.substr(1);
    if (s.back() == '\\"') s = s.substr(0, s.length() - 1);
    return s;
}

bool parseBool(const string& str) {
    if (str == "null") return false;
    return str == "true" || str == "1";
}

vector<int> parseIntArray(const string& arrStr) {
    vector<int> result;
    if (arrStr == "null" || arrStr == "[]") return result;
    
    string content = arrStr;
    if (content.front() == '[') content = content.substr(1);
    if (content.back() == ']') content = content.substr(0, content.length() - 1);
    
    if (content.empty()) return result;
    
    stringstream ss(content);
    string item;
    while (getline(ss, item, ',')) {
        // Trim whitespace
        item.erase(0, item.find_first_not_of(" \\t\\n\\r"));
        item.erase(item.find_last_not_of(" \\t\\n\\r") + 1);
        
        if (item == "null" || item.empty()) {
            result.push_back(0);
        } else {
            result.push_back(stoi(item));
        }
    }
    return result;
}

vector<string> parseStringArray(const string& arrStr) {
    vector<string> result;
    if (arrStr == "null" || arrStr == "[]") return result;
    
    string content = arrStr;
    if (content.front() == '[') content = content.substr(1);
    if (content.back() == ']') content = content.substr(0, content.length() - 1);
    
    if (content.empty()) return result;
    
    vector<string> items;
    string current;
    bool inQuotes = false;
    
    for (char c : content) {
        if (c == '\\"') {
            inQuotes = !inQuotes;
            current += c;
        } else if (c == ',' && !inQuotes) {
            items.push_back(current);
            current.clear();
        } else {
            current += c;
        }
    }
    if (!current.empty()) items.push_back(current);
    
    for (string& item : items) {
        // Trim whitespace
        item.erase(0, item.find_first_not_of(" \\t\\n\\r"));
        item.erase(item.find_last_not_of(" \\t\\n\\r") + 1);
        
        if (item.front() == '\\"') item = item.substr(1);
        if (item.back() == '\\"') item = item.substr(0, item.length() - 1);
        result.push_back(item);
    }
    
    return result;
}

string vectorToString(const vector<int>& vec) {
    if (vec.empty()) return "[]";
    string result = "[";
    for (size_t i = 0; i < vec.size(); i++) {
        if (i > 0) result += ",";
        result += to_string(vec[i]);
    }
    result += "]";
    return result;
}

string vectorStringToString(const vector<string>& vec) {
    if (vec.empty()) return "[]";
    string result = "[";
    for (size_t i = 0; i < vec.size(); i++) {
        if (i > 0) result += ",";
        result += "\\"" + vec[i] + "\\"";
    }
    result += "]";
    return result;
}

// =====================================================
//                 USER SOLUTION
// =====================================================
${userTemplate}

// =====================================================
//                     MAIN RUNNER
// =====================================================
int main() {
    // Read entire input
    string inputStr;
    string line;
    while (getline(cin, line)) {
        inputStr += line;
    }
    
${parseInputs}

    Solution sol;
    auto output = sol.${functionName}(${callArgs});

    string result;
${serializer}

    cout << result;
    return 0;
}
`.trim();
}

// =====================================================
//                DATA STRUCTURE HELPERS
// =====================================================

function generateListNodeBlock() {
  return `
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* buildList(const string& arrStr) {
    vector<int> arr = parseIntArray(arrStr);
    if (arr.empty()) return nullptr;
    
    ListNode* head = new ListNode(arr[0]);
    ListNode* current = head;
    for (size_t i = 1; i < arr.size(); i++) {
        current->next = new ListNode(arr[i]);
        current = current->next;
    }
    return head;
}

string listToString(ListNode* head) {
    if (!head) return "[]";
    vector<int> result;
    while (head) {
        result.push_back(head->val);
        head = head->next;
    }
    return vectorToString(result);
}`;
}

function generateTreeNodeBlock() {
  return `
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* buildTree(const string& arrStr) {
    if (arrStr == "null" || arrStr == "[]") return nullptr;
    
    string content = arrStr;
    if (content.front() == '[') content = content.substr(1);
    if (content.back() == ']') content = content.substr(0, content.length() - 1);
    
    if (content.empty()) return nullptr;
    
    vector<string> parts;
    stringstream ss(content);
    string item;
    while (getline(ss, item, ',')) {
        // Trim whitespace
        item.erase(0, item.find_first_not_of(" \\t\\n\\r"));
        item.erase(item.find_last_not_of(" \\t\\n\\r") + 1);
        parts.push_back(item);
    }
    
    if (parts.empty() || parts[0] == "null") return nullptr;
    
    TreeNode* root = new TreeNode(stoi(parts[0]));
    queue<TreeNode*> q;
    q.push(root);
    
    size_t i = 1;
    while (!q.empty() && i < parts.size()) {
        TreeNode* node = q.front();
        q.pop();
        
        if (i < parts.size() && parts[i] != "null") {
            node->left = new TreeNode(stoi(parts[i]));
            q.push(node->left);
        }
        i++;
        
        if (i < parts.size() && parts[i] != "null") {
            node->right = new TreeNode(stoi(parts[i]));
            q.push(node->right);
        }
        i++;
    }
    
    return root;
}

string treeToString(TreeNode* root) {
    if (!root) return "[]";
    
    vector<string> result;
    queue<TreeNode*> q;
    q.push(root);
    
    while (!q.empty()) {
        TreeNode* node = q.front();
        q.pop();
        
        if (node) {
            result.push_back(to_string(node->val));
            q.push(node->left);
            q.push(node->right);
        } else {
            result.push_back("null");
        }
    }
    
    // Remove trailing nulls
    while (!result.empty() && result.back() == "null") {
        result.pop_back();
    }
    
    string res = "[";
    for (size_t i = 0; i < result.size(); i++) {
        if (i > 0) res += ",";
        res += result[i];
    }
    res += "]";
    return res;
}`;
}