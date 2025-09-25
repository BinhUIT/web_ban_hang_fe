export const fetchData= async  (url:string, token:string, setFunction:any)=>{
    let response;
    if(!(token&&token=="")) {
        response = await fetch(url, {
            method:"GET",
            headers:{
                "Content-type":"application/json"
            }
        });
    }
    else {
        response = await fetch(url, {
            method:"GET",
            headers:{
                "Content-type":"application/json",
                "Authorization":"Bearer "+token
            }
        });
    };
    if(response.ok) {
        const data = await response.json();
        setFunction(data);
    }
    
}
