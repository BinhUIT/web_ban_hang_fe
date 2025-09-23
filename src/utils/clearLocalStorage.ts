export const clearLocalStorage = () =>{
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("token_expire_at");
}