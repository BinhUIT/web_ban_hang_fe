import toast from "react-hot-toast";
import { clearLocalStorage } from "./clearLocalStorage";

export const onTokenExpire = async (navigate:any)=> {
    const refreshToken = localStorage.getItem("refreshToken");
    //const response = await fetch()
    if(!refreshToken) {
        toast.error("You have been logout, please login again");
        clearLocalStorage();
        navigate("/login");
    }
    
}