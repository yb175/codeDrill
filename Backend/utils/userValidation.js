import validator from "validator"
export default function checkValidation(userInfo,res) {
  try {
    const { name, email, password } = userInfo;
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }
    if (name.length<3 || name.length>20){
        throw new Error("Name must be between 3 and 20 characters");
    }
    if(!validator.isEmail(email)){
        throw new Error("Invalid email format") ; 
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Password must be strong") ; 
    }
    return userInfo ; 
  } catch (err) {
    return { err: err.message };
  }
}
