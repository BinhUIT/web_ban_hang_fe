import toast from "react-hot-toast";
import { baseURL } from "../axios/baseURL";
import {
  ProductGrid,
  ProductGridWrapper,
  ShopFilterAndSort,
  ShowingPagination,
} from "../components";

import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import { findChildCat } from "../utils/findCat";

const ShopPageContent = ({ categories, page} : { categories: object[]; page: number; }) => {
  const [sortCriteria, setSortCriteria] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("");
  
  const [pageData, setPageData] = useState({});
  const [sizeList, setSizeList] = useState<number[]>([]);
  const [colorList, setColorList] = useState<number[]>([]);
  const [catStates, setCatStates] = useState<Map<number,boolean>>(new Map());
  //const [catList, setCatList] = useState<number[]>([]);
  const [searchParams]= useSearchParams();

useEffect(()=>{
  getPage(1);
  

},[sortCriteria,priceRange, colorList, sizeList]); 
useEffect(()=>{
  if(catStates) {
  getPage(1); 
  }
  console.log("Trigger by cat state");

   
},[catStates]);   
 function findChildCatById(id:string) {
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
 function checkParent(parentCat:any, tempCheckMap) { 
    
    for(let child of parentCat.children) {
        tempCheckMap.set(child.id,true);
      }
    setCatStates(tempCheckMap);
    console.log("Check Parent");

  } 
  function checkChild(childCat,tempCheckMap) {
    
    tempCheckMap.set(childCat.id,true);
    const parent = findParentCatById(childCat.parentNumber);
    for(let child of parent.children) {
      if(!tempCheckMap.get(child.id)||tempCheckMap.get(child.id)==false) { 
        setCatStates(tempCheckMap);
        return;
      }
    }
    
    tempCheckMap.set(parent.id,true);
    setCatStates(tempCheckMap);
  } 
    function findParentCatById(id:number) {
    for(let cat of categories) {
      if(cat.id==id) {
        return cat;
      }
    } 
    return null;
  }
useEffect(()=>{ 
   const choosingCats = searchParams.getAll("catIds");
   if(!choosingCats||choosingCats.length==0) {
    return;
   } 
   console.log("Choosing cats",choosingCats);
   const newCheckMap = new Map();
   for(let catId of choosingCats) {
    newCheckMap.set(Number(catId),true);

   }
   setCatStates(newCheckMap);
  /*if(!categories||categories.length==0) {
      return;
    }
    console.log("Trigger by param and categories");
   const choosingCats = searchParams.getAll("catIds"); 
   
   const newCheckMap = new Map();
   if((!choosingCats||choosingCats.length==0)) {
    
    for(let cat of categories) {
      newCheckMap.set(cat.id,true);
      for(let child of cat.children) {
        newCheckMap.set(child.id,true);
      }
    }
    
    setCatStates(newCheckMap);
   } 
   else {
    
    for(let cat of categories) {
      newCheckMap.set(cat.id,false);
      for(let child of cat.children) {
        newCheckMap.set(child.id,false);
      }
      

      
    }   
    
    
    
    const child= findChildCatById(choosingCats[0]);
    if(choosingCats.length>1) {
      
      const parent = findParentCatById(child.parentNumber);
      checkParent(parent,newCheckMap);
      console.log("PARENT");
    }
    else {
      console.log("CHECK CHILD");
      checkChild(child,newCheckMap);
    }

    
    }*/
  
},[])

async function getPage(page:number ) {
  
  let queryString="";
 
  
  
  if(sortCriteria=='default'||sortCriteria=='') {
    queryString=`?page=${page-1}&size=21`;
  }
  if(sortCriteria=='rating') {
    queryString=`?page=${page-1}&size=21&sortCriteria=rating&order=desc`;
  }
  if(sortCriteria=='price-asc') {
    queryString=`?page=${page-1}&size=21&sortCriteria=minPrice&order=asc`;
  } 
  if(sortCriteria=='price-desc') {
    queryString=`?page=${page-1}&size=21&sortCriteria=minPrice&order=desc`;
  }
 
  catStates.forEach((value,key)=>{
    if(value) {
      console.log("Key",key);
      
      queryString+=`&catIds=${key}`;
      
    }
  })
  if(searchParams.get("keyword")) {
    queryString+=`&keyword=${searchParams.get("keyword")}`;
  }
  if(priceRange!="") {
    queryString+=priceRange;
  }
  if(colorList.length!=0) {
    for(let i of colorList) {
      queryString+=`&colorIds=${i}`
    }
  } 
  if(sizeList.length!=0) {
    for(let i of sizeList) {
      queryString+=`&sizeIds=${i}`
    }
  }
  console.log(queryString);
  const response = await fetch(baseURL+`/unsecure/all_enable_products${queryString}`);
  if(response.ok) {
    const data= await response.json();
    setPageData(data);
  }
  else {
    toast.error("Error from server, please reload page");
  }
  
}

  return (
    <> 
    <div className="max-w-screen-2xl mx-auto mt-12 px-5 grid grid-cols-1 lg:grid-cols-4 gap-8">
  {/* Sidebar Filter */}
  
      <ShopFilterAndSort sortCriteria={sortCriteria} setSortCriteria={setSortCriteria} categories={categories} setPriceRange={setPriceRange} setSizeList={setSizeList} setColorList={setColorList} categoryCheckStates={catStates} setCategoryCheckStates={setCatStates}/>
      
       <main className="lg:col-span-3">
    <ProductGrid products={pageData?.content} />

    <Pagination 
      totalPages={pageData.page?.totalPages} 
      currentPage={pageData.page?.number + 1} 
      onPageChange={getPage} 
    />
  </main>
  </div>
    </>
  );
};
export default ShopPageContent;
