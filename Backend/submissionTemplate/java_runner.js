// final_java_single_test_generator.js

export default function java_runner(
  userTemplate,
  functionName,
  returnType,
  inputs
) {
  if (!userTemplate || !functionName || !returnType || !Array.isArray(inputs)) {
    return "// ERROR: Missing arguments";
  }

  const callArgs = inputs.map((i) => i.name).join(", ");
  
  // SIMPLIFIED: No complex parsing, just direct Java code
  const parseInputs = inputs.map((inp) => {
    if (inp.type === "TreeNode") {
      return `        TreeNode ${inp.name} = buildTree(getArrayFromJson(inputStr, "${inp.name}"));`;
    } else if (inp.type === "ListNode") {
      return `        ListNode ${inp.name} = buildList(getArrayFromJson(inputStr, "${inp.name}"));`;
    } else if (inp.type === "int[]") {
      return `        int[] ${inp.name} = parseIntArray(getArrayFromJson(inputStr, "${inp.name}"));`;
    } else if (inp.type === "string[]") {
      return `        String[] ${inp.name} = parseStringArray(getArrayFromJson(inputStr, "${inp.name}"));`;
    } else if (inp.type === "int") {
      return `        int ${inp.name} = Integer.parseInt(getSimpleValue(inputStr, "${inp.name}"));`;
    } else if (inp.type === "string") {
      return `        String ${inp.name} = getSimpleValue(inputStr, "${inp.name}").replaceAll("^\\"|\\"$", "");`;
    } else if (inp.type === "bool") {
      return `        boolean ${inp.name} = Boolean.parseBoolean(getSimpleValue(inputStr, "${inp.name}"));`;
    }
    return `        // Unsupported type: ${inp.type}`;
  }).join("\n");

  // Return serialization
  let serializer = "";
  switch (returnType) {
    case "int":
      serializer = `        result = Integer.toString((Integer)output);`;
      break;
    case "string":
      serializer = `        result = "\\"" + (String)output + "\\"";`;
      break;
    case "bool":
      serializer = `        result = Boolean.toString((Boolean)output);`;
      break;
    case "int[]":
      serializer = `        result = arrayToString((int[])output);`;
      break;
    case "string[]":
      serializer = `        result = stringArrayToString((String[])output);`;
      break;
    case "ListNode":
      serializer = `        result = listToString((ListNode)output);`;
      break;
    case "TreeNode":
      serializer = `        result = treeToString((TreeNode)output);`;
      break;
    default:
      serializer = `        result = "UNSUPPORTED_RETURN_TYPE";`;
  }

  return `import java.util.*;

${userTemplate}

class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

public class Main {
    
    // SIMPLE JSON PARSING - NO REGEX
    static String getArrayFromJson(String json, String key) {
        int start = json.indexOf("\\"" + key + "\\":");
        if (start == -1) return "[]";
        start += key.length() + 3;
        
        int bracket = 0;
        int end = start;
        for (int i = start; i < json.length(); i++) {
            char c = json.charAt(i);
            if (c == '[') bracket++;
            else if (c == ']') {
                bracket--;
                if (bracket == 0) {
                    end = i + 1;
                    break;
                }
            } else if (bracket == 0 && (c == ',' || c == '}')) {
                end = i;
                break;
            }
        }
        return json.substring(start, end).trim();
    }
    
    static String getSimpleValue(String json, String key) {
        int start = json.indexOf("\\"" + key + "\\":");
        if (start == -1) return "0";
        start += key.length() + 3;
        
        int end = json.length();
        for (int i = start; i < json.length(); i++) {
            char c = json.charAt(i);
            if (c == ',' || c == '}') {
                end = i;
                break;
            }
        }
        return json.substring(start, end).trim();
    }
    
    static int[] parseIntArray(String arrStr) {
        arrStr = arrStr.trim();
        if (arrStr.equals("[]") || arrStr.isEmpty()) return new int[0];
        if (arrStr.startsWith("[")) arrStr = arrStr.substring(1);
        if (arrStr.endsWith("]")) arrStr = arrStr.substring(0, arrStr.length() - 1);
        
        String[] parts = arrStr.split(",");
        int[] result = new int[parts.length];
        for (int i = 0; i < parts.length; i++) {
            try {
                result[i] = Integer.parseInt(parts[i].trim());
            } catch (Exception e) {
                result[i] = 0;
            }
        }
        return result;
    }
    
    static String[] parseStringArray(String arrStr) {
        arrStr = arrStr.trim();
        if (arrStr.equals("[]") || arrStr.isEmpty()) return new String[0];
        
        List<String> result = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;
        
        for (int i = 0; i < arrStr.length(); i++) {
            char c = arrStr.charAt(i);
            if (c == '\\"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                String val = current.toString().trim();
                if (val.startsWith("\\"") && val.endsWith("\\"")) {
                    val = val.substring(1, val.length() - 1);
                }
                result.add(val);
                current = new StringBuilder();
            } else if (c != '[' && c != ']') {
                current.append(c);
            }
        }
        
        if (current.length() > 0) {
            String val = current.toString().trim();
            if (val.startsWith("\\"") && val.endsWith("\\"")) {
                val = val.substring(1, val.length() - 1);
            }
            result.add(val);
        }
        
        return result.toArray(new String[0]);
    }
    
    static ListNode buildList(String arrStr) {
        int[] arr = parseIntArray(arrStr);
        if (arr.length == 0) return null;
        
        ListNode head = new ListNode(arr[0]);
        ListNode curr = head;
        for (int i = 1; i < arr.length; i++) {
            curr.next = new ListNode(arr[i]);
            curr = curr.next;
        }
        return head;
    }
    
    static TreeNode buildTree(String arrStr) {
        arrStr = arrStr.trim();
        if (arrStr.equals("[]") || arrStr.isEmpty()) return null;
        
        // Parse array
        if (arrStr.startsWith("[")) arrStr = arrStr.substring(1);
        if (arrStr.endsWith("]")) arrStr = arrStr.substring(0, arrStr.length() - 1);
        
        String[] parts = arrStr.split(",");
        Integer[] values = new Integer[parts.length];
        for (int i = 0; i < parts.length; i++) {
            String part = parts[i].trim();
            if (part.equals("null")) {
                values[i] = null;
            } else {
                try {
                    values[i] = Integer.parseInt(part);
                } catch (Exception e) {
                    values[i] = null;
                }
            }
        }
        
        if (values.length == 0 || values[0] == null) return null;
        
        TreeNode root = new TreeNode(values[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        
        int i = 1;
        while (!queue.isEmpty() && i < values.length) {
            TreeNode node = queue.poll();
            
            if (i < values.length && values[i] != null) {
                node.left = new TreeNode(values[i]);
                queue.add(node.left);
            }
            i++;
            
            if (i < values.length && values[i] != null) {
                node.right = new TreeNode(values[i]);
                queue.add(node.right);
            }
            i++;
        }
        
        return root;
    }
    
    static String arrayToString(int[] arr) {
        if (arr == null) return "[]";
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < arr.length; i++) {
            if (i > 0) sb.append(",");
            sb.append(arr[i]);
        }
        sb.append("]");
        return sb.toString();
    }
    
    static String stringArrayToString(String[] arr) {
        if (arr == null) return "[]";
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < arr.length; i++) {
            if (i > 0) sb.append(",");
            sb.append("\\"").append(arr[i]).append("\\"");
        }
        sb.append("]");
        return sb.toString();
    }
    
    static String listToString(ListNode head) {
        if (head == null) return "[]";
        List<Integer> list = new ArrayList<>();
        while (head != null) {
            list.add(head.val);
            head = head.next;
        }
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < list.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append(list.get(i));
        }
        sb.append("]");
        return sb.toString();
    }
    
    static String treeToString(TreeNode root) {
        if (root == null) return "[]";
        List<String> result = new ArrayList<>();
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            if (node != null) {
                result.add(String.valueOf(node.val));
                queue.add(node.left);
                queue.add(node.right);
            } else {
                result.add("null");
            }
        }
        
        // Remove trailing nulls
        while (result.size() > 0 && result.get(result.size() - 1).equals("null")) {
            result.remove(result.size() - 1);
        }
        
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < result.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append(result.get(i));
        }
        sb.append("]");
        return sb.toString();
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        StringBuilder sb = new StringBuilder();
        while (sc.hasNextLine()) {
            sb.append(sc.nextLine());
        }
        String inputStr = sb.toString().trim();

${parseInputs}

        Solution sol = new Solution();
        Object output = sol.${functionName}(${callArgs});

        String result;
${serializer}

        System.out.print(result);
    }
}
`.trim();
}