export function findParentCat(id:number, categories:any) {
    for(let cat of categories) {
      if(cat.id==id) {
        return cat;
      }
    } 
    return null;
}
export function findChildCat(id:string,categories:any) {
    for(let cat of categories) {
    for(let child of cat.children) {
      console.log("ChildId",child.id);
      if(child.id==Number(id)) {
        return child;
      }
    }
  }
  return null;
}