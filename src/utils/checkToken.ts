export const checkToken = ()=>{
    const token = localStorage.getItem("token");
        if(!token) {
            return null;
        }
        const currentDate = new Date();
        const tokenExpireAt= localStorage.getItem("token_expire_at");
        if(!tokenExpireAt) {
            return null;
        }
        if(new Date(tokenExpireAt)<=currentDate) {
            return null;
        }
        return token;
}
