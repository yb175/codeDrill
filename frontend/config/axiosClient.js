import axios from "axios" 
const axiosClient = axios.create({
    baseURL : "http://localhost:3000",
    timeout : 0, 
    headers : {
        "Content-Type" : "application/json"
    },
    withCredentials : true 
})

export default axiosClient 