import { useEffect, useState } from "react";
import CategoryItem from "./CategoryItem";
import { baseURL } from "../axios/baseURL";
import toast from "react-hot-toast";

const CategoriesSection = () => {
  const [listCategories, setListCategories] = useState([]);
  const [backButtonEnable, setBackButtonEnable] = useState(false); 
  const [categoriesStack, setCategoriesStack] = useState([]);
  useEffect(()=>{
    const responseFromServer = fetch(baseURL+"/unsecure/category?isParent=true");
    responseFromServer.then(result=>{
      result.json().then(data=>{
        setListCategories(data);
      }).catch(err=>{
        toast.error("Server error, please reload page");
      })
    }).catch(err=>{
      toast.error("Server error, please reload page");
    })
  },[]);
  function clickViewMoreChildCategory(cat:object) {
    if(cat&&cat?.children.length!=0) {
      setBackButtonEnable(true);
      const tempCategoryStack = categoriesStack;
      tempCategoryStack.push(listCategories); 
      setCategoriesStack(tempCategoryStack);
      setListCategories(cat?.children);
    }
  }
  function clickBackButton() {
    const listPrevCategories = categoriesStack[categoriesStack.length-1];
    
    console.log(listPrevCategories);
    setListCategories(listPrevCategories);
    setCategoriesStack(categoriesStack.pop());
    if(listPrevCategories[0].parentNumber==-1) {
      setBackButtonEnable(false);
    }

  }
   
  return (
    <div className="max-w-screen-2xl px-5 mx-auto mt-24"> 
     
      <h2 className="text-black text-5xl font-normal tracking-[1.56px] max-sm:text-4xl mb-12">
        Our Categories
      </h2> 
      {backButtonEnable&&<button
        onClick={(e)=>{
          e.preventDefault();
          clickBackButton();
        }}
        className="mb-6 px-4 py-2 bg-secondaryBrown text-white rounded-lg cursor-pointer hover:bg-brown-700 transition" 
      >
        ← Back
      </button>}
      <div className="flex justify-between flex-wrap gap-y-10">
        {listCategories&&listCategories.map(item=>{
          return <CategoryItem
          
          category={item}
          clickFunction={clickViewMoreChildCategory}
          key={"category "+item?.id}
        />
        })}
      </div>
    </div>
  );
};
export default CategoriesSection;
