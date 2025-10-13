/**
 * Returns the language code for a given language name.
 * The language code is used to identify the language in the
 * Judge0 API.
 * Supported languages are: c++, cpp, java, python, and python3.
 * @param {string} lang - The language name.
 * @returns {number} The language code.
 */
function getLanguageCode(lang){
    const opt = {
        "c++": 54,
        "cpp": 54,
        "java": 62,
        "python": 71,
        "python3": 71
    };
    return opt[lang.toLowerCase()];
}

export default getLanguageCode;