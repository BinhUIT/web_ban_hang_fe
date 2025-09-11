export function covertCatsFromServer(categories:any[]) {
    
    return categories.map((item, index)=>{
        const result = {
            title:item.name,
            url:"",
            items:new Array()
        };
        for(let child of item.children) {
            result.items.push({
                name:child.name,
                url:""
            });
        }
        return result;
    })
}
