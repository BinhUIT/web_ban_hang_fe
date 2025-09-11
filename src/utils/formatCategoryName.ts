
export const formatCategoryName =(categories:string[],categoriesArray:any[]) => {
  
    let res="";
    for(let i=0;i<categories.length-1;i++) {
      res=res+categories[i]+"/";
    } 
    res=res+categories[categories.length-1];
    return res;
  };
