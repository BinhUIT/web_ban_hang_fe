import toast from "react-hot-toast";
import { clearLocalStorage } from "./clearLocalStorage";

export const onTokenExpire = (navigate:any)=> {
    toast.error("You have been logout, please login again");
    clearLocalStorage();
    navigate("/login");
}