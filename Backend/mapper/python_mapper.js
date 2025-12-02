const python_mapper = {
    "int": "int",
    "string": "str",
    "bool": "bool",

    // Array types
    "int[]": "List[int]",
    "string[]": "List[str]",
    "bool[]": "List[bool]",

    // LeetCode DS types
    "ListNode": "ListNode",
    "TreeNode": "TreeNode",

    // Optional / fallback
    "any": "Any"
};

export default python_mapper;
