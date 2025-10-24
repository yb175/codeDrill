const decode = (str) => {
  if (!str) return "";             // null/undefined
  if (typeof str !== "string") return str; // numbers, booleans, etc
  try {
    return Buffer.from(str, "base64").toString("utf-8");
  } catch (err) {
    return str; // agar base64 nahi hai, asli value return
  }
};

export default decode;