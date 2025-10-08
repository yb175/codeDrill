import validator from "validator"
/**
 * Checks if the provided user information is valid.
 * @param {Object} userInfo - Object containing user information (name, email, password)
 * @param {Object} res - Express response object
 * @throws {Error} - If any of the fields are empty, or if the name is not between 3 and 20 characters, or if the email is not in a valid format, or if the password is not strong
 * @returns {Object} - Valid user information, or an error object with the error message
 */
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
