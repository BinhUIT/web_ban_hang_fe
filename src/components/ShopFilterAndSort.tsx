import { useEffect, useState } from "react";
import { useAppSelector } from "../hooks";
import { useSearchParams } from "react-router-dom";
import AttributeFilter from "./AttriuteFilter";

const ShopFilterAndSort = ({
  sortCriteria,
  setSortCriteria,
  categories,setPriceRange,setSizeList, setColorList,
  categoryCheckStates, setCategoryCheckStates
}: {
  sortCriteria: string;
  setSortCriteria: (value: string) => void;
  categories: object[];
  setPriceRange: (value:string)=>void;
  setSizeList: (value:(value:number[])=>number[])=>void;
  setColorList: (value:(value:number[])=>number[])=>void;
  categoryCheckStates: Map<number,boolean>;
  setCategoryCheckStates: (value:Map<number,boolean>)=>void;
}) => {
  
  
  const [searchParams] = useSearchParams(); 
  
  
  function checkParent(parentCat:any) { 
    const tempCheckMap = new Map(categoryCheckStates);
    dfs(parentCat,tempCheckMap,true);
    setCategoryCheckStates(tempCheckMap);
    console.log("Check Parent");

  }
  function unCheckParent(parentCat:any) {
    const tempCheckMap = new Map(categoryCheckStates);
    dfs(parentCat,tempCheckMap,false);
    setCategoryCheckStates(tempCheckMap);
  }
  function unCheckChild(childCat:any) {
    const tempCheckMap = new Map(categoryCheckStates);
    tempCheckMap.set(childCat.id,false);
    tempCheckMap.set(childCat.parentNumber,false);
    setCategoryCheckStates(tempCheckMap);
  }
  function checkChild(childCat:any) {
    const tempCheckMap = new Map(categoryCheckStates);
    tempCheckMap.set(childCat.id,true);
    const parent = findParentCatById(childCat.parentNumber);
    for(let child of parent.children) {
      if(!tempCheckMap.get(child.id)||tempCheckMap.get(child.id)==false) { 
        setCategoryCheckStates(tempCheckMap);
        return;
      }
    }
    
    tempCheckMap.set(parent.id,true);
    setCategoryCheckStates(tempCheckMap);
  }
  function findParentCatById(id:number) {
    for(let cat of categories) {
      if(cat.id==id) {
        return cat;
      }
    } 
    return null;
  }
 function dfs(category:any,checkMap:any,value:any) {
  if(category==null) {
    return;
  }
  checkMap.set(category.id, value);
  if(category.children&&category.children.length!=0) {
    for(let child of category.children) {
      dfs(child,checkMap,value);
    }
  }
 }

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
  /*useEffect(()=>{
    if(!categories||categories.length==0) {
      return;
    }
   const choosingCats = searchParams.getAll("catIds"); 
   
   const newCheckMap = new Map(categoryCheckStates);
   if((!choosingCats||choosingCats.length==0)) {
    
    for(let cat of categories) {
      dfs(cat,newCheckMap,true);
    }
    
    setCategoryCheckStates(newCheckMap);
   } 
   else {
    if(!categories||categories.length==0) {
      return;
    }
    for(let cat of categories) {
      dfs(cat,newCheckMap,false); 
      
    }   
    setCategoryCheckStates(newCheckMap);
    const child= findChildCatById(choosingCats[0]);
    if(choosingCats.length>1) {
      
      const parent = findParentCatById(child.parentNumber);
      checkParent(parent);
      console.log("PARENT");
    }
    else {
      console.log("CHECK CHILD");
      checkChild(child);
    }

    
    }
  },[categories]);*/
  return (
    <div className="flex flex-col gap-6 px-4 py-6 border-r">
      {/* Sort */}
      <div>
        <h3 className="font-semibold mb-2">Sort by</h3>
        <select
          className="border border-[rgba(0,0,0,0.40)] px-2 py-1 w-full"
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>{
            
            setSortCriteria(e.target.value);
          }
          }
          value={sortCriteria}
        >
          <option value="default">Default</option>
          <option value="rating">Rating</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      {/* Categories */}
      <div>
  <h3 className="font-semibold mb-2">Categories</h3>
  <ul className="flex flex-col gap-1 text-gray-700">
    {categories.map((item, index) => (
      <li key={"Parent" + index}> 
      <input type="checkbox" className="mr-2" checked={categoryCheckStates.get(item?.id)}  onChange={(e)=>{
        
       if(!e.target.checked) {
        unCheckParent(item);
       }
       else {
        checkParent(item);
       }
      }} />
        <label className="font-semibold">{item.name}</label>
        <ul className="ml-4 flex flex-col gap-1">
          {item.children.map((childItem, childIndex) => (
            <li key={"Child" + childIndex}>
              <input type="checkbox" className="mr-2" checked={categoryCheckStates.get(childItem?.id)} onChange={(e)=>{
                if(!e.target.checked) {
                  unCheckChild(childItem);
                }
                else {
                  checkChild(childItem);
                }
              }}  />
              <label>{childItem.name}</label>
            </li>
          ))}
        </ul>
      </li>
    ))}
  </ul>

  {/* Buttons */}
  
  
</div>

      {/* Price Range */}
      <div className="mb-4">
  <h3 className="font-semibold mb-2">Price Range</h3>
  
  <form 
    onSubmit={(e) => {
      e.preventDefault();
      const priceRangeQueryString = `&fromPrice=${e.target.from.value}&toPrice=${e.target.to.value}`;
      setPriceRange(priceRangeQueryString);
    }} 
    className="space-y-2"
  >
    <div className="flex items-center space-x-2">
      <input 
        type="number" 
        placeholder="From" 
        name="from"
        className="w-full border rounded p-1 text-sm"
        min="0" required defaultValue={0}
      />
      <span>-</span>
      <input 
        type="number" 
        placeholder="To" 
        name="to"
        className="w-full border rounded p-1 text-sm"
        min="0" required 
      />
    </div>

    <div className="flex space-x-2">
      <button 
        type="submit" 
        className="px-4 py-2 bg-secondaryBrown text-white rounded hover:bg-opacity-80"
      >
        Apply
      </button>
      <button 
        type="button" 
        className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
        onClick={() => {
          setPriceRange("");
        }}
      >
        Clear
      </button>
    </div>
  </form>
</div>

      {/* Sizes */}
      <AttributeFilter listAtribute={[
      { id: 1, value: "XS" },
      { id: 2, value: "XS/S" },
      { id: 3, value: "S" },
      { id: 4, value: "M" },
      { id: 5, value: "ML" },
      { id: 6, value: "L" },
      { id: 7, value: "LX/L" },
      { id: 8, value: "XL" },
      { id: 9, value: "XL/XXL" },
      { id: 10, value: "XXL/3XL" },
      { id: 11, value: "3XL" },
    ]} title={"Sizes"} setFunction={setSizeList}></AttributeFilter>
    
  <AttributeFilter listAtribute={[
      { id: 1, value: "RED" },
      { id: 2, value: "GREEN" },
      { id: 3, value: "WHITE" },
      { id: 4, value: "BLACK" },
      { id: 5, value: "PURPLE" },
      { id: 6, value: "BLUE" },
      { id: 7, value: "YELLOW" },
      { id: 8, value: "GRAY" },
      { id: 9, value: "BROWN" },
      { id: 10, value: "ORANGE" },
      { id: 11, value: "PINK" },
    ]} title={"Colors"} setFunction={setColorList}></AttributeFilter>
    </div>
  
  );
};
export default ShopFilterAndSort;
