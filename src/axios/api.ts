import axios from "axios";
import { baseURL } from "./baseURL";
function apiCall(method:string, endpoint:string, body = null, authorization = null) {
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization:""
    };

    if (authorization) {
        headers.Authorization = `Bearer ${authorization}`;
    }

    return axios({
        method,
        url: baseURL + endpoint,
        headers,
        data: body
    });
}

export default apiCall;