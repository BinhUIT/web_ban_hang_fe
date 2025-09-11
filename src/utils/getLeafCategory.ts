function dfs(parentCat,res) {
    if(!parentCat) {
      return;
    }
    if(!parentCat.children||parentCat.children.length==0) {
      res.push(parentCat);
    } 
    else {
      for(let child of parentCat.children) {
        dfs(child,res);
      } 
    }
  }
  export const getLeafCategory = (prarentCat)=>{
    const res = [];
    dfs(prarentCat, res);
    return res;
  } 
  